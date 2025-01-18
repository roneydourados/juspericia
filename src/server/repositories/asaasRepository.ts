import prisma from "@/lib/prisma";
import moment from "moment";
import { uuidv7 } from "uuidv7";
import { useCustomerAsaas } from "~/lib/asaas/customer-api";
import { useAsaasPayment } from "~/lib/asaas/payment-api";
import { CustomerProps } from "~/lib/asaas/types/Customer";
import { PaymentAsaasProps } from "~/lib/asaas/types/Payment";
import { WebHookPaymentResponseProps } from "~/lib/asaas/types/WebhookPayment";
import { UserProps } from "~/types/User";

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
  userId: number
) => {
  try {
    const { createPayment } = useAsaasPayment();

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw createError({
        statusCode: 400,
        message: "User not found!",
      });
    }

    if (!user.officeCnpj) {
      throw createError({
        statusCode: 400,
        message: "CPF/CNPJ Office not found!",
      });
    }

    if (!user.customerId) {
      const address = await prisma.address.findFirst({
        where: {
          ownerId: user.id,
          addressCategory: "USER",
        },
      });

      //verificar o cliente se existe
      const customer = await createCustomer({
        cpfCnpj: user.officeCnpj!,
        name: user.officeName!,
        email: user.officeEmail ? user.officeEmail : "",
        userId: user.id,
        phone: user.officePhone ? user.officePhone : undefined,
        mobilePhone: user.whatsapp ? user.whatsapp : undefined,
        company: user.officeName ? user.officeName : undefined,
        address: address?.addressStreet ? address.addressStreet : undefined,
        addressNumber: address?.addressNumber
          ? address.addressNumber
          : undefined,
        complement: address?.addressComplement
          ? address.addressComplement
          : undefined,
        province: address?.addressDistrict
          ? address.addressDistrict
          : undefined,
        postalCode: address?.addressZipcode
          ? address.addressZipcode
          : undefined,
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
      externalReference: uuidv7(),
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
        const expiredAt = moment().add(1, "month").format("YYYY-MM-DD");

        await prisma.sales.create({
          data: {
            publicId: payload.payment.externalReference,
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
            publicId: payload.payment.externalReference,
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
        await prisma.sales.delete({
          where: {
            publicId: payload.payment.externalReference,
          },
        });
        break;
      case "PAYMENT_REFUNDED":
        const saleRefunded = await prisma.sales.findFirst({
          where: {
            publicId: payload.payment.externalReference,
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
