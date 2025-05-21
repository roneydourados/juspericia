import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { ReportPurposeService } from '#services/index'
import { createValidator, updateValidator } from '#validators/report_purpose/main'

@inject()
export default class ReportPurposeController {
  constructor(private reportPurposeService: ReportPurposeService) {}

  async index({ request, response }: HttpContext) {
    const { inputQuery } = request.qs()

    const reportPurposes = await this.reportPurposeService.index(inputQuery)

    return response.json(reportPurposes)
  }

  async store({ request, response }: HttpContext) {
    const data = request.all()

    const payload = await createValidator.validate(data)

    const reportPurpose = await this.reportPurposeService.create(payload)

    return response.json(reportPurpose)
  }

  async show({ params, response }: HttpContext) {
    const { id } = params

    const reportPurpose = await this.reportPurposeService.show(id)

    return response.json(reportPurpose)
  }

  async update({ request, response }: HttpContext) {
    const data = request.all()

    const payload = await updateValidator.validate(data)

    const reportPurpose = await this.reportPurposeService.update(payload)

    return response.json(reportPurpose)
  }

  async destroy({ params, response }: HttpContext) {
    const { id } = params

    await this.reportPurposeService.destroy(id)

    return response.status(204)
  }
}
