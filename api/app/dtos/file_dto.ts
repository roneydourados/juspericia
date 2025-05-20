import type { MultipartFile } from '@adonisjs/core/bodyparser'

export interface FileProps {
  id?: number
  ownerId?: number
  fileCategory?: string
  fileName?: string
  fileServerName?: string
  publicId?: string
  fileData?: MultipartFile
}
