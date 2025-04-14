import { AddressProps } from "@/types/Address";
import { prisma } from "@/prisma/db";
import { uuidv7 } from "uuidv7";

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
        publicId: uuidv7(),
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
  await exists(payload.publicId!);

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
        publicId: payload.publicId,
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

export const destroy = async (id: string) => {
  await exists(id);

  try {
    return prisma.address.delete({
      where: {
        publicId: id,
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

export const show = async (id: string) => {
  return exists(id);
};

const exists = async (id: string) => {
  const address = await prisma.address.findFirst({ where: { publicId: id } });

  if (!address) {
    throw createError({
      statusCode: 404,
      message: "Address not found",
    });
  }

  return address;
};
