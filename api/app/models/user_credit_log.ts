import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class UserCreditLog extends BaseModel {
  static table = 'user_credit_logs'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'public_id' })
  declare publicId: string

  @column({ columnName: 'user_credit_id' })
  declare userCreditId: number

  @column()
  declare history: string

  @column()
  declare type: string

  @column()
  declare value: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
