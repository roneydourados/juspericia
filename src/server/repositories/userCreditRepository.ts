import prisma from "@/lib/prisma";
import moment from "moment";

export const index = async (input: {
  status?: string;
  userId: number;
  initialDate: string;
  finalDate: string;
}) => {
  const { initialDate, finalDate, status, userId } = input;

  try {
    const gte = new Date(initialDate || "");
    const lte = new Date(finalDate || "");

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
        creditDate: {
          gte,
          lte,
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    //pegar a data atual
    const currentDate = moment();

    //totalizar os creditos independente do status, somente o periodo
    const totals = {
      total: credits.reduce(
        (acc, item) =>
          !moment(item.expireDate).isBefore(currentDate)
            ? acc + Number(item.salt ?? 0)
            : acc,
        0
      ),
      totalExpired: credits.reduce(
        (acc, item) =>
          moment(item.expireDate).isBefore(currentDate)
            ? acc + Number(item.salt ?? 0)
            : acc,
        0
      ),
      totalPending: credits.reduce(
        (acc, item) =>
          item.status === "PENDING" ? acc + Number(item.value) : acc,
        0
      ),
    };

    const creditsReturn = credits
      .map((credit) => {
        return {
          ...credit,
          dateCreated: formatDate(credit.creditDate),
          expireDate: formatDate(credit.expireDate),
        };
      })
      .filter((credit) => {
        // aqui filtrar o status quando usuário informar
        return status ? credit.status === status : true;
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
