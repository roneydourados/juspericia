import prisma from "@/lib/prisma";
import moment from "moment";
import { uuidv7 } from "uuidv7";
import { useCustomerAsaas } from "~/lib/asaas/customer-api";
import { useAsaasPayment } from "~/lib/asaas/payment-api";
import { CustomerProps } from "~/lib/asaas/types/Customer";
import { PaymentAsaasProps } from "~/lib/asaas/types/Payment";
import { WebHookPaymentResponseProps } from "~/lib/asaas/types/WebhookPayment";
import { UserProps } from "~/types/User";
import { UserCreditSalt } from "~/types/UserCredit";
import { createUserCredit } from "../utils/functionts";

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
          await prisma.sales.update({
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

          const expiredAt = moment(payload.payment.dueDate)
            .add(1, "month")
            .format("YYYY-MM-DD");

          await createUserCredit({
            userId: user.id!,
            saleId: sale.id,
            salt: payload.payment.value,
            saltCategory: "sale",
            expiredAt,
            description: payload.payment.description,
            UserCreditPayment: [
              {
                paymentForm: payload.payment.billingType,
                value: payload.payment.value,
                status: "active",
              },
            ],
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

        //caso seja estornada a venda então também cancelar o saldo em créditos
        if (saleRefunded) {
          const salt = await prisma.userCreditSalt.findFirst({
            where: {
              saleId: saleRefunded?.id,
            },
          });

          if (salt) {
            await prisma.userCreditSalt.update({
              data: {
                status: "canceled",
                UserLogCredit: {
                  create: {
                    userId: salt.userId,
                    history: `Estorno de crédito referente ao cancelamento da venda: ${
                      salt.description
                    } no valor: ${saleRefunded.value.toFixed(
                      2
                    )} data de expiração ${moment(salt.expiredAt).format(
                      "DD/MM/YYYY"
                    )}`,
                    oldValue: salt.salt, // saldo anterior
                    inputValue: 0, // entrada
                    outputValue: salt.salt, // saída
                    saltValue: 0, // saldo atual
                  },
                },
              },
              where: {
                id: salt.id,
              },
            });
          }
        }

        //caso seja estornado atualizar a venda
        await prisma.sales.updateMany({
          data: {
            status: payload.payment.status,
            localStatus: "refunded",
          },
          where: {
            saleId: payload.payment.id,
          },
        });
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
