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

  @column({ columnName: 'public_id' })
  declare publicId: string

  @column()
  declare name: string

  @column()
  declare email: string

  @column()
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

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
