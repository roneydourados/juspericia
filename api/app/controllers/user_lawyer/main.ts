import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { UserLawyerService } from '#services/index'
import { createValidator, updateValidator } from '#validators/user/main'

@inject()
export default class UserLaywerController {
  constructor(private userLawyerService: UserLawyerService) {}

  async index({ request, response }: HttpContext) {
    const { inputQuery } = request.qs()
    const lawyers = await this.userLawyerService.index(inputQuery)
    return response.json(lawyers)
  }

  async store({ request, response }: HttpContext) {
    const data = request.all()

    const payload = await createValidator.validate(data)

    const lawyer = await this.userLawyerService.create(payload)

    return response.json(lawyer)
  }

  async show({ params, response }: HttpContext) {
    const { id } = params
    const lawyer = await this.userLawyerService.show(id)
    return response.json(lawyer)
  }

  async update({ request, response }: HttpContext) {
    const data = request.all()

    const payload = await updateValidator.validate(data)

    const lawyer = await this.userLawyerService.update(payload)

    return response.json(lawyer)
  }

  async destroy({ params, response }: HttpContext) {
    const { id } = params

    await this.userLawyerService.destroy(id)

    return response.status(204)
  }

  async getEstatistics({ request, response, auth }: HttpContext) {
    const { initialDate, finalDate } = request.qs()

    const userId = auth.user!.id

    const userLawyerEstatistics = await this.userLawyerService.estatistics({
      userId,
      initialDate,
      finalDate,
    })

    return response.json(userLawyerEstatistics)
  }
}
