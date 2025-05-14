import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import ProfileRoute from './profile_route.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Profile extends BaseModel {
  static table = 'profiles'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'public_id' })
  declare publicId: string

  @column({ columnName: 'profile_name' })
  declare profileName: string

  @hasMany(() => ProfileRoute)
  declare routes: HasMany<typeof ProfileRoute>
}
