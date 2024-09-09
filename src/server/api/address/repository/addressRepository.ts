import { AddressProps } from "@/types/Address";
import prisma from "@/lib/prisma";

export const create = async (payload: AddressProps) => {
  try {
    return prisma.address.create({
      data: {
        addressZipcode: payload.addressZipcode,
        addressCategory: payload.addressCategory!,
        ownerId: payload.ownerId!,
        addressCity: payload.addressCity,
        addressComplement: payload.addressComplement,
        addressDistrict: payload.addressDistrict,
        addressNumber: payload.addressNumber,
        addressState: payload.addressState,
        addressStreet: payload.addressStreet,
      },
    });
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
    return prisma.address.update({
      data: {
        addressZipcode: payload.addressZipcode,
        addressCategory: payload.addressCategory!,
        ownerId: payload.ownerId!,
        addressCity: payload.addressCity,
        addressComplement: payload.addressComplement,
        addressDistrict: payload.addressDistrict,
        addressNumber: payload.addressNumber,
        addressState: payload.addressState,
        addressStreet: payload.addressStreet,
      },
      where: {
        id: payload.id,
      },
    });
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
    return prisma.address.delete({
      where: {
        id,
      },
    });
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
  const address = await prisma.address.findFirst({ where: { id } });

  if (!address) {
    throw createError({
      statusCode: 404,
      message: "Address not found",
    });
  }

  return address;
};
