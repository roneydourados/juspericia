import vine from '@vinejs/vine'

const baseSchema = {
  userId: vine.number(),
  patientConsultationId: vine.number().optional(),
  content: vine.string().optional(),
}

export const createValidator = vine.compile(vine.object(baseSchema))

export const updateValidator = vine.compile(
  vine.object({
    ...baseSchema,
    publicId: vine.string().trim(),
  })
)
