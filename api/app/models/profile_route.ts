import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Profile from './profile.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class ProfileRoute extends BaseModel {
  static table = 'profile_routes'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'profile_id' })
  declare profileId: number

  @column()
  declare title: string

  @column()
  declare to: string

  @column()
  declare icon: string

  @column()
  declare visible: boolean

  @column()
  declare isMenu: boolean

  @belongsTo(() => Profile)
  declare profile: BelongsTo<typeof Profile>
}
