import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'report_models'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .uuid('public_id')
        .defaultTo(this.db.raw('uuid_generate_v4()'))
        .index('report_models_idx_public_id')
      table.string('title', 200).notNullable().index('report_models_idx_title')
      table.text('content', 'longtext').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
