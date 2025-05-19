import { User, Profile, Address } from '#models/index'
import { addressCategoryType } from '../utils/datatypes.js'
import { UserProps } from '../dtos/index.js'

export default class MedicService {
  async index(inputQuery: string) {
    const users = await User.query()
      .select(
        'id',
        'name',
        'cpfCnpj',
        'phone',
        'crm',
        'active',
        'crmUf',
        'email',
        'public_id',
        'medicHourEnd',
        'medicHourStart',
        'medicQueryInterval',
        'medicConsultationValue',
        'medicConsultationType'
      )
      .where((query) => {
        query.where('email', 'LIKE', `%${inputQuery}%`).orWhere('name', 'LIKE', `%${inputQuery}%`)
      })
      .whereHas('profile', (profileQuery) => {
        // Use whereHas for the Profile relation
        profileQuery.where('type', 'MEDICO')
      })
      .orderBy('name', 'asc')
      .exec()

    const usersWithAddresses = await Promise.all(
      users.map(async (user) => {
        const address = await Address.query()
          .where('owner_id', user.id!)
          .where('address_category', 'user')
          .first()
        return {
          id: user.id,
          name: user.name,
          cpfCnpj: user.cpfCnpj,
          phone: user.phone,
          crm: user.crm,
          active: user.active,
          crmUf: user.crmUf,
          email: user.email,
          medicHourEnd: user.medicHourEnd,
          medicHourStart: user.medicHourStart,
          medicQueryInterval: user.medicQueryInterval,
          Address: address,
          publicId: user.publicId,
          medicConsultationType: user.medicConsultationType,
          medicConsultationValue: user.medicConsultationValue,
        }
      })
    )
    return usersWithAddresses
  }

  async create(payload: UserProps) {
    const profile = await Profile.findBy('type', 'MEDICO')

    if (!profile) {
      throw new Error('Profile not found is required')
    }

    try {
      const user = await User.create({
        email: payload.email!,
        name: payload.name!,
        password: payload.password!,
        active: true,
        crm: payload.crm,
        cpfCnpj: payload.cpfCnpj,
        crmUf: payload.crmUf,
        phone: payload.phone,
        profileId: profile.id, // Use profile.id
        medicConsultationValue: payload.medicConsultationValue,
        medicHourEnd: payload.medicHourEnd,
        medicHourStart: payload.medicHourStart,
        medicQueryInterval: payload.medicQueryInterval,
      })

      if (payload.Address) {
        await Address.create({
          addressCity: payload.Address.addressCity,
          addressComplement: payload.Address.addressComplement,
          addressDistrict: payload.Address.addressDistrict,
          addressNumber: payload.Address.addressNumber,
          addressState: payload.Address.addressState,
          addressStreet: payload.Address.addressStreet,
          addressZipcode: payload.Address.addressZipcode,
          ownerId: user.id,
          addressCategory: addressCategoryType.user,
        })
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    } catch (error) {
      console.error('Error creating Medic:', error)
      throw new Error('Error to create medic')
    }
  }

  async update(payload: UserProps) {
    const user = await User.query().where({ publicId: payload.publicId! }).firstOrFail() // Await the exists check

    try {
      user.email = payload.email ?? user.email // Use nullish coalescing
      user.name = payload.name ?? user.name
      if (payload.password !== undefined) {
        user.password = payload.password
      }
      user.active = payload.active ?? user.active
      user.crm = payload.crm ?? user.crm
      user.cpfCnpj = payload.cpfCnpj ?? user.cpfCnpj
      user.crmUf = payload.crmUf ?? user.crmUf
      user.phone = payload.phone ?? user.phone
      user.medicHourEnd = payload.medicHourEnd ?? user.medicHourEnd
      user.medicHourStart = payload.medicHourStart ?? user.medicHourStart
      user.medicQueryInterval = payload.medicQueryInterval ?? user.medicQueryInterval
      user.medicConsultationValue = payload.medicConsultationValue ?? user.medicConsultationValue
      user.medicConsultationType = payload.medicConsultationType ?? user.medicConsultationType
      await user.save()

      if (payload.Address) {
        // Delete the existing address
        await Address.query().where('owner_id', user.id!).where('address_category', 'user').delete()

        // Create the new address
        await Address.create({
          addressCity: payload.Address.addressCity,
          addressComplement: payload.Address.addressComplement,
          addressDistrict: payload.Address.addressDistrict,
          addressNumber: payload.Address.addressNumber,
          addressState: payload.Address.addressState,
          addressStreet: payload.Address.addressStreet,
          addressZipcode: payload.Address.addressZipcode,
          ownerId: user.id,
          addressCategory: addressCategoryType.user, // Use the correct address category
        })
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        publicId: user.publicId,
      }
    } catch (error) {
      console.error('Error updating Medic:', error)
      throw new Error('Error to update Medic')
    }
  }

  async destroy(id: string) {
    const user = await User.query().where({ publicId: id }).firstOrFail()

    try {
      // Delete the user's address first
      await Address.query()
        .where('owner_id', user.id!)
        .where('address_category', addressCategoryType.user)
        .delete()

      // Delete the user
      await user.delete()
    } catch (error) {
      console.error('Error removing Medic:', error)
      throw new Error('Error to remove Medic')
    }
  }

  async exists(id: string) {
    const user = await User.query()
      .where('public_id', id)
      .preload('profile') // Eager load the profile
      .first()

    if (!user) {
      throw new Error('Not found')
    }

    const address = await Address.query()
      .where('owner_id', user.id!)
      .where('address_category', 'user')
      .first()

    return {
      id: user.id,
      name: user.name,
      cpfCnpj: user.cpfCnpj,
      phone: user.phone,
      crm: user.crm,
      active: user.active,
      crmUf: user.crmUf,
      email: user.email,
      Address: address,
      publicId: user.publicId,
      medicHourEnd: user.medicHourEnd,
      medicHourStart: user.medicHourStart,
      medicQueryInterval: user.medicQueryInterval,
      medicConsultationType: user.medicConsultationType,
      medicConsultationValue: user.medicConsultationValue,
      profile: user.profile, // Include the profile data
    }
  }
}
