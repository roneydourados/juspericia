import vine from '@vinejs/vine'
import { addressCategoryType } from '../../utils/datatypes.js'

export const addressStoreValidator = vine.compile(
  vine.object({
    ownerId: vine.number(),
    addressCategory: vine.enum(addressCategoryType),
    addressZipcode: vine.string().trim().optional(),
    addressCity: vine.string().trim().optional(),
    addressDistrict: vine.string().trim().optional(),
    addressStreet: vine.string().trim().optional(),
    addressNumber: vine.string().trim().optional(),
    addressState: vine.string().trim().maxLength(2).optional(),
    addressComplement: vine.string().trim().optional(),
  })
)

export const addressUpdateValidator = vine.compile(
  vine.object({
    publicId: vine.string().trim().optional(),
    ownerId: vine.number(),
    addressCategory: vine.enum(addressCategoryType),
    addressZipcode: vine.string().trim().optional(),
    addressCity: vine.string().trim().optional(),
    addressDistrict: vine.string().trim().optional(),
    addressStreet: vine.string().trim().optional(),
    addressNumber: vine.string().trim().optional(),
    addressState: vine.string().trim().maxLength(2).optional(),
    addressComplement: vine.string().trim().optional(),
  })
)
