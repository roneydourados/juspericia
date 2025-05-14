import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ServicePackageHistory extends BaseModel {
  static table = 'service_package_histories'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'public_id' })
  declare publicId: string

  @column({ columnName: 'user_id' })
  declare userId: number

  @column()
  declare description: string

  @column()
  declare action: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
