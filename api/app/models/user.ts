import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  static table = 'users'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare phone: string | null

  @column({ columnName: 'cpf_cnpj' })
  declare cpfCnpj: string | null

  @column()
  declare oab: string | null

  @column()
  declare crm: string | null

  @column({ columnName: 'crm_uf' })
  declare crmUf: string | null

  @column({ columnName: 'profile_id' })
  declare profileId: number

  @column({ columnName: 'office_name' })
  declare officeName: string | null

  @column()
  declare active: boolean

  @column({ columnName: 'office_cnpj' })
  declare officeCnpj: string | null

  @column({ columnName: 'office_email' })
  declare officeEmail: string | null

  @column({ columnName: 'office_phone' })
  declare officePhone: string | null

  @column({ columnName: 'public_id' })
  declare publicId: string | null

  @column({ columnName: 'medic_consultation_value' })
  declare medicConsultationValue: number | null

  @column({ columnName: 'medic_consultation_type' })
  declare medicConsultationType: string | null

  @column({ columnName: 'customer_id' })
  declare customerId: string | null

  @column()
  declare whatsapp: string | null

  @column({ columnName: 'medic_hour_end' })
  declare medicHourEnd: string | null

  @column({ columnName: 'medic_hour_start' })
  declare medicHourStart: string | null

  @column({ columnName: 'medic_query_interval' })
  declare medicQueryInterval: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
