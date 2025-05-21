import vine from '@vinejs/vine'

const baseSchemaObject = {
  sexy: vine.string().trim().maxLength(1),
  userId: vine.number(),
  birthDate: vine.string(),
  cpf: vine.string().trim().minLength(11).maxLength(11),
  rg: vine.string().trim().optional(),
  email: vine.string().trim().email().optional(),
  name: vine.string().trim().minLength(3),
  phone: vine.string().trim().minLength(10).maxLength(20),
  motherName: vine.string().trim().minLength(3),
  surname: vine.string().trim().minLength(3),
}

export const createValidator = vine.compile(vine.object(baseSchemaObject))

export const updateValidator = vine.compile(
  vine.object({
    ...baseSchemaObject,
    publicId: vine.string().trim(),
  })
)
