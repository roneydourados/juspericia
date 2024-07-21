import { prisma } from "@/server/providers/prisma";

import { ReportModelProps } from "~/types/Patient";

export const create = async ({ title, content }: ReportModelProps) => {
  try {
    return prisma.reportModel.create({
      data: {
        title: String(title),
        content: content ?? "",
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

export const update = async ({ id, title, content }: ReportModelProps) => {
  await exists(id!);

  try {
    return await prisma.reportModel.update({
      data: {
        title: String(title),
        content: content ?? "",
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
    await prisma.reportModel.delete({
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
  return prisma.reportModel.findMany({
    select: {
      id: true,
      title: true,
    },
    where: {
      title: { contains: inputQuery, mode: "insensitive" },
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
  const data = await prisma.reportModel.findFirst({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      content: true,
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
