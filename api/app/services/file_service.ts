import { AwsS3Service } from '#services/index'
import { File } from '#models/index'
import { uuidv7 } from 'uuidv7'

import { FileProps } from '../dtos/index.js'

export default class FileService {
  private s3Service = new AwsS3Service()
  /**
   * Envia um arquivo para o S3 e retorna a URL pública.
   */
  public async upload(payload: FileProps) {
    try {
      const fileExtension = payload.fileName?.split('.').pop()
      const publicId = uuidv7()
      const fileServerName = `${publicId}.${fileExtension}`

      const url = await this.s3Service.sendAwsS3File({
        file: payload.fileData,
        fileServerName,
      })

      if (!url) {
        throw new Error(`Not send file to aws s3 file: ${fileServerName}`)
      }

      await File.create({
        fileCategory: payload.fileCategory!,
        fileName: payload.fileName!,
        ownerId: payload.ownerId!,
        fileServerName,
        publicId,
      })
    } catch (error) {
      console.log('🚀 ~ uploadAwsS3 ~ error:', error)
      throw new Error(`Not send file to aws s3 file: ${payload.fileServerName}`)
    }
  }

  /**
   * Remove um arquivo do S3.
   */
  public async remove(fileServerName: string) {
    return this.s3Service.removeAwsS3File(fileServerName)
  }

  /**
   * Busca o conteúdo de um arquivo no S3 (em bytes).
   */
  public async download(fileServerName: string) {
    return this.s3Service.etAwsS3File(fileServerName)
  }
}
