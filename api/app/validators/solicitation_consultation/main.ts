import vine from '@vinejs/vine'

const baseSchema = {
  content: vine.string().trim(),
  benefitTypeId: vine.number().positive(),
  reportPurposeId: vine.number().positive(),
  patientId: vine.number().positive(),
  medicId: vine.number().positive().optional(),
  status: vine.string().trim().optional(),
  processSituation: vine.string().trim().optional(),
  proccessNumber: vine.string().trim().optional(),
  tipValue: vine.number().optional(),
  userId: vine.number().positive(),
  consultationId: vine.number().positive(),
  dateOpen: vine.string(),
  consultationValue: vine.number().positive(),
  valueCredit: vine.number().positive().optional(),
}

export const createValidator = vine.compile(vine.object(baseSchema))

export const updateValidator = vine.compile(
  vine.object({
    ...baseSchema,
    publicId: vine.string().trim(),
  })
)
