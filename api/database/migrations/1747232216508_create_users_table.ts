import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('public_id').index('users_idx_public_id')
      table.string('name', 200).notNullable().index('users_idx_name')
      table.string('email', 1000).notNullable().unique().index('users_idx_email')
      table.string('password')
      table.string('phone', 20).nullable()
      table.string('cpf_cnpj', 30).nullable().index('users_idx_cpf_cnpj')
      table.string('oab', 10).nullable()
      table.string('oab_uf', 2).nullable()
      table.string('crm', 10).nullable()
      table.string('crm_uf', 2).nullable()
      table
        .integer('profile_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('profiles')
        .onDelete('CASCADE')
      table.string('office_name', 200).nullable()
      table.boolean('active').defaultTo(true).index('users_idx_active')
      table.string('office_cnpj', 30).nullable()
      table.string('office_email', 1000).nullable()
      table.string('office_phone', 20).nullable()
      table.decimal('medic_consultation_value', 15, 2).defaultTo(0)
      table.string('medic_consultation_type', 1).defaultTo('V')
      table.string('customer_id', 40).nullable()
      table.string('whatsapp', 20).nullable()
      table.string('medic_hour_end', 5).nullable()
      table.string('medic_hour_start', 5).nullable()
      table.integer('medic_query_interval')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.raw(
      `ALTER TABLE public.${this.tableName} ALTER COLUMN public_id SET DEFAULT uuid_generate_v4();`
    )
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
