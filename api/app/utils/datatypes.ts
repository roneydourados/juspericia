//tipagem para perfil
const profileTypes = ['ADMIN', 'ADVOGADO', 'MEDICO', 'CLIENTE'] as const
type ProfileType = (typeof profileTypes)[number]

//tipagem para meio de pagamento
const paymentTypes = ['CREDIT_CARD', 'BOLETO', 'PIX', 'DEBIT_CARD'] as const
type PaymentType = (typeof paymentTypes)[number]

export { profileTypes, paymentTypes }
export type { ProfileType, PaymentType }
