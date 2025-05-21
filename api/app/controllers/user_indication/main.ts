import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { UserIndicationService } from '#services/index'
import { createValidator, updateValidator } from '#validators/user_indication/main'

@inject()
export default class UserIndicationController {
  constructor(private userIndicationService: UserIndicationService) {}

  async index({ request, response }: HttpContext) {
    const { initialDate, finalDate, userId, status } = request.qs()

    const indications = await this.userIndicationService.index({
      initialDate,
      finalDate,
      userId,
      status,
    })

    return response.json(indications)
  }

  async store({ request, response }: HttpContext) {
    const data = request.all()

    const payload = await createValidator.validate(data)

    const indication = await this.userIndicationService.store(payload)

    return response.json(indication)
  }

  async show({ params, response }: HttpContext) {
    const { id } = params
    const indication = await this.userIndicationService.show(id)

    return response.json(indication)
  }

  async update({ request, response }: HttpContext) {
    const data = request.all()
    const payload = await updateValidator.validate(data)
    const indication = await this.userIndicationService.update(payload)

    return response.json(indication)
  }

  async destroy({ params, response }: HttpContext) {
    const { id } = params
    await this.userIndicationService.destroy(id)

    return response.status(204)
  }
}
