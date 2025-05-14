import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { hashText } from '../services/hash.js'
import Profile from './profile.js'

export default class User extends BaseModel {
  static table = 'users'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'public_id' })
  declare publicId: string

  @column()
  declare name: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare phone: string

  @column({ columnName: 'cpf_cnpj' })
  declare cpfCnpj: string

  @column()
  declare oab: string

  @column({ columnName: 'oab_uf' })
  declare oabUf: string

  @column()
  declare crm: string

  @column({ columnName: 'crm_uf' })
  declare crmUf: string

  @column({ columnName: 'profile_id' })
  declare profileId: number

  @column({ columnName: 'office_name' })
  declare officeName: string

  @column({ columnName: 'office_cnpj' })
  declare officeCnpj: string

  @column({ columnName: 'office_email' })
  declare officeEmail: string

  @column({ columnName: 'office_phone' })
  declare officePhone: string

  @column()
  declare active: boolean

  @column({ columnName: 'medic_consultation_value' })
  declare medicConsultationValue: number

  @column({ columnName: 'medic_consultation_type' })
  declare medicConsultationType: string

  @column({ columnName: 'customer_id' })
  declare customerId: string

  @column()
  declare whatsapp: string

  @column({ columnName: 'medic_hour_end' })
  declare medicHourEnd: string

  @column({ columnName: 'medic_hour_start' })
  declare medicHourStart: string

  @column({ columnName: 'medic_query_interval' })
  declare medicQueryInterval: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hashText(user.password)
    }
  }

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '1 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })

  @belongsTo(() => Profile)
  public profile!: BelongsTo<typeof Profile>
}
