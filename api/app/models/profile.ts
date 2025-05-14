import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Profile extends BaseModel {
  static table = 'profiles'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'public_id' })
  declare publicId: string

  @column({ columnName: 'profile_name' })
  declare profileName: string
}
