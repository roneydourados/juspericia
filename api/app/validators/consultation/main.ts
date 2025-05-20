import vine from '@vinejs/vine'

export const consultationStoreValidator = vine.compile(
  vine.object({
    consultationName: vine.string().trim().optional(),
    value: vine.number().min(0),
    valueCredit: vine.number().min(0),
    valueAntecipation24: vine.number().min(0),
    valueAntecipation48: vine.number().min(0),
    valueAntecipation72: vine.number().min(0),
    valuePacket: vine.number().min(0),
  })
)

export const consultationUpdateValidator = vine.compile(
  vine.object({
    publicId: vine.string().trim().optional(),
    consultationName: vine.string().trim().optional(),
    value: vine.number().min(0),
    valueCredit: vine.number().min(0),
    valueAntecipation24: vine.number().min(0),
    valueAntecipation48: vine.number().min(0),
    valueAntecipation72: vine.number().min(0),
    valuePacket: vine.number().min(0),
  })
)
