import prisma from "@/lib/prisma";
import moment from "moment";
//import { uuidv7 } from "uuidv7";
import { useCustomerAsaas } from "~/lib/asaas/customer-api";
import { useAsaasPayment } from "~/lib/asaas/payment-api";
import { CustomerProps } from "~/lib/asaas/types/Customer";
import { PaymentAsaasProps } from "~/lib/asaas/types/Payment";
import { WebHookPaymentResponseProps } from "~/lib/asaas/types/WebhookPayment";
import { UserProps } from "~/types/User";
//import { UserCreditSalt } from "~/types/UserCredit";
//import { createUserCredit } from "../utils/functionts";

export const createCustomer = async (customer: CustomerProps) => {
  const { createCustomer } = useCustomerAsaas();

  const response = await createCustomer(customer);

  if (response) {
    await prisma.user.update({
      where: {
        id: customer.userId,
      },
      data: {
        customerId: response.id,
      },
    });

    return response;
  }

  return null;
};

export const getCustomer = async (cpfCnpj: string) => {
  const { getCustomer } = useCustomerAsaas();

  return getCustomer(cpfCnpj);
};

export const createPayment = async (
  payload: PaymentAsaasProps,
  user: UserProps
) => {
  try {
    const { createPayment } = useAsaasPayment();

    if (!user.customerId) {
      //verificar o cliente se existe
      const customer = await createCustomer({
        cpfCnpj: user.cpfCnpj!,
        name: user.name!,
        email: user.email ? user.email : "",
        userId: user.id,
      });

      if (!customer?.id) {
        throw createError({
          statusCode: 500,
          message: "Customer not found!",
        });
      }

      user.customerId = customer.id;
    }

    const resp = await createPayment({
      ...payload,
      customer: user.customerId,
    });

    return resp;
  } catch (error) {
    console.log("🚀 ~ error:", error);
  }
};

export const paymentWebhook = async (payload: WebHookPaymentResponseProps) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        customerId: payload.payment.customer,
      },
    });

    if (!user) {
      throw createError({
        statusCode: 500,
        message: "User not found!",
      });
    }

    switch (payload.event) {
      case "PAYMENT_CREATED":
        const expiredAt = moment(payload.payment.dueDate)
          .add(1, "month")
          .format("YYYY-MM-DD");

        await prisma.sales.create({
          data: {
            saleId: payload.payment.id,
            billingType: payload.payment.billingType,
            dueDate: new Date(payload.payment.dueDate),
            dateCreated: new Date(payload.payment.dateCreated),
            description: payload.payment.description,
            invoiceUrl: payload.payment.invoiceUrl,
            transactionReceiptUrl: payload.payment.transactionReceiptUrl,
            status: payload.payment.status,
            userId: user.id!,
            value: payload.payment.value,
            confirmedDate: payload.payment.confirmedDate
              ? new Date(payload.payment.confirmedDate)
              : undefined,
            netValue: payload.payment.netValue,
            nossoNumero: payload.payment.nossoNumero,
            originalDueDate: payload.payment.originalDueDate
              ? new Date(payload.payment.originalDueDate)
              : undefined,
            expiredAt: new Date(expiredAt),
          },
        });

        break;

      case "PAYMENT_CONFIRMED":
        const sale = await prisma.sales.findFirst({
          where: {
            saleId: payload.payment.id,
          },
        });

        if (sale) {
          // atualizar a venda para staus atual
          const updatedSale = await prisma.sales.update({
            data: {
              saleId: payload.payment.id,
              billingType: payload.payment.billingType,
              dueDate: new Date(payload.payment.dueDate),
              dateCreated: new Date(payload.payment.dateCreated),
              description: payload.payment.description,
              invoiceUrl: payload.payment.invoiceUrl,
              transactionReceiptUrl: payload.payment.transactionReceiptUrl,
              status: payload.payment.status,
              value: payload.payment.value,
              salt: payload.payment.value, // ai sim colocar um saldo
              confirmedDate: payload.payment.confirmedDate
                ? new Date(payload.payment.confirmedDate)
                : undefined,
              netValue: payload.payment.netValue,
              nossoNumero: payload.payment.nossoNumero,
              originalDueDate: payload.payment.originalDueDate
                ? new Date(payload.payment.originalDueDate)
                : undefined,
              localStatus: "confirmed",
            },
            where: {
              id: sale.id,
            },
          });

          await prisma.userCreditLog.create({
            data: {
              history: `Entrada de crédito ref. a compra de ${
                payload.payment.description
              } no valor de R$ ${payload.payment.value.toFixed(2)}`.trim(),
              userId: user.id!,
              saleId: updatedSale.id,
              type: "C",
              value: payload.payment.value,
            },
          });
        }
        break;

      case "PAYMENT_DELETED":
        //caso seja deletado deletar a venda
        await prisma.sales.deleteMany({
          where: {
            saleId: payload.payment.id,
          },
        });
        break;
      case "PAYMENT_REFUNDED":
        const saleRefunded = await prisma.sales.findFirst({
          where: {
            saleId: payload.payment.id,
          },
        });

        if (saleRefunded) {
          //caso seja estornado atualizar a venda
          await prisma.sales.update({
            data: {
              status: payload.payment.status,
              localStatus: "refunded",
              salt: 0,
            },
            where: {
              id: saleRefunded.id,
            },
          });

          await prisma.userCreditLog.create({
            data: {
              history: `Saída de crédito ref. a estorno de compra de ${
                payload.payment.description
              } no valor de R$ ${payload.payment.value.toFixed(2)}`.trim(),
              userId: user.id!,
              saleId: saleRefunded.id,
              type: "D",
              value: payload.payment.value,
            },
          });
        }

        break;
      default:
        break;
    }
  } catch (error) {
    console.log("🚀 ~ asaasWebHookPayment ~ error:", error);

    throw createError({
      statusCode: 500,
      message: "Error webhook asaas",
    });
  }
};
