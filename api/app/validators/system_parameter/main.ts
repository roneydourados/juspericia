import vine from '@vinejs/vine'

const baseSchema = {
  pointsPerIndication: vine.number().positive().min(0),
  pointsExchange: vine.number().positive().min(0),
  pointsExchangeValue: vine.number().positive().min(0),
  daysPointsExpire: vine.number().positive().min(0),
  comission: vine.number().positive().min(0),
  daysCreditExpire: vine.number().positive().min(0),
  suportWhatsapp: vine.string().trim(),
}

export const updateValidator = vine.compile(
  vine.object({
    ...baseSchema,
    publicId: vine.string().trim(),
  })
)
