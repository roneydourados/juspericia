import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'benefit_types'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('public_id').index('benefit_types_idx_public_id')
      table.string('name', 200).notNullable().index('benefit_types_idx_name')
    })

    this.schema.raw(
      `ALTER TABLE public.${this.tableName} ALTER COLUMN public_id SET DEFAULT uuid_generate_v4();`
    )
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
