import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasOne, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne, HasMany } from '@adonisjs/lucid/types/relations'

import { User, Address, File } from '#models/index'
import { addressCategoryType } from '../utils/datatypes.js'

export default class Patient extends BaseModel {
  static table = 'patients'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'public_id' })
  declare publicId: string

  @column({ columnName: 'user_id' })
  declare userId: number

  @column()
  declare name: string

  @column()
  declare surname: string

  @column({ columnName: 'birth_date' })
  declare birthDate: string

  @column()
  declare email: string

  @column({ columnName: 'mother_name' })
  declare motherName: string

  @column()
  declare phone: string

  @column()
  declare cpf: string

  @column()
  declare rg: string

  @column()
  declare status: string

  @column()
  declare sexy: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  public User!: BelongsTo<typeof User>

  @hasOne(() => Address, {
    localKey: 'id',
    foreignKey: 'ownerId',
    onQuery: (query) => {
      query.where('address_category', addressCategoryType.patient)
    },
  })
  public PatientAddress!: HasOne<typeof Address>

  @hasMany(() => File, {
    localKey: 'id',
    foreignKey: 'ownerId',
    onQuery: (query) => {
      query.where('file_category', 'patient')
    },
  })
  public files!: HasMany<typeof File>
}
