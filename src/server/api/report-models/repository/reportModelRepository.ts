import db from "@/db";
import { asc, eq, ilike } from "drizzle-orm";
import { reportModels } from "~/db/schema";

import { ReportModelProps } from "~/types/Patient";

export const create = async ({ title, content }: ReportModelProps) => {
  try {
    return db.insert(reportModels).values({
      title: String(title),
      content: content ?? "",
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
    return await db
      .update(reportModels)
      .set({
        title: String(title),
        content: content ?? "",
      })
      .where(eq(reportModels.id, id!));
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
    await db.delete(reportModels).where(eq(reportModels.id, id));
  } catch (error) {
    console.log("🚀 ~ error remove:", error);
    throw createError({
      statusCode: 500,
      message: "Error to remove",
    });
  }
};

export const index = async (inputQuery: string) => {
  return db.query.reportModels.findMany({
    columns: {
      id: true,
      title: true,
    },
    where: ilike(reportModels.title, `%${inputQuery}%`),
    orderBy: [asc(reportModels.id)],
  });
};

export const show = async (id: number) => {
  return exists(id);
};

const exists = async (id: number) => {
  const data = await db.query.reportModels.findFirst({
    where: eq(reportModels.id, id),
    columns: {
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
