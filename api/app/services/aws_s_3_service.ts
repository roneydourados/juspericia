import { awsS3Config } from '../utils/aws_s3_config.js'
import mime from 'mime'
import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import type { MultipartFile } from '@adonisjs/core/bodyparser'
import fs from 'node:fs'

export default class AwsS3Service {
  async sendAwsS3File(input: { fileServerName: string; file: MultipartFile }) {
    const { file, fileServerName } = input

    try {
      if (!file.tmpPath) {
        throw new Error(`Arquivo inválido ou sem tmpPath: ${file.clientName}`)
      }

      const buffer = fs.readFileSync(file.tmpPath)

      if (!buffer.length) {
        throw new Error(`Arquivo vazio: ${file.clientName}`)
      }

      const ContentType = mime.getType(fileServerName) || 'application/octet-stream'

      await awsS3Config.s3Client.send(
        new PutObjectCommand({
          Bucket: awsS3Config.bucketName,
          Key: fileServerName,
          Body: buffer,
          ContentType,
          ContentLength: buffer.length,
        })
      )

      return `https://${awsS3Config.bucketName}.s3.${awsS3Config.region}.amazonaws.com/${fileServerName}`
    } catch (error) {
      console.error('❌ Erro ao enviar arquivo para o S3:', error)
      throw error
    }
  }

  async removeAwsS3File(fileServerName: string) {
    try {
      console.log(`🚀 ~ Apagar arquivo da aws S3 ${fileServerName}`)

      await awsS3Config.s3Client.send(
        new DeleteObjectCommand({
          Bucket: awsS3Config.bucketName,
          Key: fileServerName,
        })
      )
      console.log(`🚀 ~ Arquivo apagado com sucesso aws S3 ${fileServerName}`)
      return true
    } catch (error) {
      console.error('🚀 ~ removeAwsS3File ~ error:', error instanceof Error ? error.message : error)
      return false
    }
  }

  async getAwsS3File(fileServerName: string) {
    try {
      console.log(`🚀 ~ Consultar se arquivo existe na aws S3 ${fileServerName}`)

      const resp = await awsS3Config.s3Client.send(
        new GetObjectCommand({
          Bucket: awsS3Config.bucketName,
          Key: fileServerName,
        })
      )

      if (resp.Body) {
        console.log(`🚀 ~ Arquivo existe na aws S3 ${fileServerName}`)
        return resp.Body?.transformToByteArray()
      }

      console.log(`🚀 ~ Arquivo não existe na aws S3 ${fileServerName}`)
      return null
    } catch (error) {
      console.error('🚀 ~ getAwsS3File ~ error:', error instanceof Error ? error.message : error)
      return null
    }
  }
}
