import { assaasWebhookPaymentValidator } from '#validators/assaas_webhook/main'
import { asaasCustomerValidator, asaasPaymentValidator } from '#validators/asaas/main'
import { AsaasCustomerService, AsaasPaymentService, AssaasWebhookService } from '#services/index'
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import dayjs from 'dayjs'

@inject()
export default class AsaasController {
  constructor(
    private asaasCustomerService: AsaasCustomerService,
    private asaasPaymentService: AsaasPaymentService,
    private asaasWebhookService: AssaasWebhookService
  ) {}

  async createCustomer({ request, response }: HttpContext) {
    const data = request.all()

    const payload = await asaasCustomerValidator.validate(data)

    const resp = await this.asaasCustomerService.createCustomer(payload)

    return response.json(resp)
  }

  async createPayment({ request, response }: HttpContext) {
    const payload = await request.validateUsing(asaasPaymentValidator)

    const resp = await this.asaasPaymentService.createPayment({
      ...payload,
      billingType: 'UNDEFINED', // o cliente escolhe na tela do Asaas
      dueDate: payload.dueDate ? payload.dueDate : dayjs().format('YYYY-MM-DD'),
      value: payload.value ?? 0, // Garante que value nunca será undefined
    })

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
    const payload = await request.validateUsing(assaasWebhookPaymentValidator)

    await this.asaasWebhookService.paymentWebhook(payload)

    return response.status(200).json({
      received: true,
    })
  }
}
