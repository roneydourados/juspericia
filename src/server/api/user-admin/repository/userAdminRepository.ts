import prisma from "@/lib/prisma";

import { UserProps } from "@/types/User";
import { uuidv7 } from "uuidv7";
import { useHash } from "~/server/providers/hash";

export const create = async (payload: UserProps) => {
  const { hashText } = useHash();

  const profile = await prisma.profile.findFirst({
    where: {
      type: "ADMIN",
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
        publicId: uuidv7(),
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      publicId: user.publicId,
    };
  } catch (error) {
    console.log("🚀 ~ error create User Admin:", error);
    throw createError({
      statusCode: 500,
      message: "Error to create User Admin",
    });
  }
};

export const update = async (payload: UserProps) => {
  const { hashText } = useHash();

  await exists(payload.publicId!);
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
        cpfCnpj: payload.cpfCnpj,
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
      publicId: user.publicId,
    };
  } catch (error) {
    console.log("🚀 ~ error update User Admin:", error);
    throw createError({
      statusCode: 500,
      message: "Error to update User Admin",
    });
  }
};

export const destroy = async (id: string) => {
  await exists(id);

  try {
    await prisma.user.delete({
      where: {
        publicId: id,
      },
    });
  } catch (error) {
    console.log("🚀 ~ error remove User Admin:", error);
    throw createError({
      statusCode: 500,
      message: "Error to remove User Admin",
    });
  }
};

export const index = async (inputQuery: string) => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      phone: true,
      active: true,
      email: true,
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
          Profile: { type: "ADMIN" },
        },
      ],
    },
    orderBy: {
      name: "asc",
    },
  });
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
      publicId: true,
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
      message: "User Admin already exists",
    });
  }

  if (!payload.email) {
    throw createError({
      statusCode: 409,
      message: "User Admin email is required",
    });
  }

  if (!payload.name) {
    throw createError({
      statusCode: 409,
      message: "User Admin name is required",
    });
  }
};
