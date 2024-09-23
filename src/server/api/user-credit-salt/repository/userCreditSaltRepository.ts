import prisma from "@/lib/prisma";
import moment from "moment";
import { UserCreditSalt } from "~/types/UserCredit";
import { userCategoryType } from "@/server/utils/Constants";
import { uuidv7 } from "uuidv7";

export const index = async (input: {
  userId: number;
  isExpired?: boolean;
  status?: string;
}) => {
  const { userId, isExpired = false, status } = input;
  let where = undefined;

  if (isExpired) {
    where = {
      userId,
      AND: [
        {
          status,
        },
      ],
    };
  } else {
    where = {
      userId,
      AND: [
        {
          status,
        },
      ],
    };
  }

  return prisma.userCreditSalt.findMany({
    where,
    select: {
      id: true,
      userId: true,
      description: true,
      expiredAt: true,
      createdAt: true,
      updatedAt: true,
      saltCategory: true,
      salt: true,
      publicId: true,
      status: true,
    },
  });
};

export const create = async (payload: UserCreditSalt) => {
  try {
    //pegar a categoria pelo tipo enviado
    const saltCategory = Object.values(userCategoryType).find(
      (category) => category.type === payload.saltCategory
    );

    if (!saltCategory) {
      throw new Error("Invalid salt category type");
    }

    return prisma.userCreditSalt.create({
      data: {
        userId: payload.userId!,
        salt: Number(payload.salt!),
        saltCategory: saltCategory.type,
        expiredAt: new Date(payload.expiredAt!),
        description: `Compra de ${saltCategory.description}`,
        publicId: uuidv7(),
        status: "active",
        UserLogCredit: {
          create: {
            userId: payload.userId!,
            history: `Inclusão de crédito referemte a ${
              saltCategory.description
            } data de expiração ${moment(payload.expiredAt!).format(
              "DD/MM/YYYY"
            )}`,
            oldValue: 0, // saldo anterior
            inputValue: payload.salt!, // entrada
            outputValue: 0, // saída
            saltValue: payload.salt!, // saldo atual
          },
        },
        UserCreditPayment: {
          createMany: {
            data: payload.UserCreditPayment!.map((payment) => ({
              paymentForm: payment.paymentForm!,
              value: payment.value!,
              chargeId: payment.chargeId,
              status: payment.status!,
            })),
          },
        },
      },
    });
  } catch (error) {
    console.log("🚀 ~ create ~ error:", error);
    throw createError({
      status: 500,
      message: "Failed to create user credit salt",
    });
  }
};

export const cancel = async (id: string) => {
  await exists(id);
  try {
    return prisma.userCreditSalt.update({
      where: {
        publicId: id,
      },
      data: {
        status: "canceled",
      },
    });
  } catch (error) {
    console.log("🚀 ~ cancel ~ error:", error);
    throw createError({
      status: 500,
      message: "Failed to cancel user credit salt",
    });
  }
};

export const show = async (id: string) => {
  const userCreditSalt = await prisma.userCreditSalt.findFirst({
    select: {
      id: true,
      createdAt: true,
      description: true,
      expiredAt: true,
      salt: true,
      saltCategory: true,
      status: true,
      updatedAt: true,
      User: {
        select: {
          email: true,
          name: true,
          phone: true,
          oab: true,
          oabUf: true,
          officeCnpj: true,
          officeName: true,
        },
      },
      UserCreditPayment: {
        select: {
          chargeId: true,
          paymentForm: true,
          value: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      UserLogCredit: {
        select: {
          createdAt: true,
          history: true,
          oldValue: true,
          inputValue: true,
          outputValue: true,
          saltValue: true,
          userId: true,
        },
        orderBy: {
          id: "desc",
        },
      },
    },
    where: {
      publicId: id,
    },
  });

  if (!userCreditSalt) {
    throw createError({
      status: 404,
      message: "User credit salt not found",
    });
  }

  return userCreditSalt;
};

const exists = async (id: string) => {
  const userCreditSalt = await prisma.userCreditSalt.findFirst({
    select: { id: true },
    where: {
      publicId: id,
    },
  });

  if (!userCreditSalt) {
    throw createError({
      status: 404,
      message: "User credit salt not found",
    });
  }

  return userCreditSalt;
};
