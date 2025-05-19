import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { PatientConsultation, User } from '#models/index'

export default class PatientConsultationReport extends BaseModel {
  static table = 'patient_consultation_reports'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'public_id' })
  declare publicId: string

  @column({ columnName: 'user_id' })
  declare userId: number

  @column({ columnName: 'patient_consultation_id' })
  declare patientConsultationId: number

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

  @belongsTo(() => PatientConsultation)
  public PatientConsultation!: BelongsTo<typeof PatientConsultation>

  @belongsTo(() => User)
  public Medic!: BelongsTo<typeof User>
}
