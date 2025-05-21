import db from '@adonisjs/lucid/services/db'
import { PatientConsultation, Schedule, UserCredit, UserCreditLog } from '#models/index'
import dayjs from 'dayjs'

import { SolicitationConsultationProps } from '../dtos/index.js'

export default class SolicitationConsultationService {
  async index(filters: {
    initialDateSolicitation: string
    finalDateSolicitation: string
    status: string
    patientId?: number
    benefitTypeId?: number //tipo de benefício
    reportPurposeId?: number //finalidade do laudo
    userId?: number
  }) {
    const {
      initialDateSolicitation,
      finalDateSolicitation,
      status,
      patientId,
      benefitTypeId,
      reportPurposeId,
      userId,
    } = filters

    const sStatus = status === 'all' ? undefined : status

    const patientConsultation = await PatientConsultation.query()
      .preload('Schedule', (query) => {
        query.preload('Medic')
        query.where('status', 'active')
      })
      .preload('Medic')
      .preload('Patient', (query) => {
        query.preload('User')
      })
      .preload('Consultation')
      .preload('BenefitType')
      .preload('ReportPurpose')
      .preload('Sales')
      .preload('PatientConsultationReport', (query) => {
        query.first()
        query.where('status', 'active')
      })
      .whereBetween('date_open', [initialDateSolicitation, finalDateSolicitation])
      .if(sStatus, (q) => {
        if (sStatus) {
          q.where('status', sStatus)
        }
      })
      .if(patientId, (q) => {
        if (patientId) {
          q.where('patientId', patientId)
        }
      })
      .if(benefitTypeId, (q) => {
        if (benefitTypeId) {
          q.where('benefitTypeId', benefitTypeId)
        }
      })
      .if(reportPurposeId, (q) => {
        if (reportPurposeId) {
          q.where('reportPurposeId', reportPurposeId)
        }
      })
      .if(userId, (q) => {
        if (userId) {
          q.where('userId', userId)
        }
      })
      .orderBy('id', 'desc')

    return patientConsultation
  }

  async create({
    content,
    benefitTypeId,
    reportPurposeId,
    patientId,
    medicId,
    status,
    processSituation,
    proccessNumber,
    tipValue,
    userId,
    consultationId,
    dateOpen,
    consultationValue,
    valueCredit,
  }: SolicitationConsultationProps) {
    try {
      const patientConsultation = await PatientConsultation.create({
        content,
        benefitTypeId,
        reportPurposeId,
        patientId,
        medicId,
        status,
        processSituation,
        proccessNumber,
        tipValue,
        userId,
        consultationId,
        dateOpen,
        consultationValue,
        valueCredit,
      })
      return patientConsultation
    } catch (error) {
      console.error('Error creating patient consultation:', error)
      throw error
    }
  }

  async update({
    content,
    benefitTypeId,
    reportPurposeId,
    patientId,
    medicId,
    status,
    processSituation,
    proccessNumber,
    tipValue,
    userId,
    consultationId,
    dateClose,
    dateAntecipation,
    dateCorrection,
    rate,
    reasonCorrection,
    consultationValue,
    antecipationValue,
    isTelemedicine,
    publicId,
  }: SolicitationConsultationProps) {
    const trx = await db.transaction()
    try {
      const solicitation = await this.show(publicId!)

      if (solicitation) {
        solicitation.useTransaction(trx)

        solicitation.merge({
          content,
          benefitTypeId,
          reportPurposeId,
          patientId,
          medicId,
          status,
          processSituation,
          proccessNumber,
          tipValue,
          userId,
          consultationId,
          dateClose,
          dateAntecipation,
          dateCorrection,
          rate,
          reasonCorrection,
          consultationValue,
          antecipationValue,
          isTelemedicine,
        })

        await solicitation.save()

        // aqui indica que se iniciou uma nova consulta de telemedicina
        if (isTelemedicine) {
          //pegar a data que a consulta iniciou
          const atendimentStart = dayjs().format('YYYY-MM-DD HH:mm:ss')

          await Schedule.updateOrCreate(
            {
              status: 'active',
              patientConsultationId: solicitation.id,
            },
            {
              status: 'scheduled',
              atendimentStart,
            },
            {
              client: trx,
            }
          )
        }

        // aqui indica que finalizou o atendimento
        if (isTelemedicine && status === 'finished') {
          //pegar a data que a consulta finalizou
          const atendimentEnd = dayjs().format('YYYY-MM-DD HH:mm:ss')
          await Schedule.updateOrCreate(
            {
              status: 'active',
              patientConsultationId: solicitation.id,
            },
            {
              atendimentEnd,
            },
            {
              client: trx,
            }
          )
        }

        trx.commit()

        return solicitation
      }
    } catch (error) {
      console.error('Error creating patient consultation:', error)
      throw error
    }
  }

  async destroy(publicId: string) {
    try {
      const solicitation = await PatientConsultation.query().where({ publicId }).firstOrFail()

      await solicitation.delete()

      return solicitation
    } catch (error) {
      console.error('Error creating patient consultation:', error)
      throw error
    }
  }

  async show(publicId: string) {
    const patientConsultation = await PatientConsultation.query()
      .where({ publicId })
      .preload('PatientConsultationReport')
      .preload('Schedule', (query) => {
        query.preload('Medic')
      })
      .preload('BenefitType')
      .preload('ReportPurpose')
      .preload('Patient', (query) => {
        query.preload('User')
      })
      .preload('Consultation')
      .first()

    return patientConsultation
  }

  async paidConsultationCreditSalt({
    // content,
    // benefitTypeId,
    // reportPurposeId,
    // patientId,
    // medicId,
    // status,
    // processSituation,
    // proccessNumber,
    // tipValue,
    userId,
    // consultationId,
    // dateClose,
    // dateAntecipation,
    // dateCorrection,
    // rate,
    // reasonCorrection,
    // consultationValue,
    antecipationValue,
    // isTelemedicine,
    publicId,
    valueCredit,
    id,
  }: SolicitationConsultationProps) {
    const trx = await db.transaction()
    try {
      let totalCheck = Number(valueCredit ?? 0) + Number(antecipationValue ?? 0)

      const salts = await UserCredit.query()
        .where({ status: 'CONFIRMED', userId, category: 'package' })
        .andWhere('salt', '>', 0)
        .andWhere('expire_date', '>', dayjs().format('YYYY-MM-DD'))
        .orderBy('id', 'desc')

      const updateSalts = salts.map(async (userCreditItem) => {
        const currentDate = dayjs()

        //verificar se a data de expiração do saldo não foi expirada
        if (!dayjs(userCreditItem.expireDate).isBefore(currentDate)) {
          if (Number(userCreditItem.salt) >= totalCheck && totalCheck > 0) {
            // se o saldo disponível do item for maior ou igual ao total
            await UserCredit.updateOrCreate(
              { publicId: userCreditItem.publicId! }, // where (searchCriteria)
              { salt: Number(userCreditItem.salt) - totalCheck },
              { client: trx } // update (updateData)
            )

            await UserCreditLog.create(
              {
                userCreditId: userCreditItem.id!,
                history: `Saída de crédito ref. a compra de  solicitação de consulta Nª ${
                  id
                } no valor de R$ ${totalCheck.toFixed(
                  2
                )}, saldo a descontar: ${totalCheck.toFixed(2)}`.trim(),
                type: 'D',
                value: totalCheck,
              },
              { client: trx }
            )

            totalCheck = 0
          } else if (Number(userCreditItem.salt) < totalCheck && totalCheck > 0) {
            await UserCredit.updateOrCreate(
              { publicId: userCreditItem.publicId! }, // where (searchCriteria)
              { salt: 0 }, // update (updateData)
              { client: trx } // update (updateData)
            )

            await UserCreditLog.create(
              {
                userCreditId: userCreditItem.id!,
                history: `Saída de crédito ref. a compra de  solicitação de consulta Nª ${
                  id
                } no valor de R$ ${totalCheck.toFixed(2)}, saldo restante a descontar: ${Number(
                  userCreditItem.salt
                ).toFixed(2)}`.trim(),
                type: 'D',
                value: Number(totalCheck - Number(userCreditItem.salt)),
              },
              { client: trx }
            )

            // atualizar total check para debitar o restante de outro pacote disponível
            totalCheck = totalCheck - Number(userCreditItem.salt)
          }
        }
      })

      if (updateSalts.length > 0) {
        //atualizar os saldos dos pacotes
        await Promise.all(updateSalts)

        //atualizar a solicitação para paga
        await PatientConsultation.updateOrCreate({ publicId }, { status: 'paid' }, { client: trx }) // atualizar status da solicitação
      }

      trx.commit()
    } catch (error) {
      await trx.rollback()
      console.error('Error creating payment salt patient consultation:', error)
      throw error
    }
  }
}
