import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class UserCredit extends BaseModel {
  static table = 'system_parameters'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'public_id' })
  declare publicId: string

  @column({ columnName: 'owner_id' })
  declare ownerId: number

  @column({ columnName: 'user_id' })
  declare userId: number

  @column({ columnName: 'credit_date' })
  declare creditDate: string

  @column({ columnName: 'expire_date' })
  declare expireDate: string

  @column()
  declare value: number

  @column()
  declare salt: number

  @column()
  declare category: string

  @column()
  declare status: string

  @column({ columnName: 'transaction_receipt_url' })
  declare transactionReceiptUrl: string

  @column({ columnName: 'invoice_url' })
  declare invoiceUrl: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
