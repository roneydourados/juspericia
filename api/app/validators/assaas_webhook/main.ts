import vine from '@vinejs/vine'

export const baseSchema = vine.object({
  id: vine.string().optional(),
  event: vine.string().optional(),
  dateCreated: vine.string(),

  payment: vine.object({
    object: vine.string(),
    id: vine.string(),
    dateCreated: vine.string(),
    customer: vine.string(),
    subscription: vine.string(),
    installment: vine.string(),
    paymentLink: vine.string(),
    dueDate: vine.string(),
    originalDueDate: vine.string(),
    value: vine.number(),
    netValue: vine.number(),
    originalValue: vine.any().optional(),
    interestValue: vine.any().optional(),
    nossoNumero: vine.any().optional(),
    description: vine.string(),
    externalReference: vine.string(),
    billingType: vine.string(),
    status: vine.string(),
    pixTransaction: vine.any().optional(),
    confirmedDate: vine.string(),
    paymentDate: vine.string(),
    clientPaymentDate: vine.string(),
    installmentNumber: vine.any().optional(),
    creditDate: vine.string(),
    custody: vine.any().optional(),
    estimatedCreditDate: vine.string(),
    invoiceUrl: vine.string(),
    bankSlipUrl: vine.any().optional(),
    transactionReceiptUrl: vine.string(),
    invoiceNumber: vine.string(),
    deleted: vine.boolean(),
    anticipated: vine.boolean(),
    anticipable: vine.boolean(),
    lastInvoiceViewedDate: vine.string(),
    lastBankSlipViewedDate: vine.any().optional(),
    postalService: vine.boolean(),

    creditCard: vine.object({
      creditCardNumber: vine.string(),
      creditCardBrand: vine.string(),
      creditCardToken: vine.string(),
    }),

    discount: vine.object({
      value: vine.number(),
      dueDateLimitDays: vine.number(),
      limitedDate: vine.any().optional(),
      type: vine.string(),
    }),

    fine: vine.object({
      value: vine.number(),
      type: vine.string(),
    }),

    interest: vine.object({
      value: vine.number(),
      type: vine.string(),
    }),

    split: vine.array(
      vine.object({
        walletId: vine.string(),
        fixedValue: vine.number().optional(),
        percentualValue: vine.number().optional(),
        status: vine.string(),
        refusalReason: vine.any().optional(),
      })
    ),

    chargeback: vine.object({
      status: vine.string(),
      reason: vine.string(),
    }),

    refunds: vine.any().optional(),
  }),
})

export const assaasWebhookPaymentValidator = vine.compile(baseSchema)
