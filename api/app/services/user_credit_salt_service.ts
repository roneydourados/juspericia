import { UserCredit, UserCreditLog } from '#models/index'

import { formatDate } from '../utils/functions.js'
import dayjs from 'dayjs'

export default class UserCreditServiceService {
  async index(input: {
    status?: string
    userId: number
    initialDate?: string
    finalDate?: string
  }) {
    const { status, userId, initialDate, finalDate } = input

    let internalStatus = status

    if (status === 'EXPIRED' /*|| status === "FINISHED"*/) {
      internalStatus = undefined
    }

    const credits = await UserCredit.query()
      .if(internalStatus, (q) => {
        q.where({ status: internalStatus })
      })
      .if(userId, (q) => {
        q.where({ userId })
      })
      .if(initialDate && finalDate, (q) => {
        if (initialDate && finalDate) {
          q.whereBetween('credit_date', [initialDate, finalDate])
        }
      })

    const currentDate = dayjs()

    const totals = credits.reduce(
      (acc, item) => {
        const salt = Number(item.salt ?? 0)
        const value = Number(item.value ?? 0)

        // Verifica se o crédito expirou
        if (dayjs(item.expireDate).isBefore(currentDate)) {
          acc.totalExpired += salt
        } else {
          acc.total += salt
        }

        // Verifica se o status é "PENDING"
        if (item.status === 'PENDING') {
          acc.totalPending += value
        }

        return acc
      },
      { total: 0, totalExpired: 0, totalPending: 0 }
    )

    const creditsReturn = credits.map((credit) => {
      return {
        ...credit,
        dateCreated: formatDate(new Date(credit.creditDate)),
        expireDate: formatDate(new Date(credit.expireDate)),
      }
    })

    return {
      totals,
      credits: creditsReturn,
    }
  }

  async userLogCredit(publicId: string) {
    const userCreditSalt = await UserCredit.query().where({ publicId }).first()

    if (!userCreditSalt) {
      return []
    }

    const userCreditLog = await UserCreditLog.query()
      .where({ userCreditId: userCreditSalt.id })
      .orderBy('id', 'desc')

    return userCreditLog
  }
}
