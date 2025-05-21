import vine from '@vinejs/vine'

const baseSchema = {
  title: vine.string(),
  content: vine.string(),
}

export const createValidator = vine.compile(vine.object(baseSchema))

export const updateValidator = vine.compile(
  vine.object({
    ...baseSchema,
    publicId: vine.string().trim(),
  })
)
