import db from '@adonisjs/lucid/services/db'

import { WebHookPaymentResponseProps } from '../dtos/index.js'

import { User, Sale, UserCredit, UserCreditLog, PatientConsultation } from '#models/index'

export default class AssaasWebhookService {
  async paymentWebhook(payload: WebHookPaymentResponseProps) {
    const trx = await db.transaction()
    try {
      const user = await User.query().where({ customerId: payload.payment.customer }).firstOrFail()

      switch (payload.event) {
        case 'PAYMENT_CREATED':
          console.log('🚀 ~ paymentWebhook ~ payload.event:', payload.event)

          break

        case 'PAYMENT_CONFIRMED':
          console.log('🚀 ~ AssaasWebhookService ~ paymentWebhook ~ PAYMENT_CONFIRMED')

          const sale = await Sale.query()
            .where({ publicId: payload.payment.externalReference })
            .first()

          if (sale) {
            sale.useTransaction(trx)

            // atualizar a venda para staus atual
            sale.merge({
              saleId: payload.payment.id,
              billingType: payload.payment.billingType,
              dueDate: payload.payment.dueDate,
              dateCreated: payload.payment.dateCreated,
              description: payload.payment.description,
              invoiceUrl: payload.payment.invoiceUrl,
              transactionReceiptUrl: payload.payment.transactionReceiptUrl,
              status: payload.payment.status,
              value: payload.payment.value,
              confirmedDate: payload.payment.confirmedDate
                ? payload.payment.confirmedDate
                : undefined,
              paymentDate: payload.payment.confirmedDate
                ? payload.payment.confirmedDate
                : undefined,
              netValue: payload.payment.netValue,
              nossoNumero: payload.payment.nossoNumero,
              originalDueDate: payload.payment.originalDueDate
                ? payload.payment.originalDueDate
                : undefined,
              localStatus: 'confirmed',
            })

            await sale.save()

            // somente gerar crédito para o cliente se não for uma solicitação de consulta
            if (!sale.solicitationId && sale.category === 'package') {
              const userCredit = await UserCredit.query()
                .where({
                  userId: user.id!,
                  category: 'package',
                  ownerId: sale.id,
                })
                .firstOrFail()
              // const userCreditExists = await prisma.userCredit.findFirst({
              //   where: {
              //     userId: user.id!,
              //     category: 'package',
              //     ownerId: sale.id,
              //   },
              // })

              // if (!userCreditExists) {
              //   throw createError({
              //     statusCode: 500,
              //     message: 'User credit not found!',
              //   })
              // }

              //Atualizar o saldo de crédito para o cliente
              userCredit.useTransaction(trx)

              userCredit.merge({
                salt: payload.payment.value,
                status: payload.payment.status,
                transactionReceiptUrl: payload.payment.transactionReceiptUrl,
              })

              await userCredit.save()

              // criar o log inicial do saldo
              UserCreditLog.create(
                {
                  userCreditId: userCredit.id,
                  history: `Entrada de crédito ref. a compra de ${
                    payload.payment.description
                  } no valor de R$ ${payload.payment.value.toFixed(2)}`.trim(),
                  type: 'C',
                  value: payload.payment.value,
                },
                { client: trx }
              )
            }

            // verificar se a venda é referente a uma solicitação de consulta se for então mudar o status
            if (sale.solicitationId) {
              await PatientConsultation.updateOrCreate(
                { id: sale.solicitationId },
                {
                  status: 'paid',
                },
                { client: trx }
              )
              // await prisma.patientConsultation.update({
              //   where: {
              //     id: sale.solicitationId,
              //   },
              //   data: {
              //     status: 'paid',
              //   },
              // })
            }

            await trx.commit()
          }
          break

        case 'PAYMENT_DELETED':
          console.log('🚀 ~ AssaasWebhookService ~ paymentWebhook ~ PAYMENT_DELETED')

          const saleDeleted = await Sale.query()
            .where({ publicId: payload.payment.externalReference })
            .first()

          if (!saleDeleted) return

          saleDeleted.useTransaction(trx)

          //caso seja deletado deletar a venda
          await saleDeleted.delete()

          //apagar qualquer crédito gerado
          await trx.rawQuery(
            `
              DELETE FROM user_credits
              WHERE owner_id = ?
                AND category = 'package'
                AND user_id = ?
            `,
            [saleDeleted.id, user.id]
          )

          await trx.commit()

          // await prisma.userCredit.deleteMany({
          //   where: {
          //     ownerId: saleDeleted.id,
          //     category: 'package',
          //     userId: user.id!,
          //   },
          // })
          break
        case 'PAYMENT_REFUNDED':
          console.log('🚀 ~ AssaasWebhookService ~ paymentWebhook ~ PAYMENT_REFUNDED')

          const saleRefunded = await Sale.query()
            .where({ publicId: payload.payment.externalReference })
            .first()

          // const saleRefunded = await prisma.sales.findFirst({
          //   where: {
          //     publicId: payload.payment.externalReference,
          //   },
          // })

          if (saleRefunded) {
            // estornar saldo de crédito do cliente
            const userCredit = await UserCredit.query()
              .where({ userId: user.id!, category: 'package', ownerId: saleRefunded.id })
              .first()

            if (userCredit) {
              if (Number(userCredit.salt) !== Number(userCredit.value)) {
                throw new Error('Salt credit diferente value!')
              }

              userCredit.useTransaction(trx)
              //remover o saldo de crédito gerado pela venda
              userCredit.merge({
                salt: 0,
                category: 'package',
                status: payload.payment.status,
              })

              await userCredit.save()

              //gerar o log do estorno
              await UserCreditLog.create(
                {
                  history: `Saída de crédito ref. a estorno de compra de ${
                    payload.payment.description
                  } no valor de R$ ${payload.payment.value.toFixed(2)}`.trim(),
                  userCreditId: userCredit.id,
                  type: 'D',
                  value: payload.payment.value,
                },
                { client: trx }
              )
            }

            //caso seja estornado atualizar a venda
            await trx.rawQuery(
              ` update sales
                SET status = ?, local_status = 'refunded'
                WHERE id = ?
              `,
              [payload.payment.status, saleRefunded.id]
            )

            await trx.commit()
            // await prisma.sales.update({
            //   data: {
            //     status: payload.payment.status,
            //     localStatus: 'refunded',
            //   },
            //   where: {
            //     id: saleRefunded.id,
            //   },
            // })
          }

          break
        default:
          break
      }
    } catch (error) {
      await trx.rollback()
      console.log('🚀 ~ asaasWebHookPayment ~ error:', error)
      throw new Error(`Error webhook asaas ${error}`)
    }
  }
}
