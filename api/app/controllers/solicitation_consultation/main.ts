import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { SolicitationConsultationService } from '#services/index'
import { createValidator, updateValidator } from '#validators/solicitation_consultation/main'

@inject()
export default class SolicitationConsultationController {
  constructor(private readonly solicitationConsultationService: SolicitationConsultationService) {}

  async index({ request, response }: HttpContext) {
    const {
      initialDateSolicitation,
      finalDateSolicitation,
      status,
      benefitTypeId,
      patientId,
      reportPurposeId,
      userId,
    } = request.qs()

    const solicitations = await this.solicitationConsultationService.index({
      initialDateSolicitation,
      finalDateSolicitation,
      status,
      benefitTypeId,
      patientId,
      reportPurposeId,
      userId,
    })

    return response.json(solicitations)
  }

  async store({ request, response, auth }: HttpContext) {
    const dataBody = request.body()
    const user = auth.user

    const data = {
      ...dataBody,
      userId: user!.id,
    }

    const payload = await createValidator.validate(data)

    const solicitation = await this.solicitationConsultationService.create(payload)

    return response.status(201).json(solicitation)
  }

  async update({ request, response, auth }: HttpContext) {
    const dataBody = request.body()
    const user = auth.user

    const data = {
      ...dataBody,
      userId: user!.id,
    }

    const payload = await updateValidator.validate(data)

    const solicitation = await this.solicitationConsultationService.update(payload)

    return response.status(201).json(solicitation)
  }

  async show({ params, response }: HttpContext) {
    const { id } = params

    const solicitation = await this.solicitationConsultationService.show(id)

    return response.json(solicitation)
  }

  async destroy({ params, response }: HttpContext) {
    const { id } = params

    await this.solicitationConsultationService.destroy(id)

    return response.status(204)
  }
}
