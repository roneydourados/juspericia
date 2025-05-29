import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'

import {
  User,
  Patient,
  Consultation,
  ReportPurpose,
  BenefitType,
  Sale,
  Schedule,
  PatientConsultationReport,
  File,
} from '#models/index'

export default class PatientConsultation extends BaseModel {
  static table = 'patient_consultations'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'public_id' })
  declare publicId: string

  @column({ columnName: 'patient_id' })
  declare patientId: number

  @column({ columnName: 'user_id' })
  declare userId: number

  @column({ columnName: 'medic_id' })
  declare medicId: number

  @column({ columnName: 'consultation_id' })
  declare consultationId: number

  @column()
  declare content: string

  @column({ columnName: 'benefit_type_id' })
  declare benefitTypeId: number

  @column({ columnName: 'proccess_number' })
  declare proccessNumber: string

  @column({ columnName: 'process_situation' })
  declare processSituation: string

  @column({ columnName: 'report_purpose_id' })
  declare reportPurposeId: number

  @column()
  declare status: string

  @column({ columnName: 'tip_value' })
  declare tipValue: number

  @column({ columnName: 'date_close' })
  declare dateClose: string

  @column({ columnName: 'date_open' })
  declare dateOpen: string

  @column()
  declare rate: number

  @column({ columnName: 'date_antecipation' })
  declare dateAntecipation: string

  @column({ columnName: 'date_correction' })
  declare dateCorrection: string

  @column({ columnName: 'reason_correction' })
  declare reasonCorrection: string

  @column({ columnName: 'antecipation_value' })
  declare antecipationValue: number

  @column({ columnName: 'consultation_value' })
  declare consultationValue: number

  @column({ columnName: 'value_credit' })
  declare valueCredit: number

  @column({ columnName: 'is_telemedicine' })
  declare isTelemedicine: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'medicId',
  })
  public Medic!: BelongsTo<typeof User>

  @belongsTo(() => Patient)
  public Patient!: BelongsTo<typeof Patient>

  @belongsTo(() => Consultation)
  public Consultation!: BelongsTo<typeof Consultation>

  @belongsTo(() => ReportPurpose)
  public ReportPurpose!: BelongsTo<typeof ReportPurpose>

  @belongsTo(() => BenefitType)
  public BenefitType!: BelongsTo<typeof BenefitType>

  @hasMany(() => PatientConsultationReport)
  public PatientConsultationReport!: HasMany<typeof PatientConsultationReport>

  @hasMany(() => Schedule)
  public Schedule!: HasMany<typeof Schedule>

  @hasMany(() => File, {
    localKey: 'id',
    foreignKey: 'ownerId',
    onQuery: (query) => {
      query.where('file_category', 'solicitation-consultation')
    },
  })
  public files!: HasMany<typeof File>

  @hasOne(() => Sale, {
    localKey: 'id',
    foreignKey: 'solicitationId',
  })
  public sale!: HasOne<typeof Sale>
  // @hasMany(() => Sale)
  // public Sales!: HasMany<typeof Sale>
}
