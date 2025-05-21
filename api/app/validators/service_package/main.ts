import vine from '@vinejs/vine'

const baseSchema = {
  name: vine.string().trim(),
  urlImage: vine.string().trim().optional(),
  description: vine.string().trim(),
  value: vine.number().positive(),
  status: vine.string().trim().optional(),
  dueDays: vine.number().positive().optional(),
}

export const createValidator = vine.compile(vine.object(baseSchema))

export const updateValidator = vine.compile(
  vine.object({
    ...baseSchema,
    publicId: vine.string().trim(),
  })
)
