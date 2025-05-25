import { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { useHash } from "@/server/providers/hash";
import { useJwtToken } from "@/server/providers/jwtToken";
import { UserProfileProps, UserProps } from "@/types/User";
import { AuthProps } from "@/types/Auth";
import dayjs from "dayjs";
import { sendEmail } from "../services/emailService";
import { uuidv7 } from "uuidv7";

export const login = async ({ email, password }: AuthProps) => {
  const { validHash } = useHash();
  const { createToken, tokenData } = useJwtToken();

  if (!password) {
    throw createError({
      statusCode: 400,
      statusMessage: "User is missing password",
    });
  }

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email is missing",
    });
  }

  const user = await prisma.user.findFirst({
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      password: true,
      publicId: true,
      customerId: true,
      cpfCnpj: true,
      Profile: {
        select: {
          profileName: true,
          type: true,
          ProfileRoute: {
            select: {
              icon: true,
              isMenu: true,
              title: true,
              to: true,
              visible: true,
            },
            orderBy: {
              id: "asc",
            },
          },
        },
      },
    },
    where: {
      email,
      active: true,
    },
  });

  if (!user) {
    throw createError({
      statusCode: 403,
      statusMessage: "User is missing password, user!",
    });
  }

  const passwordMatch = await validHash(password, user.password);

  if (!passwordMatch) {
    throw createError({
      statusCode: 403,
      statusMessage: "E-mail is missing password",
    });
  }

  try {
    const payloadToken: UserProps = {
      id: user.id,
      customerId: user.customerId || "",
      email: user.email,
      name: user.name,
      publicId: user.publicId!,
      cpfCnpj: user.cpfCnpj || "",
      Profile: user.Profile as UserProfileProps,
    };

    const token = createToken(payloadToken);

    const tokenDataDecoded = tokenData(token) as JwtPayload;

    return {
      token: {
        type: "bearer",
        token,
        expires_at: new Date(Number(tokenDataDecoded.exp) * 1000),
        exp: tokenDataDecoded.exp,
      },
    };
  } catch (error) {
    console.log("🚀 ~ token - login:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error on login",
    });
  }
};

export const verifyUser = async (id: number) => {
  const { createToken, tokenData } = useJwtToken();

  const user = await prisma.user.findFirst({
    select: {
      id: true,
      email: true,
      name: true,
      customerId: true,
      cpfCnpj: true,
      publicId: true,
      Profile: {
        select: {
          profileName: true,
          type: true,
          ProfileRoute: {
            select: {
              icon: true,
              isMenu: true,
              title: true,
              to: true,
              visible: true,
            },
          },
        },
      },
    },
    where: {
      id,
    },
  });

  if (!user) {
    throw createError({
      statusCode: 403,
      statusMessage: "User is missing password",
    });
  }

  try {
    const payloadToken: UserProps = {
      id: user.id,
      customerId: user.customerId || "",
      email: user.email,
      name: user.name,
      cpfCnpj: user.cpfCnpj || "",
      publicId: user.publicId!,
      Profile: user.Profile as UserProfileProps,
    };

    const token = createToken(payloadToken);

    const tokenDataDecoded = tokenData(token) as JwtPayload;

    return {
      token: {
        type: "bearer",
        token,
        expires_at: new Date(Number(tokenDataDecoded.exp) * 1000),
        exp: tokenDataDecoded.exp,
      },
    };
  } catch (error) {
    console.log("🚀 ~ verifyUser ~ error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error on login",
    });
  }
};

export const register = async (payload: UserProps) => {
  const { hashText } = useHash();
  const config = useRuntimeConfig();

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
      const expiresAt = dayjs().add(3, "minutes").toDate();

      // primeiro criar o token
      const userToken = await prisma.userTokens.create({
        data: {
          token: uuidv7(),
          userId: exists.id,
          expiresAt,
        },
      });

      //se existe e não está ativo, reenviar o email
      await sendEmail({
        email: payload.email!,
        name: payload.name!,
        office: payload.officeName!,
        template: "email",
        linkConfirmation: `${config.public.appUrl}/activate-account/${userToken.token}`,
      });

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
    const expiresAt = dayjs().add(3, "minutes").toDate();

    // primeiro criar o token
    const userToken = await prisma.userTokens.create({
      data: {
        token: uuidv7(),
        userId: user.id,
        expiresAt,
      },
    });

    //se existe e não está ativo, reenviar o email
    await sendEmail({
      email: payload.email!,
      name: payload.name!,
      office: payload.officeName!,
      template: "email",
      linkConfirmation: `${config.public.appUrl}/activate-account/${userToken.token}`,
    });

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

  const expired = dayjs().isAfter(tokenExists?.expiresAt);

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
  const config = useRuntimeConfig();

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
    const expiresAt = dayjs().add(3, "minutes").toDate();

    // primeiro criar o token
    const userToken = await prisma.userTokens.create({
      data: {
        token: uuidv7(),
        userId: user.id,
        expiresAt,
      },
    });

    //se existe e não está ativo, reenviar o email
    await sendEmail({
      email: user.email!,
      name: user.name!,
      office: user.officeName!,
      template: "email",
      linkConfirmation: `${config.public.appUrl}/activate-account/${userToken.token}`,
    });

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

export const forgotPassword = async (email: string) => {
  const config = useRuntimeConfig();

  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw createError({
        statusCode: 400,
        statusMessage: "User note found",
      });
    }

    // apagar os tokens antigos
    await prisma.userTokens.deleteMany({
      where: {
        userId: user.id,
      },
    });

    //expirar token em 3 minutos
    const expiresAt = dayjs().add(3, "minutes").toDate();

    // primeiro criar o token
    const userToken = await prisma.userTokens.create({
      data: {
        token: uuidv7(),
        userId: user.id,
        expiresAt,
      },
    });

    //enviar email para redefinir a senha
    await sendEmail({
      email: user.email!,
      name: user.name!,
      office: user.officeName!,
      template: "passwrod",
      linkConfirmation: `${config.public.appUrl}/forgot-password/renew/${userToken.token}`,
    });
  } catch (error) {
    console.log("🚀 ~ error forgot password:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Error to forgot password",
    });
  }
};

export const renewPassword = async ({ password }: UserProps, token: string) => {
  const { hashText } = useHash();

  if (!password) {
    throw createError({
      statusCode: 400,
      statusMessage: "New password is required",
    });
  }

  if (!token) {
    throw createError({
      statusCode: 400,
      statusMessage: "New password token is required",
    });
  }

  //pegar o token que foi enviado no email
  const tokenExists = await prisma.userTokens.findFirst({
    where: {
      token,
    },
  });

  // se não existir ja parar por aqui
  if (!tokenExists) {
    throw createError({
      statusCode: 400,
      statusMessage: "New password token is required",
    });
  }

  //se existir verificar se ainda é válido
  const expired = dayjs().isAfter(tokenExists.expiresAt);

  // se estiver expirado parar por aqui
  if (expired) {
    throw createError({
      statusCode: 400,
      statusMessage: "Token as expired!",
    });
  }

  try {
    // encriptar a senha
    const hashedpassword = await hashText(password);

    //atualizar nova senha
    const user = await prisma.user.update({
      data: {
        password: hashedpassword,
      },
      where: {
        id: tokenExists.userId,
      },
    });

    // apagar os tokens antigos
    await prisma.userTokens.deleteMany({
      where: {
        userId: user.id,
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  } catch (error) {
    console.log("🚀 ~ error renew password:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Error to renew password",
    });
  }
};
