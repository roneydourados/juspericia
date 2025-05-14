import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'service_packages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('public_id').index('service_packages_idx_public_id')
      table.string('name').notNullable()
      table.text('description', 'longtext').notNullable()
      table.text('url_image', 'longtext').notNullable()
      table.decimal('value', 18, 2).defaultTo(0)
      table.string('status', 20).defaultTo('active')
      table.integer('due_days').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
