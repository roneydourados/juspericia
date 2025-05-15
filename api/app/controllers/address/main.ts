import type { HttpContext } from '@adonisjs/core/http'
import { AddressService } from '#services/index'
import { addressStoreValidator, addressUpdateValidator } from '#validators/address/main'
import { inject } from '@adonisjs/core'

@inject()
export default class AddressController {
  constructor(private addressService: AddressService) {}
  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const data = request.all()

    // Validate the data
    const payload = await addressStoreValidator.validate(data)

    const payloadData = {
      addressZipcode: payload.addressZipcode,
      addressCategory: payload.addressCategory!,
      ownerId: payload.ownerId!,
      addressCity: payload.addressCity,
      addressComplement: payload.addressComplement,
      addressDistrict: payload.addressDistrict,
      addressNumber: payload.addressNumber,
      addressState: payload.addressState,
      addressStreet: payload.addressStreet,
    } as any

    const address = await this.addressService.createAddress(payloadData)

    return response.json(address)
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const { id } = params

    const address = await this.addressService.getAddress(id)

    return address
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ request, response }: HttpContext) {
    const data = request.all()
    const payload = await addressUpdateValidator.validate(data)

    const exists = await this.addressService.getAddress(payload.publicId ?? '')

    if (!exists) {
      return response.notFound('Address not found')
    }

    const payloadData = {
      addressZipcode: payload.addressZipcode,
      addressCategory: payload.addressCategory!,
      ownerId: payload.ownerId!,
      addressCity: payload.addressCity,
      addressComplement: payload.addressComplement,
      addressDistrict: payload.addressDistrict,
      addressNumber: payload.addressNumber,
      addressState: payload.addressState,
      addressStreet: payload.addressStreet,
    } as any

    const address = await this.addressService.updateAddress(payloadData)

    return response.json(address)
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const { id } = params

    await this.addressService.deleteAddress(id)

    return response.ok('deleted')
  }
}
