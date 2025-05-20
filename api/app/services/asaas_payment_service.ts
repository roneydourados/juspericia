import axios, { AxiosInstance } from 'axios'
import { formatDate } from '../utils/functions.js'
import type { PaymentAsaasProps } from '../dtos/index.js'
//import { inject } from '@adonisjs/core'
import env from '#start/env'

//@inject()
export default class AsaasPaymentService {
  private readonly asaasApi: AxiosInstance

  constructor() {
    const baseUrl = env.get('ASAAS_BASE_URL', 'https://sandbox.asaas.com/api/v3')
    const apiKey = env.get('ASAAS_API_KEY')

    this.asaasApi = axios.create({
      baseURL: baseUrl,
      headers: {
        accept: 'application/json',
        access_token: apiKey,
      },
    })
  }

  async createPayment(payload: PaymentAsaasProps) {
    try {
      payload.billingType = 'UNDEFINED' // o cliente escolhe na tela do Asaas
      payload.dueDate = formatDate(new Date(payload.dueDate))

      const { data } = await this.asaasApi.post('/payments', payload)
      return data
    } catch (error) {
      console.error('[AsaasPaymentService] Erro ao criar pagamento:', error)
      throw new Error('Erro ao criar pagamento com Asaas.')
    }
  }

  async deletePayment(id: string) {
    try {
      await this.asaasApi.delete(`/payments/${id}`)
    } catch (error) {
      console.error('[AsaasPaymentService] Erro ao deletar pagamento:', error)
      throw new Error('Erro ao deletar pagamento com Asaas.')
    }
  }
}
