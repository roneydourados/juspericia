import { uuidv7 } from "uuidv7";
import prisma from "@/lib/prisma";

import { BenefitTypeProps } from "~/types/BenefitType";

export const create = async ({ name }: BenefitTypeProps) => {
  try {
    return prisma.benefitType.create({
      data: {
        name: String(name),
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

export const update = async ({ name, publicId }: BenefitTypeProps) => {
  await exists(publicId!);

  try {
    return await prisma.benefitType.update({
      data: {
        name: String(name),
      },
      where: {
        publicId,
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
    await prisma.benefitType.delete({
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
  return prisma.benefitType.findMany({
    select: {
      id: true,
      name: true,
      publicId: true,
    },
    where: {
      name: { contains: inputQuery, mode: "insensitive" },
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
  const data = await prisma.benefitType.findFirst({
    where: {
      publicId: id,
    },
    select: {
      id: true,
      name: true,
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
