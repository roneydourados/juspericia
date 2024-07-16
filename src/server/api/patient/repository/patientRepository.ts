import { prisma } from "@/server/providers/prisma";
import { addressCategoryType } from "~/server/utils/Constants";
import { PatientProps } from "~/types/Patient";

export const create = async ({
  benefitTypeId,
  birthDate,
  cpf,
  email,
  motherName,
  name,
  phone,
  proccessNumber,
  reportPurposeId,
  rg,
  userId,
  Address,
  sexy,
}: PatientProps) => {
  try {
    const patient = await prisma.patient.create({
      data: {
        sexy: String(sexy),
        benefitTypeId: Number(benefitTypeId),
        reportPurposeId: Number(reportPurposeId),
        userId: Number(userId),
        birthDate: new Date(birthDate!),
        cpf: String(cpf),
        rg: String(rg),
        email: email ? String(email) : undefined,
        name: String(name),
        status: "A",
        phone,
        motherName,
        proccessNumber,
      },
    });

    if (Address) {
      await prisma.address.create({
        data: {
          addressCity: Address.addressCity,
          addressComplement: Address.addressComplement,
          addressDistrict: Address.addressDistrict,
          addressNumber: Address.addressNumber,
          addressState: Address.addressState,
          addressStreet: Address.addressStreet,
          addressZipcode: Address.addressZipcode,
          ownerId: patient.id,
          addressCategory: addressCategoryType.patient,
        },
      });
    }

    return {
      ...patient,
      Address,
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
  benefitTypeId,
  birthDate,
  cpf,
  email,
  motherName,
  name,
  phone,
  proccessNumber,
  reportPurposeId,
  rg,
  userId,
  Address,
  sexy,
  id,
  status,
}: PatientProps) => {
  const existsPatient = await exists(id!);

  if (!existsPatient) {
    throw createError({
      statusCode: 404,
      message: "Patient not found",
    });
  }

  try {
    const patient = await prisma.patient.update({
      data: {
        sexy,
        benefitTypeId: Number(benefitTypeId),
        reportPurposeId: Number(reportPurposeId),
        userId: Number(userId),
        birthDate: new Date(birthDate!),
        cpf: String(cpf),
        rg: String(rg),
        email: email ? String(email) : undefined,
        name: String(name),
        phone,
        motherName,
        proccessNumber,
        status,
      },
      where: {
        id: existsPatient.id,
      },
    });

    if (Address) {
      const existsAddress = await prisma.address.findFirst({
        where: {
          ownerId: patient.id,
          addressCategory: addressCategoryType.patient,
        },
      });

      if (existsAddress) {
        await prisma.address.update({
          where: {
            id: existsAddress?.id,
          },
          data: {
            addressCategory: Address.addressCategoryType,
            addressCity: Address.addressCity,
            addressComplement: Address.addressComplement,
            addressDistrict: Address.addressDistrict,
            addressNumber: Address.addressNumber,
            addressState: Address.addressState,
            addressStreet: Address.addressStreet,
            addressZipcode: Address.addressZipcode,
          },
        });
      }
    }

    return {
      ...patient,
      Address,
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
  const existsPatient = await exists(id);

  if (!existsPatient) {
    throw createError({
      statusCode: 404,
      message: "Patient not found",
    });
  }

  try {
    await prisma.patient.delete({
      where: {
        id: existsPatient.id,
      },
    });

    return existsPatient;
  } catch (error) {
    console.log("🚀 ~ error remove patient:", error);
    throw createError({
      statusCode: 500,
      message: "Error to remove patient",
    });
  }
};

export const index = async (inputQuery: string) => {
  return prisma.patient.findMany({
    select: {
      id: true,
      name: true,
      cpf: true,
      phone: true,
    },
    where: {
      OR: [
        {
          name: { contains: inputQuery, mode: "insensitive" },
        },
        {
          cpf: { contains: inputQuery, mode: "insensitive" },
        },
        {
          phone: { contains: inputQuery, mode: "insensitive" },
        },
      ],
    },
  });
};

export const show = async (id: number) => {
  return exists(id);
};

const exists = async (id: number) => {
  return prisma.patient.findFirst({
    where: {
      id,
    },
    select: {
      id: true,
      birthDate: true,
      cpf: true,
      email: true,
      motherName: true,
      name: true,
      phone: true,
      proccessNumber: true,
      rg: true,
      sexy: true,
      userId: true,
      benefitTypeId: true,
      reportPurposeId: true,
      BenefitType: true,
      ReportPurpose: true,
      User: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  });
};
