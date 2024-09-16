import { db } from "@/db";
import { eq, ilike, asc } from "drizzle-orm";
import { benefitTypes } from "~/db/schema";
import { BenefitTypeProps } from "~/types/BenefitType";

export const create = async ({ name }: BenefitTypeProps) => {
  try {
    return db.insert(benefitTypes).values({
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

export const update = async ({ id, name }: BenefitTypeProps) => {
  await exists(id!);

  try {
    return db
      .update(benefitTypes)
      .set({
        name: String(name),
      })
      .where(eq(benefitTypes.id, id!));
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
    await db.delete(benefitTypes).where(eq(benefitTypes.id, id));
  } catch (error) {
    console.log("🚀 ~ error remove:", error);
    throw createError({
      statusCode: 500,
      message: "Error to remove",
    });
  }
};

export const index = async (inputQuery: string) => {
  return db.query.benefitTypes.findMany({
    columns: {
      id: true,
      name: true,
    },
    where: ilike(benefitTypes.name, `%${inputQuery}%`),
    orderBy: [asc(benefitTypes.name)],
  });
};

export const show = async (id: number) => {
  return exists(id);
};

const exists = async (id: number) => {
  const data = await db.query.benefitTypes.findFirst({
    where: eq(benefitTypes.id, id),
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

  return data;
};
