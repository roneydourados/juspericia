import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class PatientConsultationReport extends BaseModel {
  static table = 'patient_consultation_reports'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'public_id' })
  declare publicId: string

  @column({ columnName: 'user_id' })
  declare userId: number

  @column()
  declare content: string

  @column()
  declare status: string

  @column({ columnName: 'report_date' })
  declare reportDate: string

  @column({ columnName: 'user_deleted' })
  declare userDeleted: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
