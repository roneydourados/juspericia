import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { SystemParameterService } from '#services/index'
import { updateValidator } from '#validators/system_parameter/main'

@inject()
export default class SystemParameterController {
  constructor(private readonly systemParameterService: SystemParameterService) {}

  async index({ response }: HttpContext) {
    const systemParameter = await this.systemParameterService.index()

    return response.json(systemParameter)
  }

  async update({ request, response }: HttpContext) {
    const data = request.all()

    const payload = await updateValidator.validate(data)

    const systemParameter = await this.systemParameterService.update(payload)

    return response.status(200).json(systemParameter)
  }
}
