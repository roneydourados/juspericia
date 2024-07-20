import { prisma } from "@/server/providers/prisma";

import { ReportPurposeProps } from "~/types/Patient";

export const create = async ({ name }: ReportPurposeProps) => {
  try {
    return prisma.reportPurpose.create({
      data: {
        name: String(name),
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

export const update = async ({ id, name }: ReportPurposeProps) => {
  await exists(id!);

  try {
    return await prisma.reportPurpose.update({
      data: {
        name: String(name),
      },
      where: {
        id,
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
    await prisma.reportPurpose.delete({
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
  return prisma.reportPurpose.findMany({
    select: {
      id: true,
      name: true,
    },
    where: {
      name: { contains: inputQuery, mode: "insensitive" },
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
  const data = await prisma.reportPurpose.findFirst({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!data) {
    throw createError({
      statusCode: 404,
      message: "Not found",
    });
  }
};
