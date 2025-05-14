import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class BenefitType extends BaseModel {
  static table = 'benefit_types'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'public_id' })
  declare publicId: string

  @column()
  declare name: string
}
