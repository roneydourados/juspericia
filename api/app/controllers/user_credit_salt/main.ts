import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { UserCreditServiceService } from '#services/index'

@inject()
export default class UserCreditSaltController {
  constructor(private userCreditSaltService: UserCreditServiceService) {}

  async index({ request, response, auth }: HttpContext) {
    const { status, initialDate, finalDate } = request.qs()

    const user = auth.user

    const credits = await this.userCreditSaltService.index({
      status,
      initialDate,
      finalDate,
      userId: user!.id,
    })

    return response.json(credits)
  }

  async getLogCredit({ params, response }: HttpContext) {
    const { id } = params

    const credits = await this.userCreditSaltService.userLogCredit(id)

    return response.json(credits)
  }
}
