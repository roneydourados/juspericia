import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { ScheduleService } from '#services/index'
import { createValidator, updateValidator } from '#validators/schedule/main'

@inject()
export default class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  async index({ request, response }: HttpContext) {
    const { medicId, scheduleDate, patientId } = request.qs()

    const schedule = await this.scheduleService.index({
      medicId,
      scheduleDate,
      patientId,
    })

    return response.json(schedule)
  }

  async store({ request, response }: HttpContext) {
    const data = request.body()

    const payload = await createValidator.validate(data)

    const schedule = await this.scheduleService.create(payload)

    return response.json(schedule)
  }

  async show({ params, response }: HttpContext) {
    const { id } = params

    const schedule = await this.scheduleService.show(id)

    return response.json(schedule)
  }

  async update({ request, response }: HttpContext) {
    const data = request.body()

    const payload = await updateValidator.validate(data)

    const schedule = await this.scheduleService.update(payload)

    return response.json(schedule)
  }

  async destroy({ params, response }: HttpContext) {
    const { id } = params

    const schedule = await this.scheduleService.destroy(id)

    return response.json(schedule)
  }
}
