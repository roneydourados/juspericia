import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

import { ServicePackageHistory } from '#models/index'

export default class ServicePackage extends BaseModel {
  static table = 'service_packages'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'public_id' })
  declare publicId: string

  @column()
  declare name: string

  @column()
  declare description: string

  @column({ columnName: 'url_image' })
  declare urlImage: string

  @column()
  declare value: number

  @column()
  declare status: string

  @column({ columnName: 'due_days' })
  declare dueDays: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => ServicePackageHistory)
  declare ServicePackageHistory: HasMany<typeof ServicePackageHistory>
}
