import { db } from "@/db";
import { eq, and, or, ilike, inArray, asc } from "drizzle-orm";
import moment from "moment";
import { consultations } from "~/db/schema";
import { ConsultationProps } from "~/types/Consultation";

export const create = async (payload: ConsultationProps) => {
  try {
    return db
      .insert(consultations)
      .values({
        updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        consultationName: payload.consultationName!,
        value: String(payload.value!),
        valueAntecipation24: String(payload.valueAntecipation24!),
        valueAntecipation48: String(payload.valueAntecipation48!),
        valueAntecipation72: String(payload.valueAntecipation72!),
        valueCredit: String(payload.valueCredit!),
        valuePacket: String(payload.valuePacket!),
      })
      .returning({
        id: consultations.id,
        consultationName: consultations.consultationName!,
        value: consultations.value,
        valueAntecipation24: consultations.valueAntecipation24!,
        valueAntecipation48: consultations.valueAntecipation48!,
        valueAntecipation72: consultations.valueAntecipation72!,
        valueCredit: consultations.valueCredit!,
        valuePacket: consultations.valuePacket!,
      });
  } catch (error) {
    console.log("🚀 ~ error create:", error);
    throw createError({
      statusCode: 500,
      message: "Error to create",
    });
  }
};

export const update = async (payload: ConsultationProps) => {
  await exists(payload.id!);

  try {
    return await db
      .update(consultations)
      .set({
        updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        consultationName: payload.consultationName!,
        value: String(payload.value!),
        valueAntecipation24: String(payload.valueAntecipation24!),
        valueAntecipation48: String(payload.valueAntecipation48!),
        valueAntecipation72: String(payload.valueAntecipation72!),
        valueCredit: String(payload.valueCredit!),
        valuePacket: String(payload.valuePacket!),
      })
      .where(eq(consultations.id, payload.id!));
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
    await db.delete(consultations).where(eq(consultations.id, id));
  } catch (error) {
    console.log("🚀 ~ error remove:", error);
    throw createError({
      statusCode: 500,
      message: "Error to remove",
    });
  }
};

export const index = async (inputQuery: string) => {
  return db.query.consultations.findMany({
    columns: {
      id: true,
      consultationName: true,
      value: true,
      valueAntecipation24: true,
      valueAntecipation48: true,
      valueAntecipation72: true,
      valueCredit: true,
      valuePacket: true,
    },
    where: ilike(consultations.consultationName, `%${inputQuery}%`),
    orderBy: [asc(consultations.consultationName)],
  });
};

export const show = async (id: number) => {
  return exists(id);
};

const exists = async (id: number) => {
  const data = await db.query.consultations.findFirst({
    columns: {
      id: true,
      consultationName: true,
      value: true,
      valueAntecipation24: true,
      valueAntecipation48: true,
      valueAntecipation72: true,
      valueCredit: true,
      valuePacket: true,
    },
    where: eq(consultations.id, id),
  });

  if (!data) {
    throw createError({
      statusCode: 404,
      message: "Not found",
    });
  }

  return data;
};
