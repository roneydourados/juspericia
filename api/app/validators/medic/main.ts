import vine from '@vinejs/vine'

/**
 * Validates the post's creation action
 */
export const createValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    name: vine.string().trim().minLength(3),
    password: vine.string().trim(),
    crm: vine.string().trim().optional(),
    cpfCnpj: vine.string().trim().minLength(11).maxLength(14).optional(),
    crmUf: vine.string().trim().maxLength(2).optional(),
    phone: vine.string().trim().minLength(10).maxLength(20).optional(),
    medicConsultationValue: vine.number().min(0).optional(),
    medicHourEnd: vine.string().trim().optional(),
    medicHourStart: vine.string().trim().optional(),
    medicQueryInterval: vine.number().optional(),
  })
)

/**
 * Validates the post's update action
 */
export const updateValidator = vine.compile(
  vine.object({
    publicId: vine.string().trim(),
    email: vine.string().trim().email(),
    name: vine.string().trim().minLength(3),
    password: vine.string().trim(),
    crm: vine.string().trim().optional(),
    cpfCnpj: vine.string().trim().minLength(11).maxLength(14).optional(),
    crmUf: vine.string().trim().maxLength(2).optional(),
    phone: vine.string().trim().minLength(10).maxLength(20).optional(),
    medicConsultationValue: vine.number().min(0).optional(),
    medicHourEnd: vine.string().trim().optional(),
    medicHourStart: vine.string().trim().optional(),
    medicQueryInterval: vine.number().optional(),
  })
)
