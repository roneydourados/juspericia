import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'profile_routes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('profile_id')
        .notNullable()
        .references('id')
        .inTable('profiles')
        .onDelete('CASCADE')
      table.string('title', 200).notNullable()
      table.string('to', 300).notNullable()
      table.string('icon', 100).notNullable()
      table.boolean('visible').defaultTo(true)
      table.boolean('is_menu').defaultTo(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
