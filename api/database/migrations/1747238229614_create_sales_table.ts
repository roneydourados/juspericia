import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sales'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('public_id').index('sales_idx_public_id')
      table.string('sale_id').notNullable()
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.date('date_created').notNullable()
      table.date('due_date').notNullable()
      table.date('original_due_date').nullable()
      table.string('description').notNullable()
      table.string('nosso_numero').nullable()
      table.decimal('value', 15, 2).defaultTo(0)
      table.decimal('net_value', 15, 2).defaultTo(0)
      table.string('billing_type').notNullable()
      table.string('status').notNullable()
      table.date('confirmed_date').nullable()
      table.date('payment_date').nullable()
      table.text('transaction_receipt_url', 'longtext').nullable()
      table.text('invoice_url', 'longtext').nullable()
      table.string('local_status').defaultTo('pending')
      table.date('expired_at').nullable()
      table.string('category', 40).nullable()
      table.integer('package_id').references('id').inTable('service_packages').onDelete('SET NULL')
      table
        .integer('solicitation_id')
        .references('id')
        .inTable('patient_consultations')
        .onDelete('SET NULL')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
