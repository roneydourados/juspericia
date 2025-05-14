import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'patient_consultation_reports'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .uuid('public_id')
        .defaultTo(this.db.raw('uuid_generate_v4()'))
        .index('patient_consultation_reports_idx_public_id')
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table
        .integer('patient_consultation_id')
        .notNullable()
        .references('id')
        .inTable('patient_consultations')
        .onDelete('CASCADE')
      table.text('content', 'longtext').notNullable()
      table.string('status', 20).defaultTo('active')
      table.date('report_date').defaultTo(this.db.raw('now()'))
      table.string('user_deleted', 255).nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
