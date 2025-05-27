import axios, { AxiosError } from 'axios'
//import { formatDate } from '../utils/functions.js'
import type { PaymentAsaasProps } from '../dtos/index.js'
import env from '#start/env'

export default class AsaasPaymentService {
  /*
  private readonly asaasApi: AxiosInstance

  constructor() {
    const baseUrl = env.get('ASAAS_BASE_URL', 'https://sandbox.asaas.com/api/v3')
    const apiKey = env.get('ASAAS_API_KEY')

    this.asaasApi = axios.create({
      baseURL: baseUrl,
      responseType: 'json',
      headers: {
        Accept: 'application/json',
        access_token: apiKey,
      },
    })
  }
*/
  async createPayment(payload: PaymentAsaasProps) {
    try {
      const baseUrl = env.get('ASAAS_BASE_URL')
      const apiKey = env.get('ASAAS_API_KEY')

      console.log('🚀 ~ createPayment ~ baseUrl:', baseUrl)
      console.log('🚀 ~ createPayment ~ apiKey:', apiKey)
      const asaasApi = axios.create({
        baseURL: baseUrl,
        headers: {
          accept: 'application/json',
          access_token: apiKey,
        },
      })

      // const asaasApi = axios.create({
      //   baseURL: baseUrl,
      //   responseType: 'json',
      //   headers: {
      //     Accept: 'application/json',
      //     access_token: apiKey,
      //   },
      // })
      return
      const { data } = await asaasApi.post('/payments', payload)
      return data
    } catch (error: unknown) {
      const err = error as AxiosError
      console.error('[AsaasPaymentService] Erro ao criar pagamento:', err.response?.data || err)
      throw new Error(`[AsaasPaymentService] Erro ao criar pagamento: ${err.response?.data || err}`)
    }
  }

  async deletePayment(id: string) {
    try {
      const baseUrl = env.get('ASAAS_BASE_URL', 'https://sandbox.asaas.com/api/v3')
      const apiKey = env.get('ASAAS_API_KEY')
      const asaasApi = axios.create({
        baseURL: baseUrl,
        responseType: 'json',
        headers: {
          Accept: 'application/json',
          access_token: apiKey,
        },
      })

      await asaasApi.delete(`/payments/${id}`)
    } catch (error: unknown) {
      const err = error as AxiosError
      console.error('[AsaasPaymentService] Erro ao deletar pagamento:', err.response?.data || err)
      throw new Error('Erro ao deletar pagamento com Asaas.')
    }
  }
}
