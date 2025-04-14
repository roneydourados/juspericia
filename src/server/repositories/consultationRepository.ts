import { prisma } from "@/prisma/db";
import { uuidv7 } from "uuidv7";

import { ConsultationProps } from "@/types/Consultation";

export const create = async (payload: ConsultationProps) => {
  try {
    return prisma.consultation.create({
      data: {
        consultationName: payload.consultationName!,
        value: payload.value!,
        valueAntecipation24: payload.valueAntecipation24!,
        valueAntecipation48: payload.valueAntecipation48!,
        valueAntecipation72: payload.valueAntecipation72!,
        valueCredit: payload.valueCredit!,
        valuePacket: payload.valuePacket!,
        publicId: uuidv7(),
      },
    });
  } catch (error) {
    console.log("🚀 ~ error create:", error);
    throw createError({
      statusCode: 500,
      message: "Error to create",
    });
  }
};

export const update = async (payload: ConsultationProps) => {
  await exists(payload.publicId!);

  try {
    return await prisma.consultation.update({
      data: {
        consultationName: payload.consultationName!,
        value: payload.value!,
        valueAntecipation24: payload.valueAntecipation24!,
        valueAntecipation48: payload.valueAntecipation48!,
        valueAntecipation72: payload.valueAntecipation72!,
        valueCredit: payload.valueCredit!,
        valuePacket: payload.valuePacket!,
      },
      where: {
        publicId: payload.publicId!,
      },
    });
  } catch (error) {
    console.log("🚀 ~ error update:", error);
    throw createError({
      statusCode: 500,
      message: "Error to update",
    });
  }
};

export const destroy = async (id: string) => {
  await exists(id);

  try {
    await prisma.consultation.delete({
      where: {
        publicId: id,
      },
    });
  } catch (error) {
    console.log("🚀 ~ error remove:", error);
    throw createError({
      statusCode: 500,
      message: "Error to remove",
    });
  }
};

export const index = async (inputQuery: string) => {
  return prisma.consultation.findMany({
    select: {
      id: true,
      consultationName: true,
      value: true,
      valueAntecipation24: true,
      valueAntecipation48: true,
      valueAntecipation72: true,
      valueCredit: true,
      valuePacket: true,
      publicId: true,
    },
    where: {
      consultationName: { contains: inputQuery, mode: "insensitive" },
    },
    orderBy: {
      id: "asc",
    },
  });
};

export const show = async (id: string) => {
  return exists(id);
};

const exists = async (id: string) => {
  const data = await prisma.consultation.findFirst({
    where: {
      publicId: id,
    },
    select: {
      id: true,
      consultationName: true,
      value: true,
      valueAntecipation24: true,
      valueAntecipation48: true,
      valueAntecipation72: true,
      valueCredit: true,
      valuePacket: true,
      publicId: true,
    },
  });

  if (!data) {
    throw createError({
      statusCode: 404,
      message: "Not found",
    });
  }

  return data;
};
