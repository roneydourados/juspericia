import vine from '@vinejs/vine'

/**
 * Validates the post's creation action
 */
export const createPostValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    name: vine.string().trim().minLength(3),
    password: vine.string().trim().minLength(6),
    cpfCnpj: vine.string().trim().minLength(11).maxLength(14),
    phone: vine.string().trim().minLength(10).maxLength(11),
    profileId: vine.number().min(1),
    oab: vine.string().trim().optional(),
    oabUf: vine.string().trim().optional(),
    officeName: vine.string().trim().optional(),
    officeCnpj: vine.string().trim().optional(),
    officeEmail: vine.string().trim().email().optional(),
    officePhone: vine.string().trim().optional(),
    whatsapp: vine.string().trim().optional(),
    active: vine.boolean(),
    Address: vine
      .object({
        addressCity: vine.string().trim().minLength(3),
        addressComplement: vine.string().trim().optional(),
        addressDistrict: vine.string().trim().optional(),
        addressNumber: vine.string().trim().optional(),
        addressState: vine.string().trim().minLength(2).maxLength(2),
        addressStreet: vine.string().trim().minLength(3),
        addressZipcode: vine.string().trim().minLength(8).maxLength(8),
        ownerId: vine.number().min(1),
        addressCategory: vine.string().trim(),
      })
      .optional(),
  })
)

/**
 * Validates the post's update action
 */
export const updatePostValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    name: vine.string().trim().minLength(3),
    password: vine.string().trim().minLength(6),
    cpfCnpj: vine.string().trim().minLength(11).maxLength(14),
    phone: vine.string().trim().minLength(10).maxLength(11),
    profileId: vine.number().min(1),
    oab: vine.string().trim().optional(),
    oabUf: vine.string().trim().optional(),
    officeName: vine.string().trim().optional(),
    officeCnpj: vine.string().trim().optional(),
    officeEmail: vine.string().trim().email().optional(),
    officePhone: vine.string().trim().optional(),
    whatsapp: vine.string().trim().optional(),
    active: vine.boolean(),
    Address: vine
      .object({
        addressCity: vine.string().trim().minLength(3),
        addressComplement: vine.string().trim().optional(),
        addressDistrict: vine.string().trim().optional(),
        addressNumber: vine.string().trim().optional(),
        addressState: vine.string().trim().minLength(2).maxLength(2),
        addressStreet: vine.string().trim().minLength(3),
        addressZipcode: vine.string().trim().minLength(8).maxLength(8),
        ownerId: vine.number().min(1),
        addressCategory: vine.string().trim(),
      })
      .optional(),
  })
)
