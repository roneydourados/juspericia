import { prisma } from "@/prisma/db";
import moment from "moment";

export const index = async (input: {
  status?: string;
  userId: number;
  initialDate?: string;
  finalDate?: string;
}) => {
  const { initialDate, finalDate, status, userId } = input;

  let internalStatus = status;

  if (status === "EXPIRED" || status === "FINISHED") {
    internalStatus = undefined;
  }

  try {
    const gte = initialDate ? new Date(initialDate) : undefined;
    const lte = finalDate ? new Date(finalDate) : undefined;

    const credits = await prisma.userCredit.findMany({
      select: {
        publicId: true,
        value: true,
        salt: true,
        status: true,
        creditDate: true,
        expireDate: true,
        invoiceUrl: true,
        transactionReceiptUrl: true,
      },
      where: {
        userId,
        status: internalStatus,
        creditDate: {
          gte,
          lte,
        },
        expireDate: {
          ...(status === "EXPIRED" ? { lt: new Date() } : { gte: new Date() }),
        },
        salt: {
          ...(status === "FINISHED" ? { lte: 0 } : { gt: 0 }),
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    //pegar a data atual
    const currentDate = moment();

    //totalizar os creditos independente do status, somente o periodo
    const totals = credits.reduce(
      (acc, item) => {
        const salt = Number(item.salt ?? 0);
        const value = Number(item.value ?? 0);

        // Verifica se o crédito expirou
        if (moment(item.expireDate).isBefore(currentDate)) {
          acc.totalExpired += salt;
        } else {
          acc.total += salt;
        }

        // Verifica se o status é "PENDING"
        if (item.status === "PENDING") {
          acc.totalPending += value;
        }

        return acc;
      },
      { total: 0, totalExpired: 0, totalPending: 0 }
    );

    const creditsReturn = credits.map((credit) => {
      return {
        ...credit,
        dateCreated: formatDate(credit.creditDate),
        expireDate: formatDate(credit.expireDate),
      };
    });

    return {
      totals,
      credits: creditsReturn,
    };
  } catch (error) {
    console.log("🚀 ~ error:", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Credits Could not be list",
    });
  }
};

export const userLogCredit = async (publicId: string) => {
  try {
    const userCredit = await prisma.userCredit.findFirst({
      where: {
        publicId,
      },
    });

    if (userCredit) {
      return prisma.userCreditLog.findMany({
        select: {
          createdAt: true,
          history: true,
          type: true,
          value: true,
        },
        where: {
          userCreditId: userCredit.id,
        },
        orderBy: {
          id: "desc",
        },
      });
    }

    return [];
  } catch (error) {
    console.log("🚀 ~ error:", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Sale Could not be list",
    });
  }
};
