import { BenefitType } from '#models/index'
import { Exception } from '@adonisjs/core/exceptions'

import { BenefitTypeProps } from '../dtos/index.js'

export default class BenefitTypeService {
  async create({ name }: BenefitTypeProps) {
    try {
      return await BenefitType.create({ name })
    } catch (error) {
      console.error('🚀 ~ Error creating BenefitType:', error)
      throw new Exception('Error to create', { status: 500 })
    }
  }

  async update({ publicId, name }: BenefitTypeProps) {
    const benefitType = await this.exists(publicId!)

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
      .if(query, (q) => {
        q.whereILike('name', `%${query}%`)
      })
      .orderBy('id', 'asc')
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
