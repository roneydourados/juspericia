import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_credit_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .uuid('public_id')
        .defaultTo(this.db.raw('uuid_generate_v4()'))
        .index('user_credit_logs_idx_public_id')
      table
        .integer('user_credit_id')
        .notNullable()
        .references('id')
        .inTable('user_credits')
        .onDelete('CASCADE')
      table.text('history', 'longtext').notNullable()
      table.string('type', 1).defaultTo('D')
      table.decimal('value', 15, 2).defaultTo(0)
      table.timestamp('created_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
