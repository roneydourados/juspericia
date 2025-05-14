import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Address extends BaseModel {
  static table = 'address'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'public_id' })
  declare publicId: string

  @column({ columnName: 'owner_id' })
  declare ownerId: number

  @column({ columnName: 'address_category' })
  declare addressCategory: string

  @column({ columnName: 'address_zipcode' })
  declare addressZipcode: string

  @column({ columnName: 'address_city' })
  declare addressCity: string

  @column({ columnName: 'address_district' })
  declare addressDistrict: string

  @column({ columnName: 'address_street' })
  declare addressStreet: string

  @column({ columnName: 'address_number' })
  declare addressNumber: string

  @column({ columnName: 'address_state' })
  declare addressState: string

  @column({ columnName: 'address_complement' })
  declare addressComplement: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
