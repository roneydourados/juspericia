import { prisma } from "../../../providers/prisma";
import { JwtPayload } from "jsonwebtoken";
import { useHash } from "../../../providers/hash";
import { useJwtToken } from "../../../providers/jwtToken";
import { UserProfileProps, UserProps } from "@/types/User";

export const login = async ({ email, password }: UserProps) => {
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
    throw createError({
      statusCode: 403,
      statusMessage: "User is missing password",
    });
  }

  const passwordMatch = await validHash(password, user.password);

  if (!passwordMatch) {
    throw createError({
      statusCode: 40,
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
    console.log("🚀 ~ token:", error);
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
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error on login",
    });
  }
};