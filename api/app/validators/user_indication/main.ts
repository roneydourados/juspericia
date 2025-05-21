import vine from '@vinejs/vine'

const baseSchema = {
  name: vine.string().trim(),
  email: vine.string().trim(),
  whatsapp: vine.string().trim(),
  status: vine.string().trim().optional(),
  points: vine.number().optional(),
  expiredAt: vine.string().optional(),
}

export const createValidator = vine.compile(vine.object(baseSchema))

export const updateValidator = vine.compile(
  vine.object({
    ...baseSchema,
    publicId: vine.string().trim(),
  })
)
