import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class File extends BaseModel {
  static table = 'files'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'public_id' })
  declare publicId: string

  @column({ columnName: 'owner_id' })
  declare ownerId: number

  @column({ columnName: 'file_category' })
  declare fileCategory: string

  @column({ columnName: 'file_name' })
  declare fileName: string

  @column({ columnName: 'file_server_name' })
  declare fileServerName: string
}
