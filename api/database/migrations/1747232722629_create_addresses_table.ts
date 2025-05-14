import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'address'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('public_id').index('address_idx_public_id')
      table.integer('owner_id').notNullable().unsigned().index('address_idx_owner_id')
      table.string('address_category', 30).notNullable().index('address_idx_address_category')
      table.string('address_zipcode', 20).nullable().index('address_idx_address_zipcode')
      table.string('address_city', 100).nullable().index('address_idx_address_city')
      table.string('address_district', 100).nullable()
      table.string('address_street', 100).nullable()
      table.string('address_number', 10).nullable()
      table.string('address_state', 2).nullable()
      table.string('address_complement', 100).nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
