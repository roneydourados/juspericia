import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_credits'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('public_id').index('user_credits_idx_public_id')
      table.integer('owner_id').notNullable().index('user_credits_idx_owner_id')
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.date('credit_date').notNullable().index('user_credits_idx_credit_date')
      table.date('expire_date').notNullable()
      table.decimal('value', 15, 2).defaultTo(0)
      table.decimal('salt', 15, 2).defaultTo(0)
      table.string('category', 20).notNullable()
      table.string('status', 20).defaultTo('PENDING').index('user_credits_idx_status')
      table.text('transaction_receipt_url', 'longtext').nullable()
      table.text('invoice_url', 'longtext').nullable()

      table.timestamp('created_at')
    })

    this.schema.raw(
      'ALTER TABLE public.user_credits ALTER COLUMN credit_date SET DEFAULT current_date'
    )

    this.schema.raw(
      `ALTER TABLE public.${this.tableName} ALTER COLUMN public_id SET DEFAULT uuid_generate_v4();`
    )
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
