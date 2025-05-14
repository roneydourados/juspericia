import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ReportPurpose extends BaseModel {
  static table = 'report_purposes'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'public_id' })
  declare publicId: string

  @column()
  declare name: string
}
