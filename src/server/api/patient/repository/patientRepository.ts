import prisma from "@/lib/prisma";
import { addressCategoryType } from "~/server/utils/Constants";
import { PatientProps } from "~/types/Patient";
import { uuidv7 } from "uuidv7";

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
        publicId: uuidv7(),
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
          publicId: uuidv7(),
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
  publicId,
  userId,
}: PatientProps) => {
  console.log("🚀 ~ userId:", userId);
  await exists(publicId!);

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
        userId,
      },
      where: {
        id,
      },
    });

    if (Address) {
      await prisma.address.deleteMany({
        where: {
          ownerId: patient.id,
          addressCategory: addressCategoryType.patient,
        },
      });

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
          publicId: uuidv7(),
        },
      });
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

export const destroy = async (id: string) => {
  await exists(id);

  try {
    await prisma.patient.delete({
      where: {
        publicId: id,
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

export const index = async (input: { inputQuery: string; userId?: number }) => {
  const { inputQuery, userId } = input;
  return prisma.patient.findMany({
    take: 50,
    select: {
      id: true,
      publicId: true,
      name: true,
      surname: true,
      cpf: true,
      phone: true,
      User: {
        select: {
          name: true,
        },
      },
    },
    where: {
      userId,
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

export const show = async (id: string) => {
  return exists(id);
};

const exists = async (id: string) => {
  const patient = await prisma.patient.findFirst({
    where: {
      publicId: id,
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
      publicId: true,
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
