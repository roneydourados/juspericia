import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { FileService } from '#services/index'
import { fileStoreValidator } from '#validators/file/main'

import { uuidv7 } from 'uuidv7'

@inject()
export default class FileController {
  constructor(private fileService: FileService) {}

  /**
   * Upload de um único arquivo
   */
  async store({ request, response }: HttpContext) {
    // Valida os dados (incluindo o arquivo)
    const { file } = await request.validateUsing(fileStoreValidator)

    const fileName = request.input('fileName')
    const fileCategory = request.input('fileCategory')
    const ownerId = Number(request.input('ownerId'))

    // Gera nome único
    const fileExtension = fileName?.split('.').pop()
    const publicId = uuidv7()
    const fileServerName = `${publicId}.${fileExtension}`

    // Realiza o upload via service (o service pode lidar com salvar no banco também)
    const uploadedFile = await this.fileService.upload({
      fileCategory,
      fileName,
      fileServerName,
      ownerId,
      fileData: file,
    })

    return response.created(uploadedFile)
  }

  async storeMany({ request, response }: HttpContext) {
    const files = request.files('file') // pega múltiplos arquivos com o mesmo campo "file"

    const fileNames = request.input('fileName') as string[]
    const fileCategories = request.input('fileCategory') as string[]
    const ownerIds = request.input('ownerId') as string[]

    if (
      !Array.isArray(files) ||
      !Array.isArray(fileNames) ||
      !Array.isArray(fileCategories) ||
      !Array.isArray(ownerIds) ||
      files.length !== fileNames.length ||
      files.length !== fileCategories.length ||
      files.length !== ownerIds.length
    ) {
      return response.badRequest({
        message:
          'Dados inconsistentes: cada arquivo precisa de fileName, fileCategory e ownerId correspondente.',
      })
    }

    const uploads = await Promise.all(
      files.map(async (file, index) => {
        const fileName = fileNames[index]
        const fileCategory = fileCategories[index]
        const ownerId = Number(ownerIds[index])

        const fileExtension = fileName?.split('.').pop()
        const publicId = uuidv7()
        const fileServerName = `${publicId}.${fileExtension}`

        return this.fileService.upload({
          fileCategory,
          fileName,
          fileServerName,
          ownerId,
          fileData: file,
        })
      })
    )

    return response.created(uploads)
  }

  async destroy({ params, response }: HttpContext) {
    const { id } = params

    await this.fileService.remove(id)

    response.status(204)
  }
}
