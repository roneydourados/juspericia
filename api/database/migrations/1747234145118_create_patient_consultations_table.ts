import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'patient_consultations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('public_id').index('patient_consultations_idx_public_id')
      table.integer('patient_id').references('id').inTable('patients').onDelete('CASCADE')
      table.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.integer('medic_id').references('id').inTable('users').onDelete('CASCADE')
      table.integer('consultation_id').references('id').inTable('consultations').onDelete('CASCADE')
      table.text('content', 'longtext').notNullable()
      table.integer('benefit_type_id').references('id').inTable('benefit_types').onDelete('CASCADE')
      table.string('proccess_number', 30).nullable()
      table.string('process_situation', 2).nullable()
      table
        .integer('report_purpose_id')
        .references('id')
        .inTable('report_purposes')
        .onDelete('CASCADE')
      table.string('status', 30).defaultTo('open').index('patient_consultations_idx_status')
      table.decimal('tip_value', 15, 2).defaultTo(0)
      table.date('date_close').nullable()
      table.date('date_open').notNullable()
      table.integer('rate').defaultTo(0)
      table.date('date_antecipation').nullable()
      table.date('date_correction').nullable()
      table.string('reason_correction').nullable()
      table.decimal('antecipation_value', 15, 2).defaultTo(0)
      table.decimal('consultation_value', 15, 2).defaultTo(0)
      table.decimal('value_credit', 15, 2).defaultTo(0)
      table.boolean('is_telemedicine').defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.raw(
      'ALTER TABLE public.patient_consultations ALTER COLUMN date_open SET DEFAULT current_date'
    )

    this.schema.raw(
      `ALTER TABLE public.${this.tableName} ALTER COLUMN public_id SET DEFAULT uuid_generate_v4();`
    )
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
