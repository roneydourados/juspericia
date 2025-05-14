import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ReportModel extends BaseModel {
  static table = 'report_models'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'public_id' })
  declare publicId: string

  @column()
  declare title: string

  @column()
  declare content: string
}
