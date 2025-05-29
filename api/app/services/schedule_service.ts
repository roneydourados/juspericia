import db from '@adonisjs/lucid/services/db'
import { Schedule, PatientConsultation } from '#models/index'
import { ScheduleProps } from '../dtos/index.js'

export default class ScheduleService {
  async create({
    medicId,
    patientConsultationId,
    scheduleDate,
    scheduleHour,
    title,
    userSchedule,
  }: ScheduleProps) {
    const trx = await db.transaction()
    try {
      const scheduleExists = await Schedule.query()
        .where({ status: 'active', patientConsultationId })
        .first()

      if (scheduleExists) {
        scheduleExists.useTransaction(trx)

        // Cancela a consulta ativa
        scheduleExists.merge({ status: 'canceled' })
        await scheduleExists.save()
      }

      await Schedule.create(
        {
          medicId,
          patientConsultationId,
          scheduleDate,
          scheduleHour,
          title,
          userSchedule,
        },
        { client: trx }
      )

      //atualiza a solicitação de consulta
      if (patientConsultationId) {
        const patienConsultation = await PatientConsultation.query()
          .where({ id: patientConsultationId })
          .first()

        if (patienConsultation) {
          patienConsultation.useTransaction(trx)

          patienConsultation.merge({
            status: 'scheduled',
            medicId: medicId,
          })

          await patienConsultation.save()
        }
      }

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      console.error('Error creating schedule:', error)
      throw error
    }
  }

  async update({
    medicId,
    patientConsultationId,
    scheduleDate,
    scheduleHour,
    title,
    userSchedule,
    publicId,
  }: ScheduleProps) {
    const trx = await db.transaction()
    try {
      const scheduleExists = await this.show(publicId!)

      if (scheduleExists) {
        scheduleExists.useTransaction(trx)

        scheduleExists.merge({
          medicId,
          patientConsultationId,
          scheduleDate,
          scheduleHour,
          title,
          userSchedule,
        })

        await scheduleExists.save()

        if (patientConsultationId && scheduleExists.medicId !== medicId) {
          const patienConsultation = await PatientConsultation.query()
            .where({ id: patientConsultationId })
            .first()

          if (patienConsultation) {
            patienConsultation.useTransaction(trx)

            patienConsultation.merge({
              status: 'scheduled',
              medicId: medicId,
            })

            await patienConsultation.save()
          }
        }
      }

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      console.error('Error updating schedule:', error)
      throw error
    }
  }

  async destroy(publicId: string) {
    const trx = await db.transaction()
    try {
      const scheduleExists = await this.show(publicId)

      if (scheduleExists) {
        scheduleExists.useTransaction(trx)

        await scheduleExists.delete()

        if (scheduleExists.patientConsultationId) {
          const patienConsultation = await PatientConsultation.query()
            .where({ id: scheduleExists.patientConsultationId })
            .first()

          if (patienConsultation) {
            patienConsultation.useTransaction(trx)

            patienConsultation.merge({
              status: 'paid',
            })

            await patienConsultation.save()
          }
        }
      }
      await trx.commit()
    } catch (error) {
      await trx.rollback()
      console.error('Error deleting schedule:', error)
      throw error
    }
  }

  async show(publicId: string) {
    const schedule = await Schedule.query()
      .preload('Medic')
      .preload('PatientConsultation', (query) => {
        query.preload('Patient')
        query.preload('BenefitType')
        query.preload('ReportPurpose')
      })
      .where('publicId', publicId)
      .first()

    return schedule
  }

  async index({ medicId, scheduleDate, patientId, status }: ScheduleProps) {
    const schedule = await Schedule.query()
      .preload('Medic')
      .preload('PatientConsultation', (query) => {
        query.preload('Patient')
        query.preload('BenefitType')
        query.preload('ReportPurpose')
      })
      .whereNot('status', 'canceled')
      .where((query) => {
        if (medicId) {
          query.where({ medicId })
        }

        if (scheduleDate) {
          query.where({ scheduleDate })
        }

        if (patientId) {
          query.whereHas('PatientConsultation', (q) => {
            q.where({ patientId })
          })
        }

        if (status) {
          query.where('status', status)
        }
      })

    return schedule
  }
}
