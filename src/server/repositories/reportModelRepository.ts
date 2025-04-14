import { prisma } from "@/prisma/db";
import { uuidv7 } from "uuidv7";

import { ReportModelProps } from "@/types/Patient";

export const create = async ({ title, content }: ReportModelProps) => {
  try {
    return prisma.reportModel.create({
      data: {
        title: String(title),
        content: content ?? "",
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

export const update = async ({
  id,
  title,
  content,
  publicId,
}: ReportModelProps) => {
  await exists(publicId!);

  try {
    return await prisma.reportModel.update({
      data: {
        title: String(title),
        content: content ?? "",
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
    await prisma.reportModel.delete({
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
  return prisma.reportModel.findMany({
    select: {
      id: true,
      title: true,
      publicId: true,
    },
    where: {
      title: { contains: inputQuery, mode: "insensitive" },
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
  const data = await prisma.reportModel.findFirst({
    where: {
      publicId: id,
    },
    select: {
      id: true,
      title: true,
      content: true,
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
