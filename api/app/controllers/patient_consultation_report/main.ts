import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { PatientConsultationReportService } from '#services/index'
import { createValidator } from '#validators/patient_consultation_report/main'

@inject()
export default class PatientConsultationReportController {
  constructor(private patientConsultationReportService: PatientConsultationReportService) {}

  async index({ request, response }: HttpContext) {
    const { initialDate, finalDate, userId, medicId, patientId } = request.qs()

    const reports = await this.patientConsultationReportService.index({
      initialDate,
      finalDate,
      userId,
      medicId,
      patientId,
    })

    return response.ok(reports)
  }

  async store({ request, response, auth }: HttpContext) {
    const data = request.all()
    const payload = await createValidator.validate(data)

    const user = auth.user

    const report = await this.patientConsultationReportService.create({
      ...payload,
      userId: user!.id,
    })

    return response.created(report)
  }

  async show({ params, response }: HttpContext) {
    const { id } = params

    const report = await this.patientConsultationReportService.show(id)

    if (!report) {
      return response.notFound('Report not found')
    }

    return response.ok(report)
  }
}
