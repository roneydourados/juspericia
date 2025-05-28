import { asaasCustomerValidator, asaasPaymentValidator } from '#validators/asaas/main'
import { AsaasPaymentService, AssaasWebhookService } from '#services/index'
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { WebHookPaymentResponseProps } from '../../dtos/index.js'

@inject()
export default class AsaasController {
  constructor(
    private asaasPaymentService: AsaasPaymentService,
    private asaasWebhookService: AssaasWebhookService
  ) {}

  async createCustomer({ request, response }: HttpContext) {
    const data = request.all()

    const payload = await asaasCustomerValidator.validate(data)

    const resp = await this.asaasPaymentService.createCustomer(payload)

    return response.json(resp)
  }

  async createPayment({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(asaasPaymentValidator)
    const userId = auth.user!.id

    const resp = await this.asaasPaymentService.createPayment(
      {
        ...payload,
        billingType: 'UNDEFINED', // o cliente escolhe na tela do Asaas
      },
      userId
    )

    return response.json(resp)
  }

  async destroy({ params, response }: HttpContext) {
    const { id } = params

    await this.asaasPaymentService.deletePayment(id)

    response.status(200).json({
      message: 'Payment deleted successfully',
    })
  }

  async paymentWebhook({ request, response }: HttpContext) {
    const body = request.body() as WebHookPaymentResponseProps

    await this.asaasWebhookService.paymentWebhook(body)

    return response.status(200).json({
      received: true,
    })
  }
}
