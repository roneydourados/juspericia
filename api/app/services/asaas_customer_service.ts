import axios from 'axios'
import env from '#start/env'
import {
  CustomerListProps,
  CustomerProps,
  CustomerResponseCreataedProps,
} from '../types/asaas_customer.js'

export default class AsaasCustomerService {
  private api = axios.create({
    baseURL: env.get('ASAAS_BASE_URL', 'https://sandbox.asaas.com/api/v3'),
    headers: {
      accept: 'application/json',
      access_token: env.get('ASAAS_API_KEY'),
    },
  })

  async createCustomer(customerData: CustomerProps): Promise<CustomerResponseCreataedProps> {
    try {
      const exists = await this.getCustomer(customerData.cpfCnpj!)

      if (exists.length > 0) {
        return exists[0]
      }

      const response = await this.api.post<CustomerResponseCreataedProps>(
        '/customers',
        customerData
      )

      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error (createCustomer):', error.response?.data)
        throw new Error(error.response?.data.message || 'Erro ao criar cliente no Asaas')
      }

      console.error('Erro inesperado (createCustomer):', error)
      throw new Error('Erro ao criar cliente')
    }
  }

  async getCustomer(cpfCnpj: string) {
    try {
      const response = await this.api.get<CustomerListProps>('/customers', {
        params: { cpfCnpj },
      })

      return response.data.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error (getCustomer):', error.response?.data)
        throw new Error(error.response?.data.message || 'Erro ao buscar cliente no Asaas')
      }

      console.error('Erro inesperado (getCustomer):', error)
      throw new Error('Erro ao buscar cliente')
    }
  }
}
