import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class UserToken extends BaseModel {
  static table = 'user_tokens'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user_id' })
  declare userId: number

  @column()
  declare token: string

  @column({ columnName: 'expires_at' })
  declare expiresAt: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
