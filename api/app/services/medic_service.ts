import { User, Profile, Address } from '#models/index'
import { addressCategoryType } from '../utils/datatypes.js'
import { UserProps } from '../dtos/index.js'
import db from '@adonisjs/lucid/services/db'

export default class MedicService {
  async index(inputQuery: string) {
    const users = await User.query()
      .preload('profile') // Eager load the profile
      .if(inputQuery, (query) => {
        query.whereILike('email', `%${inputQuery}%`)
        query.orWhereILike('name', `%${inputQuery}%`)
      })
      .whereHas('profile', (profileQuery) => {
        // Use whereHas for the Profile relation
        profileQuery.where({ type: 'MEDICO' })
      })
      .orderBy('name', 'asc')

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
          profile: user.profile, // Include the profile data
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

    const trx = await db.transaction()
    try {
      const user = await User.create(
        {
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
        },
        { client: trx }
      )

      if (payload.UserAddress) {
        await Address.create(
          {
            addressCity: payload.UserAddress.addressCity,
            addressComplement: payload.UserAddress.addressComplement,
            addressDistrict: payload.UserAddress.addressDistrict,
            addressNumber: payload.UserAddress.addressNumber,
            addressState: payload.UserAddress.addressState,
            addressStreet: payload.UserAddress.addressStreet,
            addressZipcode: payload.UserAddress.addressZipcode,
            ownerId: user.id,
            addressCategory: addressCategoryType.user,
          },
          { client: trx }
        )
      }

      await trx.commit()

      return {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    } catch (error) {
      await trx.rollback()
      console.error('Error creating Medic:', error)
      throw new Error('Error to create medic')
    }
  }

  async update(payload: UserProps) {
    const user = await User.query().where({ publicId: payload.publicId! }).firstOrFail() // Await the exists check

    const trx = await db.transaction()
    try {
      user.useTransaction(trx) // Use the transaction for the update

      user.merge({
        email: payload.email,
        name: payload.name,
        password: payload.password,
        active: payload.active,
        crm: payload.crm,
        cpfCnpj: payload.cpfCnpj,
        crmUf: payload.crmUf,
        phone: payload.phone,
        medicHourEnd: payload.medicHourEnd,
        medicHourStart: payload.medicHourStart,
        medicQueryInterval: payload.medicQueryInterval,
        medicConsultationValue: payload.medicConsultationValue,
        medicConsultationType: payload.medicConsultationType,
      })

      await user.save()

      if (payload.UserAddress) {
        // Delete the existing address
        const existsAddres = await Address.query()
          .where('owner_id', user.id!)
          .where('address_category', addressCategoryType.user)
          .first()

        if (existsAddres) {
          existsAddres.useTransaction(trx) // Use the transaction for the delete

          await existsAddres.delete()
        }

        // Create the new address
        await Address.create(
          {
            addressCity: payload.UserAddress.addressCity,
            addressComplement: payload.UserAddress.addressComplement,
            addressDistrict: payload.UserAddress.addressDistrict,
            addressNumber: payload.UserAddress.addressNumber,
            addressState: payload.UserAddress.addressState,
            addressStreet: payload.UserAddress.addressStreet,
            addressZipcode: payload.UserAddress.addressZipcode,
            ownerId: user.id,
            addressCategory: addressCategoryType.user, // Use the correct address category
          },
          { client: trx }
        )
      }

      await trx.commit()

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        publicId: user.publicId,
      }
    } catch (error) {
      await trx.rollback()
      console.error('Error updating Medic:', error)
      throw new Error('Error to update Medic')
    }
  }

  async destroy(id: string) {
    const user = await User.query().where({ publicId: id }).firstOrFail()

    const trx = await db.transaction()
    try {
      user.useTransaction(trx) // Use the transaction for the delete

      const existsAddres = await Address.query()
        .where('owner_id', user.id!)
        .where('address_category', addressCategoryType.user)
        .first()

      if (existsAddres) {
        existsAddres.useTransaction(trx) // Use the transaction for the delete

        await existsAddres.delete()
      }

      // Delete the user
      await user.delete()

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      console.error('Error removing Medic:', error)
      throw new Error('Error to remove Medic')
    }
  }

  async exists(id: string) {
    const user = await User.query()
      .where('public_id', id)
      .preload('profile') // Eager load the profile
      .preload('UserAddress')
      .firstOrFail()

    return user
  }
}
