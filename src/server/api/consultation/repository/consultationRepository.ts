import prisma from "@/lib/prisma";

import { ConsultationProps } from "~/types/Consultation";

export const create = async (payload: ConsultationProps) => {
  try {
    return prisma.consultation.create({
      data: {
        consultationName: payload.consultationName!,
        value: payload.value!,
        valueAntecipation: payload.valueAntecipation!,
        valueCredit: payload.valueCredit!,
        valuePacket: payload.valuePacket!,
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
  await exists(payload.id!);

  try {
    return await prisma.consultation.update({
      data: {
        consultationName: payload.consultationName!,
        value: payload.value!,
        valueAntecipation: payload.valueAntecipation!,
        valueCredit: payload.valueCredit!,
        valuePacket: payload.valuePacket!,
      },
      where: {
        id: payload.id!,
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

export const destroy = async (id: number) => {
  await exists(id);

  try {
    await prisma.consultation.delete({
      where: {
        id,
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
      valueAntecipation: true,
      valueCredit: true,
      valuePacket: true,
    },
    where: {
      consultationName: { contains: inputQuery, mode: "insensitive" },
    },
    orderBy: {
      id: "asc",
    },
  });
};

export const show = async (id: number) => {
  return exists(id);
};

const exists = async (id: number) => {
  const data = await prisma.consultation.findFirst({
    where: {
      id,
    },
    select: {
      id: true,
      consultationName: true,
      value: true,
      valueAntecipation: true,
      valueCredit: true,
      valuePacket: true,
    },
  });

  if (!data) {
    throw createError({
      statusCode: 404,
      message: "Not found",
    });
  }
};
