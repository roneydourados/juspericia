import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class SystemParameter extends BaseModel {
  static table = 'system_parameters'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'public_id' })
  declare publicId: string

  @column({ columnName: 'points_per_indication' })
  declare pointsPerIndication: number

  @column({ columnName: 'points_exchange' })
  declare pointsExchange: number

  @column({ columnName: 'points_exchange_value' })
  declare pointsExchangeValue: number

  @column({ columnName: 'days_points_expire' })
  declare daysPointsExpire: number

  @column()
  declare comission: number

  @column({ columnName: 'days_credit_expire' })
  declare daysCreditExpire: number

  @column({ columnName: 'suport_whatsapp' })
  declare suportWhatsapp: string
}
