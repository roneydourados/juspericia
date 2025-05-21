import vine from '@vinejs/vine'

const baseSchema = {
  userCreditId: vine.number(),
  history: vine.string().trim(),
  type: vine.string().trim(),
  value: vine.number(),
}

export const createValidator = vine.compile(vine.object(baseSchema))

export const updateValidator = vine.compile(
  vine.object({
    ...baseSchema,
    publicId: vine.string().trim(),
  })
)
