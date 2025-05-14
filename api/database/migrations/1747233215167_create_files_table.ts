import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'files'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('public_id').index('files_idx_public_id')
      table.integer('owner_id').notNullable().unsigned().index('files_idx_owner_id')
      table.string('file_category', 30).notNullable().index('files_idx_file_category')
      table.string('file_name', 300).notNullable()
      table.string('file_server_name', 300).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
