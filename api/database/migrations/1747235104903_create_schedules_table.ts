import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'schedules'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .uuid('public_id')
        .defaultTo(this.db.raw('uuid_generate_v4()'))
        .index('schedules_idx_public_id')
      table.integer('medic_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table
        .integer('patient_consultation_id')
        .notNullable()
        .references('id')
        .inTable('patient_consultations')
        .onDelete('CASCADE')
      table.string('schedule_date', 10).notNullable().index('schedules_idx_schedule_date')
      table.string('schedule_hour', 5).notNullable()
      table.string('atendiment_start', 40).nullable()
      table.string('atendiment_end', 40).nullable()
      table.string('title', 200).notNullable()
      table.string('user_schedule', 200).notNullable().index('schedules_idx_user_schedule')
      table.string('status', 20).defaultTo('active').index('schedules_idx_status')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
