import prisma from "~/lib/prisma";
import { SaleFilterProps } from "~/types/Sale";

export const getSaleUser = async ({
  userId,
  initialDate,
  finalDate,
  status,
}: SaleFilterProps) => {
  try {
    const gte = new Date(initialDate || "");
    const lte = new Date(finalDate || "");

    const sales = await prisma.sales.findMany({
      select: {
        publicId: true,
        description: true,
        billingType: true,
        confirmedDate: true,
        dateCreated: true,
        dueDate: true,
        //expiredAt: true,
        saleId: true,
        status: true,
        invoiceUrl: true,
        transactionReceiptUrl: true,
        value: true,
      },
      where: {
        userId,
        dateCreated: {
          gte,
          lte,
        },
        status,
        category: "package",
      },
      orderBy: {
        id: "desc",
      },
    });
    return sales.map((sale) => ({
      ...sale,
      dateCreated: formatDate(sale.dateCreated),
      dueDate: formatDate(sale.dueDate),
      //expiredAt: sale.expiredAt ? formatDate(sale.expiredAt) : "",
    }));
  } catch (error) {
    console.log("🚀 ~ error:", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Sale Could not be list",
    });
  }
};
