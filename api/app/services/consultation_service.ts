import { Consultation } from '#models/index'
import { Exception } from '@adonisjs/core/exceptions'
import { ConsultationProps } from '../dtos/index.js'

export default class ConsultationService {
  async create({
    consultationName,
    value,
    valueAntecipation24,
    valueAntecipation48,
    valueAntecipation72,
    valueCredit,
    valuePacket,
  }: ConsultationProps) {
    try {
      return await Consultation.create({
        consultationName,
        value,
        valueAntecipation24,
        valueAntecipation48,
        valueAntecipation72,
        valueCredit,
        valuePacket,
      })
    } catch (error) {
      console.error('🚀 ~ Error creating Consultation:', error)
      throw new Exception('Error to create', { status: 500 })
    }
  }

  async update({
    publicId,
    consultationName,
    value,
    valueAntecipation24,
    valueAntecipation48,
    valueAntecipation72,
    valueCredit,
    valuePacket,
  }: ConsultationProps) {
    const consultation = await this.exists(publicId!)

    try {
      consultation.merge({
        publicId,
        consultationName,
        value,
        valueAntecipation24,
        valueAntecipation48,
        valueAntecipation72,
        valueCredit,
        valuePacket,
      })

      await consultation.save()
      return consultation
    } catch (error) {
      console.error('🚀 ~ Error updating Consultation:', error)
      throw new Exception('Error to update', { status: 500 })
    }
  }

  async destroy(publicId: string) {
    const consultation = await this.exists(publicId)

    try {
      await consultation.delete()
    } catch (error) {
      console.error('🚀 ~ Error removing Consultation:', error)
      throw new Exception('Error to remove', { status: 500 })
    }
  }

  async index(query: string) {
    return Consultation.query()
      .whereILike('consultationName', `%${query}%`)
      .orderBy('id', 'asc')
      .select([
        'id',
        'consultationName',
        'value',
        'valueAntecipation24',
        'valueAntecipation48',
        'valueAntecipation72',
        'valueCredit',
        'valuePacket',
        'publicId',
      ])
  }

  async show(publicId: string) {
    return this.exists(publicId)
  }

  async exists(publicId: string) {
    const consultation = await Consultation.query()
      .where('publicId', publicId)
      .select([
        'id',
        'consultationName',
        'value',
        'valueAntecipation24',
        'valueAntecipation48',
        'valueAntecipation72',
        'valueCredit',
        'valuePacket',
        'publicId',
      ])
      .first()

    if (!consultation) {
      throw new Exception('Not found', { status: 404 })
    }

    return consultation
  }
}
