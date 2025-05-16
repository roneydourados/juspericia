import db from '@adonisjs/lucid/services/db'
import dayjs from 'dayjs'

interface AdminDashBoardSalesFilterProps {
  initialDate: string
  finalDate: string
  ufs?: string[]
}

export default class AdminSalesDashboardService {
  async index({ initialDate, finalDate, ufs }: AdminDashBoardSalesFilterProps) {
    const initialDateConvert = new Date(initialDate)
    const finalDateConvert = new Date(finalDate)

    const initialYearDate = new Date(dayjs().startOf('year').format('YYYY-MM-DD'))
    const finalYearDate = new Date(dayjs().endOf('year').format('YYYY-MM-DD'))

    const ufsFilter = ufs && ufs.length > 0 ? ufs : null

    const invoicingYearQuery = db
      .from('sales as s')
      .select(
        db.raw('sum(s.value) as total'),
        db.raw(`
          CASE extract(month from s.date_created)
            WHEN 1 THEN 'Jan'
            WHEN 2 THEN 'Fev'
            WHEN 3 THEN 'Mar'
            WHEN 4 THEN 'Abr'
            WHEN 5 THEN 'Mai'
            WHEN 6 THEN 'Jun'
            WHEN 7 THEN 'Jul'
            WHEN 8 THEN 'Ago'
            WHEN 9 THEN 'Set'
            WHEN 10 THEN 'Out'
            WHEN 11 THEN 'Nov'
            WHEN 12 THEN 'Dez'
          END as month
        `)
      )
      .leftJoin('users as u', 'u.id', 's.user_id')
      .leftJoin('address as a', function () {
        this.on('a.owner_id', '=', 'u.id').andOnVal('a.address_category', '=', 'USER')
      })
      .whereBetween('s.date_created', [initialYearDate, finalYearDate])
      .where('s.status', 'CONFIRMED')
      .groupByRaw('extract(month from s.date_created)')
      .orderByRaw('extract(month from s.date_created)')

    if (ufsFilter) {
      invoicingYearQuery.whereIn('a.address_state', ufsFilter)
    }

    const invoicingYear = await invoicingYearQuery

    const salesStatusQuery = db
      .from('sales as s')
      .select(
        db.raw('sum(s.value) as total'),
        db.raw(`
          CASE
            WHEN s.status = 'CONFIRMED' THEN 'Confimada'
            WHEN s.status = 'PENDING' THEN 'Pendente'
            WHEN s.status IN ('REFUNDED', 'CANCEL') THEN 'Cancelada'
          END as status
        `)
      )
      .leftJoin('users as u', 'u.id', 's.user_id')
      .leftJoin('address as a', function () {
        this.on('a.owner_id', '=', 'u.id').andOnVal('a.address_category', '=', 'USER')
      })
      .whereBetween('s.date_created', [initialDateConvert, finalDateConvert])
      .groupBy('s.status')

    if (ufsFilter) {
      salesStatusQuery.whereIn('a.address_state', ufsFilter)
    }

    const salesStatus = await salesStatusQuery

    const clientsNewQuery = db
      .from('users as u')
      .count('u.id as quantity')
      .join('profiles as p', 'p.id', 'u.profile_id')
      .leftJoin('address as a', function () {
        this.on('a.owner_id', '=', 'u.id').andOnVal('a.address_category', '=', 'USER')
      })
      .whereBetween(db.raw('cast(u.created_at as date)'), [initialDateConvert, finalDateConvert])
      .where('u.active', true)
      .where('p.type', 'ADVOGADO')

    if (ufsFilter) {
      clientsNewQuery.whereIn('a.address_state', ufsFilter)
    }

    const clientsNew = await clientsNewQuery

    const clientsTotalQuery = db
      .from('users as u')
      .count('u.id as quantity')
      .join('profiles as p', 'p.id', 'u.profile_id')
      .leftJoin('address as a', function () {
        this.on('a.owner_id', '=', 'u.id').andOnVal('a.address_category', '=', 'USER')
      })
      .where('u.active', true)
      .where('p.type', 'ADVOGADO')

    if (ufsFilter) {
      clientsTotalQuery.whereIn('a.address_state', ufsFilter)
    }

    const clientsTotal = await clientsTotalQuery

    const salesPaymentFormQuery = db
      .from('sales as s')
      .select(
        db.raw('sum(s.value) as total'),
        db.raw(`
          CASE
            WHEN s.billing_type = 'CREDIT_CARD' THEN 'Cartão de crédito'
            WHEN s.billing_type = 'DEBIT_CARD' THEN 'Cartão de débito'
            ELSE 'Outros'
          END as payment
        `)
      )
      .leftJoin('users as u', 'u.id', 's.user_id')
      .leftJoin('address as a', function () {
        this.on('a.owner_id', '=', 'u.id').andOnVal('a.address_category', '=', 'USER')
      })
      .whereBetween('s.date_created', [initialDateConvert, finalDateConvert])
      .where('s.status', 'CONFIRMED')
      .groupBy('s.billing_type')

    if (ufsFilter) {
      salesPaymentFormQuery.whereIn('a.address_state', ufsFilter)
    }

    const salesPaymentForm = await salesPaymentFormQuery

    const solicitationConsultationStatusQuery = db
      .from('patient_consultations as pc')
      .select(
        db.raw('cast(count(pc.id) as integer) as quantity'),
        db.raw(`
          CASE
            WHEN pc.status = 'finished' THEN 'Finalizada'
            WHEN pc.status = 'open' THEN 'Aberta'
            WHEN pc.status = 'paid' THEN 'Paga'
            WHEN pc.status = 'payment_pending' THEN 'Pendente Pagamento'
            WHEN pc.status = 'scheduled' THEN 'Agendada'
            WHEN pc.status = 'in_progress' THEN 'Em andamento'
            ELSE 'Outros'
          END as status
        `)
      )
      .leftJoin('users as u', 'u.id', 'pc.user_id')
      .leftJoin('address as a', function () {
        this.on('a.owner_id', '=', 'u.id').andOnVal('a.address_category', '=', 'USER')
      })
      .whereBetween('pc.date_open', [initialDateConvert, finalDateConvert])
      .groupBy('pc.status')

    if (ufsFilter) {
      solicitationConsultationStatusQuery.whereIn('a.address_state', ufsFilter)
    }

    const solicitationConsultationStatus = await solicitationConsultationStatusQuery

    const client40DaysSolicitation = await db.rawQuery(
      `SELECT count(u.id)::integer as quantity
       FROM users u
       LEFT JOIN address a ON a.owner_id = u.id AND a.address_category = 'USER'
       JOIN (
         SELECT user_id, MAX(date_open) AS last_consultation
         FROM patient_consultations
         WHERE date_open BETWEEN ? AND ?
         GROUP BY user_id
       ) pc ON u.id = pc.user_id
       WHERE pc.last_consultation <= NOW() - INTERVAL '40 days'
       ${ufsFilter ? `AND a.address_state IN (${ufsFilter.map(() => '?').join(',')})` : ''}`,
      [initialDateConvert, finalDateConvert, ...(ufsFilter ?? [])]
    )

    const credisToExpireQuery = db
      .from('user_credits as uc')
      .count('uc.id as quantity')
      .leftJoin('users as u', 'u.id', 'uc.user_id')
      .leftJoin('address as a', function () {
        this.on('a.owner_id', '=', 'u.id').andOnVal('a.address_category', '=', 'USER')
      })
      .whereBetween('uc.credit_date', [initialDateConvert, finalDateConvert])
      .where('uc.expire_date', '>', db.raw('now()'))
      .where('uc.salt', '>', 0)

    if (ufsFilter) {
      credisToExpireQuery.whereIn('a.address_state', ufsFilter)
    }

    const credisToExpire = await credisToExpireQuery

    const medicAtendimentHours = await db.rawQuery(
      `SELECT u.name as medic,
         sum(cast(s.atendiment_end as timestamp) - cast(s.atendiment_start as timestamp))::text as duration
       FROM schedules s
       JOIN users u ON u.id = s.medic_id
       LEFT JOIN address a ON a.owner_id = u.id AND a.address_category = 'USER'
       WHERE cast(s.schedule_date as date) BETWEEN ? AND ?
       ${ufsFilter ? `AND a.address_state IN (${ufsFilter.map(() => '?').join(',')})` : ''}
       GROUP BY u.name
       ORDER BY duration DESC`,
      [initialDateConvert, finalDateConvert, ...(ufsFilter ?? [])]
    )

    const medicRateQuery = db
      .from('patient_consultations as pc')
      .select('u.name as medic')
      .sum('pc.rate as rate')
      .join('users as u', 'u.id', 'pc.medic_id')
      .leftJoin('address as a', function () {
        this.on('a.owner_id', '=', 'u.id').andOnVal('a.address_category', '=', 'USER')
      })
      .whereBetween('pc.date_open', [initialDateConvert, finalDateConvert])
      .where('pc.rate', '>', 0)
      .groupBy('u.name')
      .orderBy('rate', 'desc')

    if (ufsFilter) {
      medicRateQuery.whereIn('a.address_state', ufsFilter)
    }

    const medicRate = await medicRateQuery

    const months = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ]

    return {
      totalPending: salesStatus.reduce(
        (acc: number, item: any) => (item.status === 'Pendente' ? acc + Number(item.total) : acc),
        0
      ),
      totalConfirmed: salesStatus.reduce(
        (acc: number, item: any) => (item.status === 'Confimada' ? acc + Number(item.total) : acc),
        0
      ),
      newClients: clientsNew[0]?.quantity ?? 0,
      totalClients: clientsTotal[0]?.quantity ?? 0,
      invoicingYear: months.map((month) => {
        const monthData = invoicingYear.find((entry) => entry.month === month)
        return {
          total: monthData ? Number(monthData.total) : 0,
          month,
        }
      }),
      salesStatus,
      salesPaymentForm,
      solicitationConsultationStatus,
      client40DaysSolicitation: client40DaysSolicitation.rows[0]?.quantity ?? 0,
      credisToExpire: credisToExpire[0]?.quantity ?? 0,
      medicAtendimentHours: medicAtendimentHours.rows,
      medicRate,
    }
  }
}
