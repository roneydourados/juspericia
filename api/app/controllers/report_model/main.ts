import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { ReportModelService } from '#services/index'
import { createValidator, updateValidator } from '#validators/report_model/main'

@inject()
export default class ReportModelController {
  constructor(private reportModelService: ReportModelService) {}

  async index({ request, response }: HttpContext) {
    const { inputQuery } = request.qs()

    const reportModels = await this.reportModelService.index(inputQuery)

    return response.json(reportModels)
  }

  async store({ request, response }: HttpContext) {
    const data = request.all()

    const payload = await createValidator.validate(data)

    const reportModel = await this.reportModelService.create(payload)

    return response.json(reportModel)
  }

  async show({ params, response }: HttpContext) {
    const { id } = params

    const reportModel = await this.reportModelService.show(id)

    return response.json(reportModel)
  }

  async update({ request, response }: HttpContext) {
    const data = request.all()

    const payload = await updateValidator.validate(data)

    const reportModel = await this.reportModelService.update(payload)

    return response.json(reportModel)
  }

  async destroy({ params, response }: HttpContext) {
    const { id } = params

    await this.reportModelService.delete(id)

    return response.send(204)
  }
}
