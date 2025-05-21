import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import { months } from '../utils/constantes.js'

export interface UserLawyerEstatisticsFilterProps {
  userId: number
  initialDate: string
  finalDate: string
}

export default class UserLawyerEstatisticService {
  async index({ userId, initialDate, finalDate }: UserLawyerEstatisticsFilterProps) {
    if (!userId || !initialDate || !finalDate) {
      throw new Error('Missing required parameters')
    }

    const start = DateTime.fromISO(initialDate).toSQLDate()
    const end = DateTime.fromISO(finalDate).toSQLDate()

    const laywerSolicitations = await db.rawQuery(
      `select
        count(pc.id)::int as quantity,
        to_char(pc.date_open, 'Mon') as month
      from patient_consultations pc
      where pc.user_id = ? and pc.date_open between ? and ?
      group by to_char(pc.date_open, 'Mon'), extract(month from pc.date_open)
      order by extract(month from pc.date_open)`,
      [userId, start, end]
    )

    const laywerPatientsRegistered = await db.rawQuery(
      `select
        count(p.id)::int as quantity,
        to_char(p.created_at, 'Mon') as month
      from patients p
      where p.user_id = ? and p.created_at::date between ? and ?
      group by to_char(p.created_at, 'Mon'), extract(month from p.created_at)
      order by extract(month from p.created_at)`,
      [userId, start, end]
    )

    const laywerInvestment = await db.rawQuery(
      `select
        sum(s.value)::numeric(18,2) as quantity,
        to_char(s.date_created, 'Mon') as month
      from sales s
      where s.user_id = ? and s.date_created between ? and ? and s.status = 'CONFIRMED'
      group by to_char(s.date_created, 'Mon'), extract(month from s.date_created)
      order by extract(month from s.date_created)`,
      [userId, start, end]
    )

    const laywerSolicitationsStatus = await db.rawQuery(
      `select
        count(pc.id)::int as quantity,
        case
          when pc.status = 'finished' then 'Concluídas'
          when pc.status = 'scheduled' then 'Agendadas'
          else 'Abertas'
        end as status
      from patient_consultations pc
      where pc.user_id = ?
        and pc.status in ('finished', 'open', 'scheduled')
        and pc.date_open between ? and ?
      group by pc.status`,
      [userId, start, end]
    )

    const laywerSolicitationsBenefitType = await db.rawQuery(
      `select
        count(pc.id)::int as quantity,
        bt.name as benefit_type
      from patient_consultations pc
      join benefit_types bt on bt.id = pc.benefit_type_id
      where pc.user_id = ? and pc.date_open between ? and ?
      group by bt.name`,
      [userId, start, end]
    )

    const laywerSolicitationsReportPropurse = await db.rawQuery(
      `select
        count(pc.id)::int as quantity,
        rp.name as report_purpose
      from patient_consultations pc
      join report_purposes rp on rp.id = pc.report_purpose_id
      where pc.user_id = ? and pc.date_open between ? and ?
      group by rp.name`,
      [userId, start, end]
    )

    const laywerSolicitationsTop10Finished = await db.rawQuery(
      `select
        pc.id,
        concat(p.name, ' ', p.surname) as patient,
        pc.date_open,
        pc.date_close,
        rp.name as report_purpose,
        bt.name as benefit_type,
        c.consultation_name
      from patient_consultations pc
      join patients p on p.id = pc.patient_id
      left join report_purposes rp on rp.id = pc.report_purpose_id
      left join benefit_types bt on bt.id = pc.benefit_type_id
      left join consultations c on c.id = pc.consultation_id
      where pc.user_id = ?
        and pc.date_open between ? and ?
        and pc.status = 'finished'
      order by pc.id desc
      limit 10`,
      [userId, start, end]
    )

    return {
      laywerSolicitations: months.map((month) => {
        const item = laywerSolicitations.rows.find((i: any) => i.month === month)
        return { quantity: item?.quantity ?? 0, month }
      }),
      laywerPatientsRegistered: months.map((month) => {
        const item = laywerPatientsRegistered.rows.find((i: any) => i.month === month)
        return { quantity: item?.quantity ?? 0, month }
      }),
      laywerInvestment: months.map((month) => {
        const item = laywerInvestment.rows.find((i: any) => i.month === month)
        return { quantity: item?.quantity ?? 0, month }
      }),
      laywerSolicitationsStatus: laywerSolicitationsStatus.rows,
      laywerSolicitationsBenefitType: laywerSolicitationsBenefitType.rows.map((i: any) => ({
        quantity: i.quantity,
        benefitType: i.benefit_type,
      })),
      laywerSolicitationsReportPropurse: laywerSolicitationsReportPropurse.rows.map((i: any) => ({
        quantity: i.quantity,
        reportPurpose: i.report_purpose,
      })),
      laywerSolicitationsTop10Finished: laywerSolicitationsTop10Finished.rows.map((i: any) => ({
        patient: i.patient,
        dateOpen: i.date_open,
        dateClose: i.date_close,
        reportPurpose: i.report_purpose,
        benefitType: i.benefit_type,
        consultationName: i.consultation_name,
      })),
    }
  }
}
