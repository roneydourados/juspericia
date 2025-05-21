import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { UserLawyerEstatisticService } from '#services/index'

@inject()
export default class UserLawyerEstatisticController {
  constructor(private userLawyerEstatisticService: UserLawyerEstatisticService) {}

  async index({ request, response, auth }: HttpContext) {
    const { initialDate, finalDate } = request.qs()

    const userId = auth.user!.id

    const userLawyerEstatistics = await this.userLawyerEstatisticService.index({
      userId,
      initialDate,
      finalDate,
    })

    return response.json(userLawyerEstatistics)
  }
}
