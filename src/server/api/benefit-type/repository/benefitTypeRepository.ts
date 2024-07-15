import { prisma } from "@/server/providers/prisma";

import { BenefitTypeProps } from "~/types/Patient";

export const create = async ({ name }: BenefitTypeProps) => {
  try {
    return prisma.benefitType.create({
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

export const update = async ({ id, name }: BenefitTypeProps) => {
  const existsItem = await exists(id!);

  if (!existsItem) {
    throw createError({
      statusCode: 404,
      message: "Not found",
    });
  }

  try {
    return await prisma.benefitType.update({
      data: {
        name: String(name),
      },
      where: {
        id: existsItem.id,
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
  const existsItem = await exists(id);

  if (!existsItem) {
    throw createError({
      statusCode: 404,
      message: "Not found",
    });
  }

  try {
    await prisma.benefitType.delete({
      where: {
        id: existsItem.id,
      },
    });

    return existsItem;
  } catch (error) {
    console.log("🚀 ~ error remove:", error);
    throw createError({
      statusCode: 500,
      message: "Error to remove",
    });
  }
};

export const index = async (inputQuery: string) => {
  return prisma.benefitType.findMany({
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
  return prisma.benefitType.findFirst({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
    },
  });
};
