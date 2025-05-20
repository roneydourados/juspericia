import vine from '@vinejs/vine'

export const asaasCustomerValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(5).trim(),
    cpfCnpj: vine.string().minLength(11).maxLength(20).trim(),
    email: vine.string().email().trim(),
    phone: vine.string().trim().optional(),
    mobilePhone: vine.string().trim().optional(),
    address: vine.string().trim().optional(),
    addressNumber: vine.string().trim().optional(),
    complement: vine.string().trim().optional(),
    province: vine.string().trim().optional(),
    postalCode: vine.string().trim().optional(),
    externalReference: vine.string().trim().optional(),
    notificationDisabled: vine.boolean().optional(),
    additionalEmails: vine.string().trim().optional(),
    municipalInscription: vine.string().trim().optional(),
    stateInscription: vine.string().trim().optional(),
    observations: vine.string().trim().optional(),
    groupName: vine.string().trim().optional(),
    company: vine.string().trim().optional(),
    foreignCustomer: vine.boolean().optional(),
    userId: vine.number().optional(),
  })
)

export const asaasPaymentValidator = vine.compile(
  vine.object({
    customer: vine.string().trim(),
    billingType: vine.enum(['CREDIT_CARD', 'BOLETO', 'UNDEFINED']),
    dueDate: vine.string(),
    value: vine.number().min(0),
    description: vine.string().trim().optional(),
    externalReference: vine.string().trim().optional(),
    installmentCount: vine.number().optional(),
    installmentValue: vine.number().optional(),
    discount: vine
      .object({
        value: vine.number().min(0).optional(),
        dueDateLimitDays: vine.number().optional(),
      })
      .optional(),
    fine: vine
      .object({
        value: vine.number().min(0).optional(),
      })
      .optional(),
    interest: vine
      .object({
        value: vine.number().optional(),
      })
      .optional(),
    postalService: vine.boolean().optional(),
    callback: vine.string().trim().optional(),
  })
)
