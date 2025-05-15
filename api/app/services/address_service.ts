import { Address } from '#models/index'

export default class AddressService {
  async createAddress(payload: Address) {
    const address = await Address.create(payload)

    return address
  }

  async updateAddress(payload: Address) {
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
