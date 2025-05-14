import { BaseSchema } from '@adonisjs/lucid/schema'
import { profileTypes } from '../../app/utils/datatypes.js'

export default class extends BaseSchema {
  protected tableName = 'profiles'

  async up() {
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .uuid('publicId')
        //.defaultTo(this.schema.raw('uuid_generate_v4()'))
        .index('profiles_idx_public_id')
      table.string('profileName', 50)
      table.enu('type', profileTypes).defaultTo('ADVOGADO')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
