import { User, Profile } from '#models/index'
import { UserProps } from '../dtos/index.js'

export default class UserAdminService {
  async create({ email, name, password, cpfCnpj, phone }: UserProps) {
    try {
      await this.validations({ email, name })

      const profile = await Profile.query().where({ type: 'ADMIN' }).firstOrFail()

      const adminUser = await User.create({
        email,
        name,
        password,
        cpfCnpj,
        phone,
        profileId: profile.id,
      })

      return adminUser
    } catch (error) {
      console.error('Error creating user admin:', error)
      throw error
    }
  }

  async update({ email, name, password, cpfCnpj, phone, publicId, active }: UserProps) {
    try {
      const adminUser = await User.query().where({ publicId }).firstOrFail()

      adminUser.merge({
        email,
        name,
        password: password ? password : undefined,
        cpfCnpj,
        phone,
        active,
      })

      await adminUser.save()

      return adminUser
    } catch (error) {
      console.error('Error creating user admin:', error)
      throw error
    }
  }

  async destroy(publicId: string) {
    try {
      const adminUser = await User.query().where({ publicId }).firstOrFail()

      await adminUser.delete()
    } catch (error) {
      console.error('Error deleting user admin:', error)
      throw error
    }
  }

  async index(inputQuery: string) {
    try {
      const adminUsers = await User.query()
        .if(inputQuery, (query) => {
          query.whereILike('name', `%${inputQuery}%`).orWhereILike('email', `%${inputQuery}%`)
        })
        .andWhereHas('profile', (query) => {
          query.where('type', 'ADMIN')
        })
        .orderBy('name', 'asc')

      return adminUsers
    } catch (error) {
      console.error('Error fetching user admin:', error)
      throw error
    }
  }

  async show(publicId: string) {
    try {
      const adminUser = await User.query()
        .where({ publicId })
        .andWhereHas('profile', (query) => {
          query.where('type', 'ADMIN')
        })
        .firstOrFail()

      return adminUser
    } catch (error) {
      console.error('Error fetching user admin:', error)
      throw error
    }
  }

  async validations({ email, name }: UserProps) {
    const adminUsers = await User.query()
      .orWhere('email', 'email')
      .andWhereHas('profile', (query) => {
        query.where('type', 'ADMIN')
      })
      .first()

    if (adminUsers) {
      throw new Error('Email already exists')
    }

    if (!name) {
      throw new Error('Name is required')
    }

    if (!email) {
      throw new Error('Email is required')
    }
  }
}
