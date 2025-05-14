import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'consultations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .uuid('public_id')
        .defaultTo(this.db.raw('uuid_generate_v4()'))
        .index('consultations_idx_public_id')
      table
        .string('consultation_name', 200)
        .notNullable()
        .index('consultations_idx_consultation_name')
      table.decimal('value', 15, 2).defaultTo(0)
      table.decimal('value_credit', 15, 2).defaultTo(0)
      table.decimal('value_packet', 15, 2).defaultTo(0)
      table.decimal('value_antecipation_24', 15, 2).defaultTo(0)
      table.decimal('value_antecipation_48', 15, 2).defaultTo(0)
      table.decimal('value_antecipation_72', 15, 2).defaultTo(0)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
