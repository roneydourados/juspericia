import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { UserAdminService } from '#services/index'
import { createValidator, updateValidator } from '#validators/user/main'

@inject()
export default class UserAdminController {
  constructor(private readonly userAdminService: UserAdminService) {}

  async index({ request, response }: HttpContext) {
    const { inputQuery } = request.qs()

    const userAdmin = await this.userAdminService.index(inputQuery)

    return response.json(userAdmin)
  }

  async store({ request, response }: HttpContext) {
    const data = request.all()

    const payload = await createValidator.validate(data)

    const userAdmin = await this.userAdminService.create(payload)

    return response.status(201).json(userAdmin)
  }

  async show({ params, response }: HttpContext) {
    const { id } = params

    const userAdmin = await this.userAdminService.show(id)

    return response.status(200).json(userAdmin)
  }

  async update({ request, response }: HttpContext) {
    const data = request.all()

    const payload = await updateValidator.validate(data)

    const userAdmin = await this.userAdminService.update(payload)

    return response.status(201).json(userAdmin)
  }

  async destroy({ params, response }: HttpContext) {
    const { id } = params

    await this.userAdminService.destroy(id)

    return response.status(204)
  }
}
