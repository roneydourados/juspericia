import db from "@/db";
import { eq, ilike } from "drizzle-orm";
import { reportPurposes } from "~/db/schema";
import { ReportPurposeProps } from "~/types/ReportPurpose";

export const create = async ({ name }: ReportPurposeProps) => {
  try {
    return db.insert(reportPurposes).values({
      name: String(name),
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
    return await db
      .update(reportPurposes)
      .set({
        name: String(name),
      })
      .where(eq(reportPurposes.id, id!));
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
    await db.delete(reportPurposes).where(eq(reportPurposes.id, id));
  } catch (error) {
    console.log("🚀 ~ error remove:", error);
    throw createError({
      statusCode: 500,
      message: "Error to remove",
    });
  }
};

export const index = async (inputQuery: string) => {
  return db.query.reportPurposes.findMany({
    columns: {
      id: true,
      name: true,
    },
    where: ilike(reportPurposes.name, `%${inputQuery}%`),
  });
};

export const show = async (id: number) => {
  return exists(id);
};

const exists = async (id: number) => {
  const data = await db.query.reportPurposes.findFirst({
    where: eq(reportPurposes.id, id),
    columns: {
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
