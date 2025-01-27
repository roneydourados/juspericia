import prisma from "@/lib/prisma";
import moment from "moment";
import { uuidv7 } from "uuidv7";
import { useCustomerAsaas } from "~/lib/asaas/customer-api";
import { useAsaasPayment } from "~/lib/asaas/payment-api";
import { CustomerProps } from "~/lib/asaas/types/Customer";
import { PaymentAsaasProps } from "~/lib/asaas/types/Payment";
import { WebHookPaymentResponseProps } from "~/lib/asaas/types/WebhookPayment";

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

    // cria a cobrança lá no asaas
    const resp = await createPayment({
      ...payload,
      externalReference: uuidv7(),
      customer: user.customerId,
    });

    // pega a resposta e cria a venda localmente no banco de dados
    if (resp) {
      // aqui é para lançar data de expiração de pacote quando for o caso
      let expiredAt = null;

      if (payload.category === "package") {
        expiredAt = moment().add(payload.dueDays, "days").format("YYYY-MM-DD");
      }

      const sale = await prisma.sales.create({
        data: {
          publicId: resp.externalReference,
          saleId: resp.id,
          billingType: resp.billingType,
          dueDate: new Date(resp.dueDate),
          dateCreated: new Date(resp.dateCreated),
          description: resp.description,
          invoiceUrl: resp.invoiceUrl,
          status: resp.status,
          userId: user.id!,
          value: resp.value,
          netValue: resp.netValue,
          nossoNumero: resp.nossoNumero,
          originalDueDate: resp.originalDueDate
            ? new Date(resp.originalDueDate)
            : undefined,
          expiredAt: expiredAt ? new Date(expiredAt) : undefined,
          category: payload.category,
          packageId: payload.packageId ? payload.packageId : undefined,
          solicitationId: payload.solicitationId
            ? payload.solicitationId
            : undefined,
        },
      });

      // se for venda de pacote então gerar saldo inicial de crédito, aqui vai aguardar
      // o webhook com a confirmação de pagamento para totalizar saldo
      if (payload.category === "package") {
        await prisma.userCredit.create({
          data: {
            userId: user.id!,
            value: resp.value,
            salt: 0,
            category: "package",
            ownerId: sale.id,
            publicId: uuidv7(),
            creditDate: new Date(),
            status: resp.status,
            expireDate: sale.expiredAt!,
            invoiceUrl: resp.invoiceUrl,
          },
        });
      }

      // se for pagamento de uma solicitação então atualizar o status da solicitação para pagamento pendente
      if (payload.solicitationId) {
        await prisma.patientConsultation.update({
          where: {
            id: payload.solicitationId,
          },
          data: {
            status: "payment_pending",
          },
        });
      }
    }

    return resp;
  } catch (error) {
    console.log("🚀 ~ error:", error);
    throw createError({
      statusCode: 500,
      message: "Error create payment asaas!",
    });
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
        console.log("🚀 ~ paymentWebhook ~ payload.event:", payload.event);

        break;

      case "PAYMENT_CONFIRMED":
        const sale = await prisma.sales.findFirst({
          where: {
            publicId: payload.payment.externalReference,
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
              paymentDate: payload.payment.confirmedDate
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

          // somente gerar crédito para o cliente se não for uma solicitação de consulta
          if (!sale.solicitationId && sale.category === "package") {
            const userCreditExists = await prisma.userCredit.findFirst({
              where: {
                userId: user.id!,
                category: "package",
                ownerId: sale.id,
              },
            });

            if (!userCreditExists) {
              throw createError({
                statusCode: 500,
                message: "User credit not found!",
              });
            }

            //Atualizar o saldo de crédito para o cliente
            await prisma.userCredit.update({
              where: {
                id: userCreditExists.id!,
              },
              data: {
                salt: payload.payment.value,
                status: payload.payment.status,
                transactionReceiptUrl: payload.payment.transactionReceiptUrl,
              },
            });

            // criar o log inicial do saldo
            await prisma.userCreditLog.create({
              data: {
                userCreditId: userCreditExists.id,
                history: `Entrada de crédito ref. a compra de ${
                  payload.payment.description
                } no valor de R$ ${payload.payment.value.toFixed(2)}`.trim(),
                type: "C",
                value: payload.payment.value,
              },
            });
          }

          // verificar se a venda é referente a uma solicitação de consulta se for então mudar o status
          if (sale.solicitationId) {
            await prisma.patientConsultation.update({
              where: {
                id: sale.solicitationId,
              },
              data: {
                status: "paid",
              },
            });
          }
        }
        break;

      case "PAYMENT_DELETED":
        const saleDeleted = await prisma.sales.findFirst({
          where: {
            publicId: payload.payment.externalReference,
          },
        });

        if (!saleDeleted) return;

        //caso seja deletado deletar a venda
        await prisma.sales.delete({
          where: {
            publicId: payload.payment.externalReference,
          },
        });

        //apagar qualquer crédito gerado
        await prisma.userCredit.deleteMany({
          where: {
            ownerId: saleDeleted.id,
            category: "package",
            userId: user.id!,
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
          // estornar saldo de crédito do cliente
          const userCredit = await prisma.userCredit.findFirst({
            where: {
              userId: user.id!,
              category: "package",
              ownerId: saleRefunded.id,
            },
          });

          if (userCredit) {
            if (Number(userCredit.salt) !== Number(userCredit.value)) {
              throw createError({
                statusCode: 500,
                message: "Salt credit diferente value!",
              });
            }

            //remover o saldo de crédito gerado pela venda
            await prisma.userCredit.update({
              where: {
                id: userCredit.id!,
              },
              data: {
                salt: 0,
                category: "package",
                status: payload.payment.status,
              },
            });

            //gerar o log do estorno
            await prisma.userCreditLog.create({
              data: {
                history: `Saída de crédito ref. a estorno de compra de ${
                  payload.payment.description
                } no valor de R$ ${payload.payment.value.toFixed(2)}`.trim(),
                userCreditId: userCredit.id,
                type: "D",
                value: payload.payment.value,
              },
            });
          }

          //caso seja estornado atualizar a venda
          await prisma.sales.update({
            data: {
              status: payload.payment.status,
              localStatus: "refunded",
            },
            where: {
              id: saleRefunded.id,
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

export const deletePayment = async (id: string) => {
  const { deletePayment } = useAsaasPayment();

  try {
    const saleDeleted = await prisma.sales.findFirst({
      where: {
        saleId: id,
      },
    });

    if (saleDeleted) {
      await prisma.sales.delete({
        where: {
          id: saleDeleted.id,
        },
      });

      await deletePayment(id);
    }
  } catch (error) {
    console.log("🚀 ~ deletePayment ~ error:", error);
    throw createError({
      statusCode: 500,
      message: "Erro on delete payment!",
    });
  }
};
