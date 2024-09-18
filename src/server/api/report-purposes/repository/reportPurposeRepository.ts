import prisma from "@/lib/prisma";
import { uuidv7 } from "uuidv7";
import { ReportPurposeProps } from "~/types/ReportPurpose";

export const create = async ({ name }: ReportPurposeProps) => {
  try {
    return prisma.reportPurpose.create({
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

export const update = async ({ id, name, publicId }: ReportPurposeProps) => {
  await exists(publicId!);

  try {
    return await prisma.reportPurpose.update({
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
    await prisma.reportPurpose.delete({
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
  return prisma.reportPurpose.findMany({
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
  const data = await prisma.reportPurpose.findFirst({
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
