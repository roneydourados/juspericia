import prisma from "@/lib/prisma";

import { UserProps } from "@/types/User";
import { uuidv7 } from "uuidv7";
import { useHash } from "@/server/providers/hash";

export const create = async (payload: UserProps) => {
  const { hashText } = useHash();

  const profile = await prisma.profile.findFirst({
    where: {
      type: "ADVOGADO",
    },
  });

  if (!profile) {
    throw createError({
      statusCode: 500,
      message: "Profile not found",
    });
  }

  try {
    await validations(payload);

    const hashedpassword = await hashText(payload.password!);

    const user = await prisma.user.create({
      data: {
        email: payload.email!,
        name: payload.name!,
        password: hashedpassword,
        active: true,
        cpfCnpj: payload.cpfCnpj,
        phone: payload.phone,
        profileId: profile.id,
        oab: payload.oab,
        oabUf: payload.oabUf,
        officeName: payload.officeName,
        officeCnpj: payload.officeCnpj,
        officeEmail: payload.officeEmail,
        officePhone: payload.officePhone,
        whatsapp: payload.whatsapp,
        publicId: uuidv7(),
      },
    });

    if (payload.Address) {
      await prisma.address.create({
        data: {
          addressCity: payload.Address.addressCity,
          addressComplement: payload.Address.addressComplement,
          addressDistrict: payload.Address.addressDistrict,
          addressNumber: payload.Address.addressNumber,
          addressState: payload.Address.addressState,
          addressStreet: payload.Address.addressStreet,
          addressZipcode: payload.Address.addressZipcode,
          ownerId: user.id,
          addressCategory: addressCategoryType.user,
          publicId: uuidv7(),
        },
      });
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      publicId: user.publicId,
    };
  } catch (error) {
    console.log("🚀 ~ error create User Lawyer:", error);
    throw createError({
      statusCode: 500,
      message: "Error to create User Lawyer",
    });
  }
};

export const update = async (payload: UserProps) => {
  const { hashText } = useHash();

  await exists(payload.publicId!);

  const hashedpassword = payload.password
    ? await hashText(payload.password!)
    : undefined;

  try {
    const user = await prisma.user.update({
      data: {
        email: payload.email,
        name: payload.name,
        password: hashedpassword,
        active: payload.active,
        cpfCnpj: payload.cpfCnpj,
        phone: payload.phone,
        oab: payload.oab,
        oabUf: payload.oabUf,
        officeName: payload.officeName,
        officeCnpj: payload.officeCnpj,
        officeEmail: payload.officeEmail,
        officePhone: payload.officePhone,
        whatsapp: payload.whatsapp,
      },
      where: {
        publicId: payload.publicId,
      },
    });

    if (payload.Address) {
      await prisma.address.deleteMany({
        where: {
          ownerId: user.id,
          addressCategory: addressCategoryType.user,
        },
      });

      await prisma.address.create({
        data: {
          addressCity: payload.Address.addressCity,
          addressComplement: payload.Address.addressComplement,
          addressDistrict: payload.Address.addressDistrict,
          addressNumber: payload.Address.addressNumber,
          addressState: payload.Address.addressState,
          addressStreet: payload.Address.addressStreet,
          addressZipcode: payload.Address.addressZipcode,
          ownerId: user.id,
          addressCategory: addressCategoryType.user,
          publicId: uuidv7(),
        },
      });
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  } catch (error) {
    console.log("🚀 ~ error update User Lawyer:", error);
    throw createError({
      statusCode: 500,
      message: "Error to update User Lawyer",
    });
  }
};

export const destroy = async (id: string) => {
  const user = await exists(id);

  try {
    await prisma.user.delete({
      where: {
        publicId: id,
      },
    });

    await prisma.address.deleteMany({
      where: {
        ownerId: user.id,
        addressCategory: addressCategoryType.user,
      },
    });
  } catch (error) {
    console.log("🚀 ~ error remove User Lawyer:", error);
    throw createError({
      statusCode: 500,
      message: "Error to remove User Lawyer",
    });
  }
};

export const index = async (inputQuery: string) => {
  const data = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      phone: true,
      active: true,
      email: true,
      oab: true,
      oabUf: true,
      cpfCnpj: true,
      officeName: true,
      officePhone: true,
      officeEmail: true,
      officeCnpj: true,
      whatsapp: true,
      publicId: true,
    },
    where: {
      OR: [
        {
          email: { contains: inputQuery, mode: "insensitive" },
        },
        {
          name: { contains: inputQuery, mode: "insensitive" },
        },
      ],
      AND: [
        {
          Profile: { type: "ADVOGADO" },
        },
      ],
    },
    orderBy: {
      name: "asc",
    },
  });

  const laywers = await Promise.all(
    data.map(async (item) => {
      const Address = await prisma.address.findFirst({
        where: {
          ownerId: item.id,
          addressCategory: addressCategoryType.user,
        },
      });

      return {
        ...item,
        Address,
      };
    })
  );

  return laywers;
};

export const show = async (id: string) => {
  return exists(id);
};

const exists = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: {
      publicId: id,
    },
    select: {
      id: true,
      name: true,
      cpfCnpj: true,
      phone: true,
      active: true,
      email: true,
      oab: true,
      oabUf: true,
      officeName: true,
      officePhone: true,
      officeEmail: true,
      officeCnpj: true,
      whatsapp: true,
      publicId: true,
    },
  });

  if (!user) {
    throw createError({
      statusCode: 404,
      message: "Not found",
    });
  }

  const Address = await prisma.address.findFirst({
    where: {
      ownerId: user.id,
      addressCategory: addressCategoryType.user,
    },
  });

  return {
    ...user,
    Address,
  };
};

const validations = async (payload: UserProps) => {
  const exists = await prisma.user.findFirst({
    where: {
      email: payload.email,
    },
  });

  if (exists) {
    throw createError({
      statusCode: 409,
      message: "User Lawyer already exists",
    });
  }

  if (!payload.email) {
    throw createError({
      statusCode: 409,
      message: "User Lawyer email is required",
    });
  }

  if (!payload.name) {
    throw createError({
      statusCode: 409,
      message: "User Lawyer name is required",
    });
  }
};
