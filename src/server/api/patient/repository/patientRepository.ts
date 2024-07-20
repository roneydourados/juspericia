import { prisma } from "@/server/providers/prisma";
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
  const exists = await prisma.patient.findFirst({
    where: {
      OR: [
        {
          cpf: cpf ? { equals: cpf } : undefined,
        },
        {
          rg: rg ? { equals: rg } : undefined,
        },
      ],
    },
  });

  if (exists) {
    throw createError({
      statusCode: 409,
      message: "Patient already exists",
    });
  }

  try {
    const patient = await prisma.patient.create({
      data: {
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
  await exists(id!);

  try {
    const patient = await prisma.patient.update({
      data: {
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
      },
      where: {
        id,
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
  await exists(id);

  try {
    await prisma.patient.delete({
      where: {
        id,
      },
    });
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
      User: {
        select: {
          name: true,
        },
      },
    },
    where: {
      OR: [
        {
          name: { contains: inputQuery, mode: "insensitive" },
        },
        {
          surname: { contains: inputQuery, mode: "insensitive" },
        },
        {
          cpf: { contains: inputQuery, mode: "insensitive" },
        },
        {
          phone: { contains: inputQuery, mode: "insensitive" },
        },
      ],
    },
    orderBy: {
      name: "asc",
    },
  });
};

export const show = async (id: number) => {
  return exists(id);
};

const exists = async (id: number) => {
  const patient = await prisma.patient.findFirst({
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
      surname: true,
      phone: true,
      rg: true,
      sexy: true,
      userId: true,
      User: {
        select: {
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

  const Address = await prisma.address.findFirst({
    where: {
      ownerId: patient?.id,
      addressCategory: addressCategoryType.patient,
    },
  });

  return {
    ...patient,
    Address,
  };
};
