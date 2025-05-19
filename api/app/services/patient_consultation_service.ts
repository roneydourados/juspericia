import db from '@adonisjs/lucid/services/db'
import { PatientConsultationReport, File, PatientConsultation } from '#models/index'

import { formatDate } from '../utils/functions.js'

import { PatientConsultationReportProps } from '../dtos/index.js'

export default class PatientConsultationService {
  async index(input: {
    initialDate: string
    finalDate: string
    userId?: number
    medicId?: number
    patientId?: number
  }) {
    const { finalDate, initialDate, userId, medicId, patientId } = input

    const reports = await PatientConsultationReport.query()
      .where('userId', medicId ?? 0)
      .whereBetween('reportDate', [initialDate, finalDate])
      .whereNot('status', 'deleted')
      .whereHas('PatientConsultation', (query) => {
        query
          .if(userId, (q) => {
            if (userId) {
              q.where('userId', userId)
            }
          })
          .if(patientId, (q) => {
            if (patientId) {
              q.where('patientId', patientId)
            }
          })
      })
      .preload('Medic')
      .preload('PatientConsultation', (query) => {
        query.preload('Patient')
      })

    const result = await Promise.all(
      reports.map(async (report) => {
        const attachments = await File.query()
          .where('owner_id', report.id)
          .andWhere('file_category', 'medical-report')

        return {
          ...report.serialize(), // serializa os relacionamentos automaticamente
          reportDate: formatDate(new Date(report.reportDate)),
          PatientConsultation: {
            ...report.PatientConsultation?.serialize(),
            dateOpen: formatDate(new Date(report.PatientConsultation?.dateOpen)),
            dateClose: report.PatientConsultation?.dateClose
              ? formatDate(new Date(report.PatientConsultation.dateClose))
              : null,
          },
          attachments,
        }
      })
    )

    return result
  }

  async create(payload: PatientConsultationReportProps) {
    const trx = await db.transaction()
    try {
      //verificar se existe um laudo já
      const exists = await PatientConsultationReport.query()
        .where('status', 'active')
        .where('patientConsultationId', payload.patientConsultationId!)
        .first()

      if (exists) {
        exists.useTransaction(trx)
        exists.merge({ status: 'deleted', userDeleted: payload.userDeleted })
        await exists.save()
      }

      //verificar se existe uma consulta
      const consultation = await PatientConsultation.find(payload.patientConsultationId)
      if (consultation) {
        consultation.useTransaction(trx)
        consultation.merge({ status: 'finished' })
        await consultation.save()
      }

      const report = await PatientConsultationReport.create(payload, { client: trx })

      await trx.commit()

      return report
    } catch (error) {
      await trx.rollback()
      console.error('Error creating report:', error)
      throw error
    }
  }

  async show(publicId: string) {
    const report = await PatientConsultationReport.query()
      .where('publicId', publicId)
      .preload('Medic')
      .preload('PatientConsultation', (query) => {
        query.preload('Patient')
      })
      .firstOrFail()

    const attachments = await File.query()
      .where('owner_id', report.id)
      .andWhere('file_category', 'medical-report')

    return {
      ...report.serialize(),
      reportDate: formatDate(new Date(report.reportDate)),
      PatientConsultation: {
        ...report.PatientConsultation?.serialize(),
        dateOpen: formatDate(new Date(report.PatientConsultation?.dateOpen)),
        dateClose: report.PatientConsultation?.dateClose
          ? formatDate(new Date(report.PatientConsultation.dateClose))
          : null,
      },
      attachments,
    }
  }
}
