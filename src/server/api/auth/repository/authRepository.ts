import { JwtPayload } from "jsonwebtoken";
import { prisma } from "@/server/providers/prisma";
import { useHash } from "@/server/providers/hash";
import { useJwtToken } from "@/server/providers/jwtToken";
import { UserProfileProps, UserProps } from "@/types/User";
import { AuthProps } from "~/types/Auth";

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
      email,
      active: true,
    },
  });

  if (!user) {
    console.log("🚀 ~ login ~ user:", user);
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
      email: user.email,
      name: user.name,
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

export const register = async ({
  email = "",
  active = true,
  name = "",
  password = "",
  profileId = 0,
}: UserProps) => {
  const { hashText } = useHash();

  const exists = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (exists) {
    throw createError({
      statusCode: 400,
      statusMessage: "User already exists",
    });
  }

  try {
    const hashedpassword = await hashText(password);

    const user = await prisma.user.create({
      data: { email, active, name, password: hashedpassword, profileId },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  } catch (error) {
    console.log("🚀 ~ register user error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error on register user",
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
      email: user.email,
      name: user.name,
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
