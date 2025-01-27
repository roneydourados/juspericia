import prisma from "@/lib/prisma";

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
      },
      where: {
        userId,
        creditDate: {
          gte,
          lte,
        },
        status,
      },
      orderBy: {
        id: "desc",
      },
    });

    return credits.map((credit) => ({
      ...credit,
      dateCreated: credit.creditDate.toISOString(),
      dateUpdated: credit.creditDate.toISOString(),
      expireDate: formatDate(credit.expireDate),
    }));
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
