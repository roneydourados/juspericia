import prisma from "@/lib/prisma";
import { UserProps } from "@/types/User";
import { uuidv7 } from "uuidv7";
import { useHash } from "@/server/providers/hash";
import moment from "moment";
import { sendEmail } from "../services/emailService";

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

export const register = async (payload: UserProps) => {
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
    const exists = await prisma.user.findFirst({
      select: {
        id: true,
        name: true,
        active: true,
      },
      where: {
        email: payload.email,
      },
    });

    if (exists && exists.active) {
      throw createError({
        statusCode: 400,
        statusMessage: "User is exists",
      });
    }

    if (exists && !exists.active) {
      //apagar o tokens antigo
      await prisma.userTokens.deleteMany({
        where: {
          userId: exists.id,
        },
      });

      //expirar token em 3 minutos
      const expiresAt = moment().add(3, "minutes").toDate();

      // primeiro criar o token
      const userToken = await prisma.userTokens.create({
        data: {
          token: uuidv7(),
          userId: exists.id,
          expiresAt,
        },
      });

      //se existe e não está ativo, reenviar o email
      await sendEmail(
        payload.email!,
        payload.name!,
        payload.officeName!,
        userToken.token
      );

      return;
    }

    const hashedpassword = await hashText(payload.password!);

    const user = await prisma.user.create({
      data: {
        publicId: uuidv7(),
        email: payload.email!,
        name: payload.name!,
        password: hashedpassword,
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
        active: false,
      },
    });

    if (payload.Address) {
      await prisma.address.create({
        data: {
          publicId: uuidv7(),
          addressCity: payload.Address.addressCity,
          addressComplement: payload.Address.addressComplement,
          addressDistrict: payload.Address.addressDistrict,
          addressNumber: payload.Address.addressNumber,
          addressState: payload.Address.addressState,
          addressStreet: payload.Address.addressStreet,
          addressZipcode: payload.Address.addressZipcode,
          ownerId: user.id,
          addressCategory: addressCategoryType.user,
        },
      });
    }

    //expirar token em 3 minutos
    const expiresAt = moment().add(3, "minutes").toDate();

    // primeiro criar o token
    const userToken = await prisma.userTokens.create({
      data: {
        token: uuidv7(),
        userId: user.id,
        expiresAt,
      },
    });

    //se existe e não está ativo, reenviar o email
    await sendEmail(
      payload.email!,
      payload.name!,
      payload.officeName!,
      userToken.token
    );

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      publicId: user.publicId,
    };
  } catch (error) {
    console.log("🚀 ~ error register User Lawyer:", error);
    throw createError({
      statusCode: 500,
      message: "Error to register User Lawyer",
    });
  }
};

export const activeAccount = async (token: string) => {
  const tokenExists = await prisma.userTokens.findFirst({
    where: {
      token,
    },
  });

  if (!tokenExists) {
    throw createError({
      statusCode: 400,
      statusMessage: "Token not found",
    });
  }

  const expired = moment().isAfter(tokenExists?.expiresAt);

  if (expired) {
    throw createError({
      statusCode: 400,
      statusMessage: "Token as expired!",
    });
  }

  try {
    const user = await prisma.user.update({
      data: {
        active: true,
      },
      where: {
        id: tokenExists.userId,
      },
    });

    await prisma.userTokens.deleteMany({
      where: {
        userId: user.id,
      },
    });

    return {
      name: user.name,
      email: user.email,
      active: user.active,
    };
  } catch (error) {
    console.log("🚀 ~ error active account:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Error to active account",
    });
  }
};

export const forgotActivateLink = async (token: string) => {
  const tokenExists = await prisma.userTokens.findFirst({
    where: {
      token,
    },
  });

  if (!tokenExists) {
    throw createError({
      statusCode: 400,
      statusMessage: "Token not found",
    });
  }

  const user = await prisma.user.findFirst({
    where: {
      id: tokenExists.userId,
    },
  });

  if (!user) {
    throw createError({
      statusCode: 400,
      statusMessage: "User not found",
    });
  }

  try {
    await prisma.userTokens.deleteMany({
      where: {
        userId: user.id,
      },
    });

    //expirar token em 3 minutos
    const expiresAt = moment().add(3, "minutes").toDate();

    // primeiro criar o token
    const userToken = await prisma.userTokens.create({
      data: {
        token: uuidv7(),
        userId: user.id,
        expiresAt,
      },
    });

    //se existe e não está ativo, reenviar o email
    await sendEmail(user.email!, user.name!, user.officeName!, userToken.token);

    return {
      name: user.name,
      email: user.email,
      active: user.active,
    };
  } catch (error) {
    console.log("🚀 ~ error forgot activate link:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Error to  forgot activate link",
    });
  }
};
