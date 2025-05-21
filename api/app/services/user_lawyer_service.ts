import { User, Profile } from '#models/index'
import { UserProps } from '../dtos/index.js'

export default class UserLaywerService {
  async create({
    email,
    name,
    password,
    cpfCnpj,
    phone,
    oab,
    oabUf,
    officeCnpj,
    officeEmail,
    officeName,
    officePhone,
    whatsapp,
  }: UserProps) {
    try {
      await this.validations({ email, name })

      const profile = await Profile.query().where({ name: 'ADVOGADO' }).firstOrFail()

      const adminUser = await User.create({
        email,
        name,
        password,
        cpfCnpj,
        phone,
        profileId: profile.id,
        oab,
        oabUf,
        officeName,
        officeCnpj,
        officeEmail,
        officePhone,
        whatsapp,
      })

      return adminUser
    } catch (error) {
      console.error('Error creating user admin:', error)
      throw error
    }
  }

  async update({
    email,
    name,
    password,
    cpfCnpj,
    phone,
    oab,
    oabUf,
    officeCnpj,
    officeEmail,
    officeName,
    officePhone,
    whatsapp,
    active,
    publicId,
  }: UserProps) {
    try {
      const adminUser = await User.query().where({ publicId }).firstOrFail()

      adminUser.merge({
        email,
        name,
        password,
        cpfCnpj,
        phone,
        oab,
        oabUf,
        officeCnpj,
        officeEmail,
        officeName,
        officePhone,
        whatsapp,
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
        .where('name', 'ILIKE', `%${inputQuery}%`)
        .orWhere('email', 'ILIKE', `%${inputQuery}%`)
        .andWhereHas('profile', (query) => {
          query.where('type', 'ADVOGADO')
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
        query.where('type', 'ADVOGADO')
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
