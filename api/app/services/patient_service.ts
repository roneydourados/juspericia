import { prettyPrintError } from '@adonisjs/core'
import db from '@adonisjs/lucid/services/db'
import { Patient, Address, PatientConsultation } from '#models/index'
import { addressCategoryType } from '../utils/datatypes.js'

import { PatientProps } from '../dtos/index.js'

import { formatDate } from '../utils/functions.js'

export default class PatientService {
  //constructor(private solicitationConsultationService: SolicitationConsultationService) {}

  async create({
    birthDate,
    cpf,
    email,
    motherName,
    name,
    surname,
    phone,
    rg,
    userId,
    sexy,
    PatientAddress,
  }: PatientProps) {
    const exists = await Patient.query().where({ cpf }).first()

    if (exists) {
      throw new Error('Patient already exists cpf')
    }

    const trx = await db.transaction()
    try {
      const patient = await Patient.create(
        {
          birthDate,
          cpf,
          email,
          motherName,
          name,
          surname,
          phone,
          rg,
          userId,
          sexy,
        },
        { client: trx }
      )

      if (PatientAddress) {
        await Address.create(
          {
            addressCity: PatientAddress.addressCity,
            addressComplement: PatientAddress.addressComplement,
            addressDistrict: PatientAddress.addressDistrict,
            addressNumber: PatientAddress.addressNumber,
            addressState: PatientAddress.addressState,
            addressStreet: PatientAddress.addressStreet,
            addressZipcode: PatientAddress.addressZipcode,
            ownerId: patient.id,
            addressCategory: addressCategoryType.patient,
          },
          { client: trx }
        )
      }

      await trx.commit()

      return patient
    } catch (error) {
      await trx.rollback()
      console.error('Error creating patient:', error)
      throw error
    }
  }

  async update({
    birthDate,
    cpf,
    email,
    motherName,
    name,
    surname,
    phone,
    rg,
    userId,
    sexy,
    publicId,
    PatientAddress,
  }: PatientProps) {
    //verificcar se existe um paciente
    const patient = await Patient.query().where({ publicId }).firstOrFail()

    //verificar se o CPF passado existe em outro paciente que não seja o atualizado em questão
    if (cpf) {
      const exists = await Patient.query()
        .where((query) => {
          query.where('cpf', cpf).whereNot('id', patient.id)
        })
        .first()

      if (exists) {
        throw new Error('Patient already exists cpf')
      }
    }

    const trx = await db.transaction()
    try {
      patient.useTransaction(trx)

      patient.merge({
        birthDate,
        cpf,
        email,
        motherName,
        name,
        surname,
        phone,
        rg,
        userId,
        sexy,
      })

      await patient.save()

      if (PatientAddress) {
        const existsAddress = await Address.query().where('owner_id', patient.id).first()

        if (existsAddress) {
          existsAddress.useTransaction(trx)

          await existsAddress.delete()
        }

        await Address.create(
          {
            addressCity: PatientAddress.addressCity,
            addressComplement: PatientAddress.addressComplement,
            addressDistrict: PatientAddress.addressDistrict,
            addressNumber: PatientAddress.addressNumber,
            addressState: PatientAddress.addressState,
            addressStreet: PatientAddress.addressStreet,
            addressZipcode: PatientAddress.addressZipcode,
            ownerId: patient.id,
            addressCategory: addressCategoryType.patient,
          },
          { client: trx }
        )
      }

      await trx.commit()

      return patient
    } catch (error) {
      await trx.rollback()
      console.error('Error creating patient:', error)
      throw error
    }
  }

  async destroy(publicId: string) {
    const patient = await Patient.query().where('publicId', publicId).firstOrFail()

    const trx = await db.transaction()
    try {
      patient.useTransaction(trx)

      const address = await Address.query()
        .where({ ownerId: patient.id })
        .andWhere({ addressCategory: addressCategoryType.patient })
        .firstOrFail()

      address.useTransaction(trx)

      await address.delete()
      await patient.delete()

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      console.error('Error removing patient:', error)
      throw error
    }
  }

  async index(input: { inputQuery: string; userId?: number }) {
    const { inputQuery, userId } = input

    const patients = await Patient.query()
      .if(inputQuery, (q) => {
        q.whereILike('name', `%${inputQuery}%`)
          .orWhereILike('email', `%${inputQuery}%`)
          .orWhereILike('cpf', `%${inputQuery}%`)
          .orWhereILike('surname', `%${inputQuery}%`)
      })
      .where({ userId })
      .orderBy('name', 'asc')

    return patients.filter((patient) => patient.userId === userId)
  }

  async indexAdmin(input: { inputQuery: string }) {
    const { inputQuery } = input

    const patients = await Patient.query()
      .preload('User')
      .if(inputQuery, (q) => {
        q.whereILike('name', `%${inputQuery}%`)
          .orWhereILike('email', `%${inputQuery}%`)
          .orWhereILike('cpf', `%${inputQuery}%`)
          .orWhereILike('surname', `%${inputQuery}%`)
      })
      .orderBy('name', 'asc')

    return patients
  }

  async show(publicId: string) {
    const patient = await Patient.query()
      .preload('PatientAddress')
      .preload('files')
      .where({ publicId })
      .firstOrFail()

    return patient
  }

  async getsolicitationsPatient(patientId: number) {
    const data = await PatientConsultation.query()
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
      //.preload('Sales')
      .preload('PatientConsultationReport', (query) => {
        query.first()
        query.where('status', 'active')
      })
      .where({ patientId })

    return data.map((item) => {
      return {
        ...item,
        dateOpen: formatDate(new Date(item.dateOpen)),
        dateClose: item.dateClose ? formatDate(new Date(item.dateClose)) : null,
        dateAntecipation: item.dateAntecipation
          ? formatDate(new Date(item.dateAntecipation))
          : null,
        dateCorrection: item.dateCorrection ? formatDate(new Date(item.dateCorrection)) : null,
      }
    })
  }
}
