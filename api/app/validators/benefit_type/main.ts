import vine from '@vinejs/vine'

export const benefitTypeStoreValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
  })
)

export const benefitTypeUpdateValidator = vine.compile(
  vine.object({
    publicId: vine.string().trim().optional(),
    name: vine.string().trim().optional(),
  })
)
