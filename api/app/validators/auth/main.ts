import vine from '@vinejs/vine'

export const authValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim().minLength(6),
    tokenCapcha: vine.string(),
  })
)
