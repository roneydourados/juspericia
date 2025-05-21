import { UserIndication } from '#models/index'
import { UserIndicationProps } from '../dtos/user_indication_dto.js'
import { formatDate } from '../utils/functions.js'

export default class UserIndicationService {
  async index(input: { initialDate: string; finalDate: string; userId?: number; status?: string }) {
    const { initialDate, finalDate, userId, status } = input

    const indications = await UserIndication.query()
      .whereBetween('created_at', [initialDate, finalDate])
      .if(userId, (q) => {
        q.where({ userId })
      })
      .if(status, (q) => {
        q.where({ status })
      })

    return indications.map((item) => {
      return {
        ...item,
        expiredAt: formatDate(new Date(item.expiredAt)),
        createdAt: formatDate(new Date(item.createdAt.toString())),
      }
    })
  }

  async store(payload: UserIndicationProps) {
    try {
      const { name, email, whatsapp, status, points, expiredAt } = payload

      const indication = await UserIndication.create({
        name,
        email,
        whatsapp,
        status,
        points,
        expiredAt,
      })

      return {
        ...indication,
        expiredAt: formatDate(new Date(indication.expiredAt)),
        createdAt: formatDate(new Date(indication.createdAt.toString())),
      }
    } catch (error) {
      console.error('Error creating user indication:', error)
      throw new Error('Failed to create user indication')
    }
  }

  async update(payload: UserIndicationProps) {
    try {
      const { publicId, name, email, whatsapp, status, points, expiredAt } = payload

      const indication = await UserIndication.query().where({ publicId }).firstOrFail()

      indication.merge({
        name,
        email,
        whatsapp,
        status,
        points,
        expiredAt,
      })

      await indication.save()

      return indication
    } catch (error) {
      console.error('Error updating user indication:', error)
      throw new Error('Failed to update user indication')
    }
  }

  async destroy(publicId: string) {
    try {
      const indication = await UserIndication.query().where({ publicId }).firstOrFail()

      await indication.delete()
    } catch (error) {
      console.error('Error deleting user indication:', error)
      throw new Error('Failed to delete user indication')
    }
  }

  async show(publicId: string) {
    try {
      const indication = await UserIndication.query().where({ publicId }).firstOrFail()

      return {
        ...indication,
        expiredAt: formatDate(new Date(indication.expiredAt)),
        createdAt: formatDate(new Date(indication.createdAt.toString())),
      }
    } catch (error) {
      console.error('Error fetching user indication:', error)
      throw new Error('Failed to fetch user indication')
    }
  }
}
