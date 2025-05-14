import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

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
}
