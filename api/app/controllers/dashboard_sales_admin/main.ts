import { AdminSalesDashboardService } from '#services/index'
import { inject } from '@adonisjs/core'

import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class DahsboardSalesAdminController {
  constructor(private dashboardSalesAdminService: AdminSalesDashboardService) {}

  async index({ response, request }: HttpContext) {
    const { initialDate, finalDate } = request.qs() || {}

    const sales = await this.dashboardSalesAdminService.index({
      initialDate,
      finalDate,
    })

    return response.ok(sales)
  }
}
