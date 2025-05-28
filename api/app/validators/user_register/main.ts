import vine from '@vinejs/vine'

const baseSchema = vine.object({
  name: vine.string().trim(),
  email: vine.string().trim().email(),
  password: vine.string().trim(),
  cpfCnpj: vine.string().trim().minLength(11).maxLength(14),
  phone: vine.string().trim().optional(),
  oab: vine.string().trim(),
  oabUf: vine.string().trim().optional(),
  officeName: vine.string().trim().optional(),
  officeCnpj: vine.string().trim().optional(),
  officeEmail: vine.string().trim().email().optional(),
  officePhone: vine.string().trim().optional(),
  whatsapp: vine.string().trim().optional(),
  active: vine.boolean(),
  tokenCapcha: vine.string().trim(),
  UserAddress: vine
    .object({
      addressCity: vine.string().trim().minLength(3),
      addressComplement: vine.string().trim().optional(),
      addressDistrict: vine.string().trim().optional(),
      addressNumber: vine.string().trim().optional(),
      addressState: vine.string().trim().minLength(2).maxLength(2),
      addressStreet: vine.string().trim().minLength(3),
      addressZipcode: vine.string().trim().minLength(8).maxLength(8),
      ownerId: vine.number().min(1).optional(),
      addressCategory: vine.string().trim().optional(),
    })
    .optional(),
})

export const resgiterUserValidator = vine.compile(baseSchema)
