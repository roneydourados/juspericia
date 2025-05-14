import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_indications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('public_id').index('user_indications_idx_public_id')
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('name', 200).notNullable()
      table.string('email', 1000).notNullable()
      table.string('whatsapp', 20).notNullable()
      table.string('status', 30).defaultTo('PENDING')
      table.integer('points').defaultTo(0)
      table.date('expired_at').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.raw(
      `ALTER TABLE public.${this.tableName} ALTER COLUMN public_id SET DEFAULT uuid_generate_v4();`
    )
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
