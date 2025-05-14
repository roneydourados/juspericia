import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'patient_consultation_reports'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('public_id').index('patient_consultation_reports_idx_public_id')
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table
        .integer('patient_consultation_id')
        .notNullable()
        .references('id')
        .inTable('patient_consultations')
        .onDelete('CASCADE')
      table.text('content', 'longtext').notNullable()
      table.string('status', 20).defaultTo('active')
      table.date('report_date').notNullable()
      table.string('user_deleted', 255).nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.raw(
      'ALTER TABLE public.patient_consultation_reports ALTER COLUMN report_date SET DEFAULT current_date'
    )

    this.schema.raw(
      `ALTER TABLE public.${this.tableName} ALTER COLUMN public_id SET DEFAULT uuid_generate_v4();`
    )
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
