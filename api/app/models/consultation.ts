import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Consultation extends BaseModel {
  static table = 'consultations'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'public_id' })
  declare publicId: string

  @column({ columnName: 'consultation_name' })
  declare consultationName: string

  @column()
  declare value: number

  @column({ columnName: 'value_credit' })
  declare valueCredit: number

  @column({ columnName: 'value_packet' })
  declare valuePacket: number

  @column({ columnName: 'value_antecipation_24' })
  declare valueAntecipation24: number

  @column({ columnName: 'value_antecipation_48' })
  declare valueAntecipation48: number

  @column({ columnName: 'value_antecipation_72' })
  declare valueAntecipation72: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
