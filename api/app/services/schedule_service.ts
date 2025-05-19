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
      /*
       EXEMPLO DE UPDATE OR CREATE
      await PatientConsultation.updateOrCreate(
        { id: payload.patientConsultationId }, // where (searchCriteria)
        { status: 'finished' }, // dados para atualizar/criar
        { client: trx } // transação
      )
      */

      await Schedule.updateOrCreate(
        {
          status: 'active',
          patientConsultationId: patientConsultationId,
        },
        {
          status: 'canceled',
        },
        { client: trx }
      )

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
        await PatientConsultation.updateOrCreate(
          { id: patientConsultationId },
          { status: 'scheduled', medicId: medicId },
          { client: trx }
        )
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
          await PatientConsultation.updateOrCreate(
            { id: patientConsultationId },
            { status: 'scheduled', medicId: medicId },
            { client: trx }
          )
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
          await PatientConsultation.updateOrCreate(
            { id: scheduleExists.patientConsultationId },
            { status: 'open' },
            { client: trx }
          )
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
}
