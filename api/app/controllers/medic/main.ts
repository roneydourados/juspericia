import type { HttpContext } from '@adonisjs/core/http'

import { MedicService } from '#services/index'
import { createValidator, updateValidator } from '#validators/medic/main'
import { inject } from '@adonisjs/core'

@inject()
export default class MedicController {
  constructor(private medicService: MedicService) {}
  /**
   * Display a list of resource
   */
  async index({ request }: HttpContext) {
    const { inputQuery } = request.qs()

    const medics = await this.medicService.index(inputQuery)

    return medics
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createValidator)

    const medic = await this.medicService.create(payload)

    return response.json(medic)
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const { id } = params

    const medic = await this.medicService.exists(id)

    return response.json(medic)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ request, response }: HttpContext) {
    const payload = await request.validateUsing(updateValidator)

    const medic = await this.medicService.update(payload)

    return response.json(medic)
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const { id } = params

    await this.medicService.destroy(id)

    return response.send(204)
  }
}
