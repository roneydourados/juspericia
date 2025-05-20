import type { HttpContext } from '@adonisjs/core/http'
import {
  consultationStoreValidator,
  consultationUpdateValidator,
} from '#validators/consultation/main'

import { ConsultationService } from '#services/index'
import { inject } from '@adonisjs/core'

@inject()
export default class ConsultationController {
  constructor(private consultationService: ConsultationService) {}

  /**
   * Display a list of resource
   */
  async index({ request, response }: HttpContext) {
    const { inputQuery } = request.qs()

    const resp = await this.consultationService.index(inputQuery)

    return response.json(resp)
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const { id } = params

    const resp = await this.consultationService.show(id)

    return response.json(resp)
  }

  /**
   * Display form to create a new record
   */
  async store({ request, response }: HttpContext) {
    const data = request.all()

    const payload = await consultationStoreValidator.validate(data)

    const resp = await this.consultationService.create(payload)

    return response.json(resp)
  }

  async update({ request, response }: HttpContext) {
    const data = request.all()

    const payload = await consultationUpdateValidator.validate(data)

    const resp = await this.consultationService.update(payload)

    return response.json(resp)
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const { id } = params

    await this.consultationService.destroy(id)

    return response.json({ message: 'Registro deletado com sucesso' })
  }
}
