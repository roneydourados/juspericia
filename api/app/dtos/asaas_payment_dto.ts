export interface PaymentAsaasProps {
  customer?: string
  billingType?: 'BOLETO' | 'CREDIT_CARD' | 'PIX' | 'UNDEFINED'
  dueDate: string
  value: number
  description?: string
  externalReference?: string
  installmentCount?: number
  installmentValue?: number
  discount?: {
    value?: number
    dueDateLimitDays?: number
  }
  fine?: {
    value?: number
  }
  interest?: {
    value?: number
  }
  postalService?: boolean
  callback?: string
}
