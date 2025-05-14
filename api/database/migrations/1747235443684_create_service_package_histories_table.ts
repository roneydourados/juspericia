import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'service_package_histories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('public_id').index('service_package_histories_idx_public_id')
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table
        .integer('package_id')
        .notNullable()
        .references('id')
        .inTable('service_packages')
        .onDelete('CASCADE')
      table.text('description', 'longtext').notNullable()
      table.string('action').defaultTo('created')

      table.timestamp('created_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
