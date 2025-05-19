import db from '@adonisjs/lucid/services/db'
import { Patient, Address } from '#models/index'
import { addressCategoryType } from '../utils/datatypes.js'

import { PatientProps } from '../dtos/index.js'

export default class PatientService {
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
      await Address.query().delete().where('owner_id', patient.id).firstOrFail()
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

    const query = Patient.query()
      .if(inputQuery, (q) => {
        if (inputQuery) {
          q.where('name', 'ILIKE', `%${inputQuery}%`)
            .orWhere('email', 'ILIKE', `%${inputQuery}%`)
            .orWhere('cpf', 'ILIKE', `%${inputQuery}%`)
            .orWhere('surname', 'ILIKE', `%${inputQuery}%`)
        }
      })
      .if(userId, (q) => {
        if (userId) {
          q.where('user_id', userId)
        }
      })
      .orderBy('name', 'asc')

    return await query
  }

  async show(publicId: string) {
    const patient = await Patient.query().where('publicId', publicId).firstOrFail()
    const address = await Address.query()
      .where('owner_id', patient.id)
      .andWhere('addres_category', addressCategoryType.patient)
      .first()

    return {
      ...patient.serialize(),
      Address: address?.serialize(),
    }
  }
}
