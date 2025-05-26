import db from '@adonisjs/lucid/services/db'
import { months } from '../utils/constantes.js'

import { User, Profile, Address } from '#models/index'
import { UserProps } from '../dtos/index.js'

import dayjs from 'dayjs'
import { addressCategoryType } from '../utils/datatypes.js'

export interface UserLawyerEstatisticsFilterProps {
  userId: number
  initialDate: string
  finalDate: string
}

export default class UserLaywerService {
  async create({
    email,
    name,
    password,
    cpfCnpj,
    phone,
    oab,
    oabUf,
    officeCnpj,
    officeEmail,
    officeName,
    officePhone,
    whatsapp,
    UserAddress,
  }: UserProps) {
    const trx = await db.transaction()
    try {
      await this.validations({ email, name })

      const profile = await Profile.query().where({ name: 'ADVOGADO' }).firstOrFail()

      const user = await User.create(
        {
          email,
          name,
          password,
          cpfCnpj,
          phone,
          profileId: profile.id,
          oab,
          oabUf,
          officeName,
          officeCnpj,
          officeEmail,
          officePhone,
          whatsapp,
        },
        {
          client: trx,
        }
      )

      if (UserAddress) {
        await Address.create(
          {
            addressCity: UserAddress.addressCity,
            addressComplement: UserAddress.addressComplement,
            addressDistrict: UserAddress.addressDistrict,
            addressNumber: UserAddress.addressNumber,
            addressState: UserAddress.addressState,
            addressStreet: UserAddress.addressStreet,
            addressZipcode: UserAddress.addressZipcode,
            ownerId: user.id,
            addressCategory: addressCategoryType.user,
          },
          { client: trx }
        )
      }

      await trx.commit()

      return user
    } catch (error) {
      await trx.rollback()
      console.error('Error creating user admin:', error)
      throw error
    }
  }

  async update({
    email,
    name,
    password,
    cpfCnpj,
    phone,
    oab,
    oabUf,
    officeCnpj,
    officeEmail,
    officeName,
    officePhone,
    whatsapp,
    active,
    publicId,
    UserAddress,
  }: UserProps) {
    const trx = await db.transaction()
    try {
      const user = await User.query().where({ publicId }).firstOrFail()

      user.useTransaction(trx)

      user.merge({
        email,
        name,
        password,
        cpfCnpj,
        phone,
        oab,
        oabUf,
        officeCnpj,
        officeEmail,
        officeName,
        officePhone,
        whatsapp,
        active,
      })

      await user.save()
      console.log('🚀 ~ UserLaywerService ~ UserAddress:', UserAddress)
      if (UserAddress) {
        const existsAddress = await Address.query()
          .where({ ownerId: user.id })
          .where({ addressCategory: addressCategoryType.user })
          .first()

        if (existsAddress) {
          existsAddress.useTransaction(trx)

          await existsAddress.delete()
        }

        await Address.create(
          {
            addressCity: UserAddress.addressCity,
            addressComplement: UserAddress.addressComplement,
            addressDistrict: UserAddress.addressDistrict,
            addressNumber: UserAddress.addressNumber,
            addressState: UserAddress.addressState,
            addressStreet: UserAddress.addressStreet,
            addressZipcode: UserAddress.addressZipcode,
            ownerId: user.id,
            addressCategory: addressCategoryType.user,
          },
          { client: trx }
        )
      }

      await trx.commit()
      return user
    } catch (error) {
      await trx.rollback()
      console.error('Error creating user admin:', error)
      throw error
    }
  }

  async destroy(publicId: string) {
    try {
      const adminUser = await User.query().where({ publicId }).firstOrFail()

      await adminUser.delete()
    } catch (error) {
      console.error('Error deleting user admin:', error)
      throw error
    }
  }

  async index(inputQuery: string) {
    try {
      const adminUsers = await User.query()
        .preload('profile')
        .if(inputQuery, (query) => {
          query
            .where('name', 'ILIKE', `%${inputQuery}%`)
            .orWhere('email', 'ILIKE', `%${inputQuery}%`)
        })
        .whereHas('profile', (query) => {
          query.where('type', 'ADVOGADO')
        })
        .orderBy('name', 'asc')

      return adminUsers.filter((user) => user.profile?.type === 'ADVOGADO')
    } catch (error) {
      console.error('Error fetching user admin:', error)
      throw error
    }
  }

  async show(publicId: string) {
    try {
      const user = await User.query().preload('UserAddress').where({ publicId }).firstOrFail()

      return user
    } catch (error) {
      console.error('Error fetching user admin:', error)
      throw error
    }
  }

  async validations({ email, name }: UserProps) {
    const adminUsers = await User.query()
      .orWhere('email', 'email')
      .andWhereHas('profile', (query) => {
        query.where('type', 'ADVOGADO')
      })
      .first()

    if (adminUsers) {
      throw new Error('Email already exists')
    }

    if (!name) {
      throw new Error('Name is required')
    }

    if (!email) {
      throw new Error('Email is required')
    }
  }

  async estatistics({ userId, initialDate, finalDate }: UserLawyerEstatisticsFilterProps) {
    if (!userId || !initialDate || !finalDate) {
      throw new Error('Missing required parameters')
    }

    const start = dayjs(initialDate).format('YYYY-MM-DD')
    const end = dayjs(finalDate).format('YYYY-MM-DD')

    const laywerSolicitations = await db.rawQuery(
      `select
        count(pc.id)::int as quantity,
        case extract(month from pc.date_open)
          when 1 then 'Jan'
          when 2 then 'Fev'
          when 3 then 'Mar'
          when 4 then 'Abr'
          when 5 then 'Mai'
          when 6 then 'Jun'
          when 7 then 'Jul'
          when 8 then 'Ago'
          when 9 then 'Set'
          when 10 then 'Out'
          when 11 then 'Nov'
          when 12 then 'Dez'
        end as month
      from patient_consultations pc
      where pc.user_id = ? and pc.date_open between ? and ?
      group by to_char(pc.date_open, 'Mon'), extract(month from pc.date_open)
      order by extract(month from pc.date_open)`,
      [userId, start, end]
    )

    const laywerPatientsRegistered = await db.rawQuery(
      `select
        count(p.id)::int as quantity,
        case extract(month from p.created_at)
          when 1 then 'Jan'
          when 2 then 'Fev'
          when 3 then 'Mar'
          when 4 then 'Abr'
          when 5 then 'Mai'
          when 6 then 'Jun'
          when 7 then 'Jul'
          when 8 then 'Ago'
          when 9 then 'Set'
          when 10 then 'Out'
          when 11 then 'Nov'
          when 12 then 'Dez'
        end as month
      from patients p
      where p.user_id = ? and p.created_at::date between ? and ?
      group by to_char(p.created_at, 'Mon'), extract(month from p.created_at)
      order by extract(month from p.created_at)`,
      [userId, start, end]
    )

    const laywerInvestment = await db.rawQuery(
      `select
        sum(s.value)::numeric(18,2) as quantity,
        case extract(month from s.date_created)
          when 1 then 'Jan'
          when 2 then 'Fev'
          when 3 then 'Mar'
          when 4 then 'Abr'
          when 5 then 'Mai'
          when 6 then 'Jun'
          when 7 then 'Jul'
          when 8 then 'Ago'
          when 9 then 'Set'
          when 10 then 'Out'
          when 11 then 'Nov'
          when 12 then 'Dez'
        end as month
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
