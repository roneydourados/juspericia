import { AddressProps } from "@/types/Address";
import { db } from "@/db";
import { address } from "@/db/schema";
import { eq } from "drizzle-orm";

export const create = async (payload: AddressProps) => {
  try {
    const data = await db
      .insert(address)
      .values({
        addressZipcode: payload.addressZipcode,
        addressCategory: payload.addressCategory!,
        ownerId: payload.ownerId!,
        addressCity: payload.addressCity,
        addressComplement: payload.addressComplement,
        addressDistrict: payload.addressDistrict,
        addressNumber: payload.addressNumber,
        addressState: payload.addressState,
        addressStreet: payload.addressStreet,
      })
      .returning();

    return data[0];
  } catch (error) {
    console.log("🚀 ~ error create Address:", error);
    throw createError({
      statusCode: 500,
      message: "Error to create address",
    });
  }
};

export const update = async (payload: AddressProps) => {
  await exists(payload.id!);

  try {
    const data = await db
      .update(address)
      .set({
        addressZipcode: payload.addressZipcode,
        addressCategory: payload.addressCategory!,
        ownerId: payload.ownerId!,
        addressCity: payload.addressCity,
        addressComplement: payload.addressComplement,
        addressDistrict: payload.addressDistrict,
        addressNumber: payload.addressNumber,
        addressState: payload.addressState,
        addressStreet: payload.addressStreet,
      })
      .where(eq(address.id, payload.id!))
      .returning();

    return data[0];
  } catch (error) {
    console.log("🚀 ~ error update Address:", error);
    throw createError({
      statusCode: 500,
      message: "Error to update address",
    });
  }
};

export const destroy = async (id: number) => {
  await exists(id);

  try {
    await db.delete(address).where(eq(address.id, id));
  } catch (error) {
    console.log("🚀 ~ error remove Address:", error);
    throw createError({
      statusCode: 500,
      message: "Error to remove address",
    });
  }
};

export const show = async (id: number) => {
  return exists(id);
};

const exists = async (id: number) => {
  const data = await db.select().from(address).where(eq(address.id, id));

  if (!data[0]) {
    throw createError({
      statusCode: 404,
      message: "Address not found",
    });
  }

  return data[0];
};
