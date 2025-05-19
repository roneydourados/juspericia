import { Address } from '#models/index'

import { AddressProps } from '../dtos/index.js'

export default class AddressService {
  async createAddress(payload: AddressProps) {
    const address = await Address.create(payload)

    return address
  }

  async updateAddress(payload: AddressProps) {
    const address = await Address.query().where({ pulicId: payload.publicId }).firstOrFail()

    address.merge(payload)

    await address.save()

    return address
  }

  async deleteAddress(id: string) {
    const address = await Address.query().where({ publicId: id }).firstOrFail()

    await address.delete()

    return address
  }
  async getAddress(id: string) {
    const address = await Address.query().where({ publicId: id }).firstOrFail()

    return address
  }
}
