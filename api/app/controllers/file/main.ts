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

  async destroy({ params, response }: HttpContext) {
    const { id } = params

    await this.fileService.remove(id)

    response.status(204)
  }
}
