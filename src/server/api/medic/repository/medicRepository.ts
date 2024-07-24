import { prisma } from "@/server/providers/prisma";

import { ProfileType, UserProps } from "@/types/User";
import { useHash } from "~/server/providers/hash";

export const create = async (payload: UserProps) => {
  const { hashText } = useHash();

  const profile = await prisma.profile.findFirst({
    where: {
      type: "MEDICO",
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
        crm: payload.crm,
        cpfCnpj: payload.cpfCnpj,
        crmUf: payload.crmUf,
        phone: payload.phone,
        profileId: profile.id,
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  } catch (error) {
    console.log("🚀 ~ error create Medic:", error);
    throw createError({
      statusCode: 500,
      message: "Error to create medic",
    });
  }
};

export const update = async (payload: UserProps) => {
  const { hashText } = useHash();

  await exists(payload.id!);
  //await validations(payload);

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
        crm: payload.crm,
        cpfCnpj: payload.cpfCnpj,
        crmUf: payload.crmUf,
        phone: payload.phone,
      },
      where: {
        id: payload.id,
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  } catch (error) {
    console.log("🚀 ~ error update Medic:", error);
    throw createError({
      statusCode: 500,
      message: "Error to update Medic",
    });
  }
};

export const destroy = async (id: number) => {
  await exists(id);

  try {
    await prisma.user.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.log("🚀 ~ error remove Medic:", error);
    throw createError({
      statusCode: 500,
      message: "Error to remove Medic",
    });
  }
};

export const index = async (inputQuery: string) => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      cpfCnpj: true,
      phone: true,
      crm: true,
      active: true,
      crmUf: true,
      email: true,
      // Profile: {
      //   select: {
      //     id: true,
      //     profileName: true,
      //     type: true,
      //   },
      // },
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
          Profile: { type: "MEDICO" },
        },
      ],
    },
    orderBy: {
      name: "asc",
    },
  });
};

export const show = async (id: number) => {
  return exists(id);
};

const exists = async (id: number) => {
  const user = await prisma.user.findFirst({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      cpfCnpj: true,
      phone: true,
      crm: true,
      active: true,
      crmUf: true,
      email: true,
      oab: true,
      oabUf: true,
      officeName: true,
      Profile: {
        select: {
          id: true,
          profileName: true,
          type: true,
        },
      },
    },
  });

  if (!user) {
    throw createError({
      statusCode: 404,
      message: "Not found",
    });
  }

  return user;
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
      message: "Medic already exists",
    });
  }

  if (!payload.email) {
    throw createError({
      statusCode: 409,
      message: "Medic email is required",
    });
  }

  if (!payload.name) {
    throw createError({
      statusCode: 409,
      message: "Medic name is required",
    });
  }
};
