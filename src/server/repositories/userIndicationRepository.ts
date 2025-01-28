import prisma from "@/lib/prisma";
import { uuidv7 } from "uuidv7";
import { UserIndicationProps } from "~/types/UserIndication";

export const index = async (input: {
  initialDate: string;
  finalDate: string;
  userId: number;
  status?: string;
}) => {
  const { initialDate, finalDate, status, userId } = input;
  try {
    return prisma.userIndication.findMany({
      where: {
        userId: userId,
        status: status,
        createdAt: {
          gte: new Date(initialDate),
          lte: new Date(finalDate),
        },
      },
    });
  } catch (error) {
    console.log("🚀 ~ error index Address:", error);
    throw createError({
      statusCode: 500,
      message: "Error to list user indication",
    });
  }
};

export const create = async (payload: UserIndicationProps) => {
  try {
    return prisma.userIndication.create({
      data: {
        name: payload.name!,
        email: payload.email!,
        whatsapp: payload.whatsapp!,
        status: payload.status!,
        points: payload.points!,
        userId: payload.userId!,
        publicId: uuidv7(),
      },
    });
  } catch (error) {
    console.log("🚀 ~ error create Address:", error);
    throw createError({
      statusCode: 500,
      message: "Error to create user indication",
    });
  }
};

export const update = async (payload: UserIndicationProps) => {
  try {
    const exists = await prisma.userIndication.findFirst({
      where: {
        publicId: payload.publicId!,
      },
    });

    if (!exists) {
      throw createError({
        statusCode: 404,
        message: "User indication not found",
      });
    }

    return prisma.userIndication.update({
      where: {
        id: exists.id,
      },
      data: {
        name: payload.name,
        email: payload.email,
        whatsapp: payload.whatsapp,
        status: payload.status,
        points: payload.points,
      },
    });
  } catch (error) {
    console.log("🚀 ~ Error to update user indication:", error);
    throw createError({
      statusCode: 500,
      message: "Error to update user indication",
    });
  }
};

export const destroy = async (publicId: string) => {
  try {
    const exists = await prisma.userIndication.findFirst({
      where: {
        publicId: publicId,
      },
    });

    if (!exists) {
      throw createError({
        statusCode: 404,
        message: "User indication not found",
      });
    }

    await prisma.userIndication.delete({
      where: {
        id: exists.id,
      },
    });
  } catch (error) {
    console.log("🚀 ~ error delete user indication:", error);
    throw createError({
      statusCode: 500,
      message: "Error to delete user indication",
    });
  }
};

export const show = async (publicId: string) => {
  try {
    const exists = await prisma.userIndication.findFirst({
      where: {
        publicId: publicId,
      },
    });

    if (!exists) {
      throw createError({
        statusCode: 404,
        message: "User indication not found",
      });
    }

    return exists;
  } catch (error) {
    console.log("🚀 ~ error delete user indication:", error);
    throw createError({
      statusCode: 500,
      message: "Error to delete user indication",
    });
  }
};
