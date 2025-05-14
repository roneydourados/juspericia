import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'system_parameters'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('public_id').defaultTo(this.db.raw('uuid_generate_v4()'))
      table.integer('points_per_indication').defaultTo(0)
      table.integer('points_exchange').defaultTo(0)
      table.decimal('points_exchange_value', 15, 2).defaultTo(0)
      table.integer('days_points_expire').defaultTo(0)
      table.decimal('comission', 15, 2).defaultTo(0)
      table.integer('days_credit_expire').defaultTo(0)
      table.string('suport_whatsapp', 20).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
