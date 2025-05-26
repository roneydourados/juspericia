import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { User } from '#models/index'

export default class Sale extends BaseModel {
  static table = 'sales'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'public_id' })
  declare publicId: string

  @column({ columnName: 'solicitation_id' })
  declare solicitationId: number

  @column({ columnName: 'sale_id' })
  declare saleId: string

  @column({ columnName: 'user_id' })
  declare userId: number

  @column({ columnName: 'date_created' })
  declare dateCreated: string

  @column({ columnName: 'due_date' })
  declare dueDate: string

  @column({ columnName: 'original_due_date' })
  declare originalDueDate: string

  @column()
  declare description: string

  @column({ columnName: 'nosso_numero' })
  declare nossoNumero: string

  @column()
  declare value: number

  @column({ columnName: 'net_value' })
  declare netValue: number

  @column({ columnName: 'billing_type' })
  declare billingType: string

  @column()
  declare status: string

  @column({ columnName: 'confirmed_date' })
  declare confirmedDate: string

  @column({ columnName: 'payment_date' })
  declare paymentDate: string

  @column({ columnName: 'transaction_receipt_url' })
  declare transactionReceiptUrl: string

  @column({ columnName: 'invoice_url' })
  declare invoiceUrl: string

  @column({ columnName: 'local_status' })
  declare localStatus: string

  @column({ columnName: 'expired_at' })
  declare expiredAt: string

  @column()
  declare category: string

  @column({ columnName: 'package_id' })
  declare packageId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  public User!: BelongsTo<typeof User>

  // @belongsTo(() => PatientConsultation, {
  //   foreignKey: 'solicitationId',
  // })
  // public PatientConsultation!: BelongsTo<typeof PatientConsultation>
}
