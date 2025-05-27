import axios, { AxiosError } from 'axios'
//import { formatDate } from '../utils/functions.js'
import type {
  CustomerListProps,
  CustomerProps,
  CustomerResponseCreataedProps,
  PaymentAsaasProps,
} from '../dtos/index.js'
import env from '#start/env'
import { Address, User, Sale, UserCredit, PatientConsultation } from '#models/index'
import db from '@adonisjs/lucid/services/db'
import { uuidv7 } from 'uuidv7'
import dayjs from 'dayjs'

export default class AsaasPaymentService {
  private readonly baseURL = env.get('ASAAS_BASE_URL', '')
  private readonly apiKey = env.get('ASAAS_API_KEY')

  private api = axios.create({
    baseURL: this.baseURL,
    headers: {
      accept: 'application/json',
      access_token: this.apiKey,
    },
  })

  async createPayment(payload: PaymentAsaasProps, userId: number) {
    const trx = await db.transaction()
    try {
      const user = await User.query().where({ id: userId }).first()

      if (!user) {
        throw new Error('User not found!, error payment Asaas')
      }

      if (!user.cpfCnpj) {
        throw new Error('User CPF/CNPJ not found!, error payment Asaas')
      }

      if (!user.customerId) {
        user.useTransaction(trx)

        const address = await Address.query()
          .where({ ownerId: userId, addressCategory: 'USER' })
          .first()

        const payloadCustomer: CustomerProps = {
          cpfCnpj: user.officeCnpj!,
          name: user.officeName!,
          email: user.officeEmail ? user.officeEmail : '',
          userId: user.id,
          phone: user.officePhone ? user.officePhone : undefined,
          mobilePhone: user.whatsapp ? user.whatsapp : undefined,
          company: user.officeName ? user.officeName : undefined,
          address: address?.addressStreet ? address.addressStreet : undefined,
          addressNumber: address?.addressNumber ? address.addressNumber : undefined,
          complement: address?.addressComplement ? address.addressComplement : undefined,
          province: address?.addressDistrict ? address.addressDistrict : undefined,
          postalCode: address?.addressZipcode ? address.addressZipcode : undefined,
        }

        //cadastrar usuário no Asaas
        const customer = await this.createCustomer(payloadCustomer)

        if (!customer.id) {
          throw new Error('Customer ID not found after creation, error payment Asaas')
        }

        user.customerId = customer.id

        await user.save()
      }

      payload.customer = user.customerId
      payload.externalReference = uuidv7() // Gera um UUID v7 para o externalReference

      //envia solicitação de cobrança para o Asaas
      const resp = await this.api.post('/payments', payload)

      if (resp.data) {
        let expiredAt = null

        if (payload.category === 'package') {
          expiredAt = dayjs()
            .add(Number(payload.dueDays ?? 0), 'days')
            .format('YYYY-MM-DD')
        }

        const sale = await Sale.create(
          {
            publicId: resp.data.externalReference,
            saleId: resp.data.id,
            billingType: resp.data.billingType,
            dueDate: resp.data.dueDate,
            dateCreated: resp.data.dateCreated,
            description: resp.data.description,
            invoiceUrl: resp.data.invoiceUrl,
            status: resp.data.status,
            userId: user.id!,
            value: resp.data.value,
            netValue: resp.data.netValue,
            nossoNumero: resp.data.nossoNumero,
            originalDueDate: resp.data.originalDueDate ? resp.data.originalDueDate : undefined,
            expiredAt: expiredAt ? expiredAt : undefined,
            category: payload.category,
            packageId: payload.packageId ? payload.packageId : undefined,
            solicitationId: payload.solicitationId ? payload.solicitationId : undefined,
          },
          {
            client: trx,
          }
        )
        // se for venda de pacote então gerar saldo inicial de crédito, aqui vai aguardar
        // o webhook com a confirmação de pagamento para totalizar saldo
        if (payload.category === 'package') {
          await UserCredit.create(
            {
              userId: user.id!,
              value: resp.data.value,
              salt: 0,
              category: 'package',
              ownerId: sale.id,
              publicId: uuidv7(),
              creditDate: dayjs().format('YYYY-MM-DD'),
              status: resp.data.status,
              expireDate: sale.expiredAt!,
              invoiceUrl: resp.data.invoiceUrl,
            },
            {
              client: trx,
            }
          )
        }

        // se for pagamento de uma solicitação então atualizar o status da solicitação para pagamento pendente
        if (payload.solicitationId) {
          const patientConsultation = await PatientConsultation.query()
            .where({ id: payload.solicitationId })
            .first()

          if (patientConsultation) {
            patientConsultation.useTransaction(trx)
            patientConsultation.status = 'payment_pending'
            await patientConsultation.save()
          }
        }
      }

      await trx.commit()

      return resp.data
    } catch (error: unknown) {
      await trx.rollback()
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
