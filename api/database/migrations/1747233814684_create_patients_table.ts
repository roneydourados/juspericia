import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'patients'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('public_id').index('patients_idx_public_id')
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('name', 200).notNullable().index('patients_idx_name')
      table.string('surname', 200).notNullable()
      table.string('birth_date', 10).notNullable()
      table.string('email', 1000).nullable().index('patients_idx_email')
      table.string('mother_name', 200).nullable()
      table.string('phone', 20).nullable()
      table.string('cpf', 30).notNullable().index('patients_idx_cpf')
      table.string('rg', 30).notNullable().index('patients_idx_rg')
      table.string('status', 1).defaultTo('A').index('patients_idx_status')
      table.string('sexy', 1).notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
