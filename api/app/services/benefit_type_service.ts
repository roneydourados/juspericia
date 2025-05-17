import { BenefitType } from '#models/index'
import { Exception } from '@adonisjs/core/exceptions'

export default class BenefitTypeService {
  async create(input: { name: string }) {
    const { name } = input
    try {
      return await BenefitType.create({ name })
    } catch (error) {
      console.error('🚀 ~ Error creating BenefitType:', error)
      throw new Exception('Error to create', { status: 500 })
    }
  }

  async update(input: { publicId: string; name: string }) {
    const { publicId, name } = input

    const benefitType = await this.exists(publicId)

    try {
      benefitType.name = name
      await benefitType.save()
      return benefitType
    } catch (error) {
      console.error('🚀 ~ Error updating BenefitType:', error)
      throw new Exception('Error to update', { status: 500 })
    }
  }

  async destroy(publicId: string) {
    const benefitType = await this.exists(publicId)

    try {
      await benefitType.delete()
    } catch (error) {
      console.error('🚀 ~ Error deleting BenefitType:', error)
      throw new Exception('Error to remove', { status: 500 })
    }
  }

  async index(query: string) {
    return BenefitType.query()
      .whereILike('name', `%${query}%`)
      .orderBy('id', 'asc')
      .select(['id', 'name', 'publicId'])
  }

  async show(publicId: string) {
    return this.exists(publicId)
  }

  async exists(publicId: string) {
    const benefitType = await BenefitType.query()
      .where('publicId', publicId)
      .select(['id', 'name', 'publicId'])
      .first()

    if (!benefitType) {
      throw new Exception('Not found', { status: 404 })
    }

    return benefitType
  }
}
