import db from "@/db";
import { and, asc, eq, ilike, or } from "drizzle-orm";
import moment from "moment";
import { address, patients } from "~/db/schema";
import { addressCategoryType } from "~/server/utils/Constants";
import { PatientProps } from "~/types/Patient";

export const create = async ({
  birthDate,
  cpf,
  email,
  motherName,
  name,
  surname,
  phone,
  rg,
  userId,
  Address,
  sexy,
}: PatientProps) => {
  let addressData = undefined;
  const exists = await db.query.patients.findFirst({
    where: eq(patients.cpf, cpf!),
  });

  if (exists) {
    throw createError({
      statusCode: 409,
      message: "Patient already exists",
    });
  }

  try {
    const patient = await db
      .insert(patients)
      .values({
        sexy: String(sexy),
        userId: Number(userId),
        birthDate: String(birthDate!),
        cpf: String(cpf),
        rg: String(rg),
        email: email ? String(email) : undefined,
        name: String(name),
        status: "A",
        phone,
        motherName,
        surname: String(surname),
        updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      })
      .returning({
        id: patients.id,
        userId: patients.userId,
        name: patients.name,
        surname: patients.surname,
        cpf: patients.cpf,
        phone: patients.phone,
        email: patients.email,
        sexy: patients.sexy,
        birthDate: patients.birthDate,
        rg: patients.rg,
        motherName: patients.motherName,
        status: patients.status,
      });

    if (Address) {
      addressData = await db
        .insert(address)
        .values({
          addressCity: Address.addressCity,
          addressComplement: Address.addressComplement,
          addressDistrict: Address.addressDistrict,
          addressNumber: Address.addressNumber,
          addressState: Address.addressState,
          addressStreet: Address.addressStreet,
          addressZipcode: Address.addressZipcode,
          ownerId: patient[0].id,
          addressCategory: addressCategoryType.patient,
        })
        .returning({
          id: address.id,
          addressCity: address.addressCity,
          addressComplement: address.addressComplement,
          addressDistrict: address.addressDistrict,
          addressNumber: address.addressNumber,
          addressState: address.addressState,
          addressStreet: address.addressStreet,
          addressZipcode: address.addressZipcode,
          ownerId: address.ownerId,
          addressCategory: address.addressCategory,
        });
    }

    return {
      ...patient[0],
      Address: addressData ? addressData[0] : undefined,
    };
  } catch (error) {
    console.log("🚀 ~ error create patient:", error);
    throw createError({
      statusCode: 500,
      message: "Error to create patient",
    });
  }
};

export const update = async ({
  birthDate,
  cpf,
  email,
  motherName,
  name,
  phone,
  rg,
  Address,
  sexy,
  id,
  status,
  surname,
}: PatientProps) => {
  let addressData = undefined;
  await exists(id!);

  try {
    const patient = await db
      .update(patients)
      .set({
        sexy,
        birthDate: String(birthDate!),
        cpf: String(cpf),
        rg: String(rg),
        email: email ? String(email) : undefined,
        name: String(name),
        phone,
        motherName,
        status,
        surname: String(surname),
      })
      .where(eq(patients.id, id!))
      .returning({
        id: patients.id,
        userId: patients.userId,
        name: patients.name,
        surname: patients.surname,
        cpf: patients.cpf,
        phone: patients.phone,
        email: patients.email,
        sexy: patients.sexy,
        birthDate: patients.birthDate,
        rg: patients.rg,
        motherName: patients.motherName,
        status: patients.status,
      });

    if (Address) {
      await db
        .delete(address)
        .where(
          and(
            eq(address.ownerId, patient[0].id),
            eq(address.addressCategory, addressCategoryType.patient)
          )
        );

      addressData = await db
        .insert(address)
        .values({
          addressCity: Address.addressCity,
          addressComplement: Address.addressComplement,
          addressDistrict: Address.addressDistrict,
          addressNumber: Address.addressNumber,
          addressState: Address.addressState,
          addressStreet: Address.addressStreet,
          addressZipcode: Address.addressZipcode,
          ownerId: patient[0].id,
          addressCategory: addressCategoryType.patient,
        })
        .returning({
          id: address.id,
          addressCity: address.addressCity,
          addressComplement: address.addressComplement,
          addressDistrict: address.addressDistrict,
          addressNumber: address.addressNumber,
          addressState: address.addressState,
          addressStreet: address.addressStreet,
          addressZipcode: address.addressZipcode,
          ownerId: address.ownerId,
          addressCategory: address.addressCategory,
        });
    }

    return {
      ...patient[0],
      Address: addressData ? addressData[0] : undefined,
    };
  } catch (error) {
    console.log("🚀 ~ error update patient:", error);
    throw createError({
      statusCode: 500,
      message: "Error to update patient",
    });
  }
};

export const destroy = async (id: number) => {
  await exists(id);

  try {
    await db.delete(patients).where(eq(patients.id, id));
  } catch (error) {
    console.log("🚀 ~ error remove patient:", error);
    throw createError({
      statusCode: 500,
      message: "Error to remove patient",
    });
  }
};

export const index = async (input: { inputQuery: string; userId?: number }) => {
  const { inputQuery, userId } = input;
  return db.query.patients.findMany({
    columns: {
      id: true,
      name: true,
      surname: true,
      cpf: true,
      phone: true,
    },
    with: {
      User: {
        columns: {
          name: true,
        },
      },
    },
    where: and(
      or(
        ilike(patients.email, `%${inputQuery}%`),
        ilike(patients.name, `%${inputQuery}%`),
        ilike(patients.cpf, `%${inputQuery}%`)
      )
    ),
    orderBy: [asc(patients.name)],
  });
};

export const show = async (id: number) => {
  return exists(id);
};

const exists = async (id: number) => {
  const patient = await db.query.patients.findFirst({
    where: eq(patients.id, id),
    columns: {
      id: true,
      birthDate: true,
      cpf: true,
      email: true,
      motherName: true,
      name: true,
      surname: true,
      phone: true,
      rg: true,
      sexy: true,
      userId: true,
    },
    with: {
      User: {
        columns: {
          email: true,
          name: true,
        },
      },
    },
  });

  if (!patient) {
    throw createError({
      statusCode: 404,
      message: "Not found",
    });
  }

  const Address = await db.query.address.findFirst({
    where: and(
      eq(address.ownerId, patient.id),
      eq(address.addressCategory, addressCategoryType.patient)
    ),
  });

  return {
    ...patient,
    Address,
  };
};
