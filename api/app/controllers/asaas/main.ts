import { asaasCustomerValidator, asaasPaymentValidator } from '#validators/asaas/main'
import { AsaasCustomerService, AsaasPaymentService } from '#services/index'
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

@inject()
export default class AsaasController {
  constructor(
    private asaasCustomerService: AsaasCustomerService,
    private asaasPaymentService: AsaasPaymentService
  ) {}

  async createCustomer({ request, response }: HttpContext) {
    const data = request.all()

    const payload = await asaasCustomerValidator.validate(data)

    const resp = await this.asaasCustomerService.createCustomer(payload)

    return response.json(resp)
  }

  async createPayment({ request, response }: HttpContext) {
    const data = request.all()

    const payload = await asaasPaymentValidator.validate(data)

    const resp = await this.asaasPaymentService.createPayment(payload)

    return response.json(resp)
  }

  async destroy({ params, response }: HttpContext) {
    const { id } = params

    await this.asaasPaymentService.deletePayment(id)

    response.status(200).json({
      message: 'Payment deleted successfully',
    })
  }
}
