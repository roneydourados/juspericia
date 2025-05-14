import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Schedule extends BaseModel {
  static table = 'schedules'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'public_id' })
  declare publicId: string

  @column({ columnName: 'medic_id' })
  declare medicId: number

  @column({ columnName: 'patient_consultation_id' })
  declare patientConsultationId: number

  @column({ columnName: 'schedule_date' })
  declare scheduleDate: string

  @column({ columnName: 'schedule_hour' })
  declare scheduleHour: string

  @column({ columnName: 'atendiment_start' })
  declare atendimentStart: string

  @column({ columnName: 'atendiment_end' })
  declare atendimentEnd: string

  @column()
  declare title: string

  @column({ columnName: 'user_schedule' })
  declare userSchedule: string

  @column()
  declare status: string
}
