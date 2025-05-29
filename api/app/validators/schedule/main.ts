import vine from '@vinejs/vine'

const baseSchema = {
  medicId: vine.number(),
  patientId: vine.number().optional(),
  patientConsultationId: vine.number().optional(),
  scheduleDate: vine.string().trim(),
  scheduleHour: vine.string().trim(),
  title: vine.string().trim(),
  status: vine.string().trim().optional(),
  atendimentStart: vine.string().trim().optional(),
  atendimentEnd: vine.string().trim().optional(),
}

export const createValidator = vine.compile(vine.object(baseSchema))

export const updateValidator = vine.compile(
  vine.object({
    ...baseSchema,
    publicId: vine.string().trim(),
  })
)
