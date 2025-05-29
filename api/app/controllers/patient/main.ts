import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { PatientService } from '#services/index'
import { createValidator, updateValidator } from '#validators/patient/main'

@inject()
export default class PatientController {
  constructor(private patientService: PatientService) {}

  async index({ request, response, auth }: HttpContext) {
    const { inputQuery } = request.qs()

    const user = auth.user

    await user!.load('profile')

    if (user!.profile.type !== 'ADMIN' && user!.profile.type !== 'MEDICO') {
      const patients = await this.patientService.index({ inputQuery, userId: user!.id })

      return response.json(patients)
    }

    const patients = await this.patientService.indexAdmin({ inputQuery })
    return response.json(patients)
  }

  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(createValidator)

    const user = auth.user

    const patient = await this.patientService.create({ ...payload, userId: user!.id })

    return response.status(201).json(patient)
  }

  async update({ request, response }: HttpContext) {
    const payload = await request.validateUsing(updateValidator)

    const patient = await this.patientService.update(payload)

    return response.status(201).json(patient)
  }

  async show({ params, response }: HttpContext) {
    const { id } = params

    const patient = await this.patientService.show(id)

    return response.json(patient)
  }

  async destroy({ params, response }: HttpContext) {
    const { id } = params

    await this.patientService.destroy(id)

    return response.status(204)
  }

  async getSolicitations({ params, response }: HttpContext) {
    const { id } = params

    const patient = await this.patientService.show(id)

    if (!patient) {
      return response.status(404).json({ message: 'Patient not found' })
    }

    const solicitations = await this.patientService.getsolicitationsPatient(patient.id)

    return response.json(solicitations)
  }
}
