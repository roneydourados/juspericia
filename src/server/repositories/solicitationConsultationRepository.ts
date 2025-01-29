import prisma from "@/lib/prisma";
import moment from "moment";
import { uuidv7 } from "uuidv7";
import { formatDate } from "@/server/utils/functionts";
import {
  SolicitationConsultationFilterProps,
  SolicitationConsultationProps,
} from "@/types/SolicitationConsultation";

export const index = async (filters: SolicitationConsultationFilterProps) => {
  const {
    initialDateSolicitation,
    finalDateSolicitation,
    status,
    benefitTypeId,
    patientId,
    reportPurposeId,
    userId,
  } = filters;
  const where = {
    dateOpen: {
      gte: new Date(initialDateSolicitation),
      lte: new Date(finalDateSolicitation),
    },
    status,
    userId: userId ? Number(userId) : undefined,
    patientId: patientId ? Number(patientId) : undefined,
    benefitTypeId: benefitTypeId ? Number(benefitTypeId) : undefined,
    reportPurposeId: reportPurposeId ? Number(reportPurposeId) : undefined,
  };

  const data = await prisma.patientConsultation.findMany({
    where,
    select: {
      id: true,
      dateAntecipation: true,
      dateCorrection: true,
      rate: true,
      dateOpen: true,
      dateClose: true,
      proccessNumber: true,
      status: true,
      processSituation: true,
      valueCredit: true,
      tipValue: true,
      createdAt: true,
      updatedAt: true,
      reasonCorrection: true,
      consultationValue: true,
      antecipationValue: true,
      publicId: true,
      Schedule: {
        select: {
          scheduleDate: true,
          scheduleHour: true,
          title: true,
          Medic: {
            select: {
              name: true,
            },
          },
        },
        where: {
          status: "active",
        },
      },
      Medic: {
        select: {
          id: true,
          name: true,
          crm: true,
          crmUf: true,
        },
      },
      Patient: {
        select: {
          id: true,
          name: true,
          surname: true,
          cpf: true,
          phone: true,
          User: {
            select: {
              id: true,
              name: true,
              oab: true,
              oabUf: true,
              officeName: true,
            },
          },
        },
      },
      Consultation: {
        select: {
          id: true,
          consultationName: true,
          value: true,
          valueCredit: true,
          valueAntecipation24: true,
          valueAntecipation48: true,
          valueAntecipation72: true,
        },
      },
      BenefitType: {
        select: {
          id: true,
          name: true,
        },
      },
      ReportPurpose: {
        select: {
          id: true,
          name: true,
        },
      },
      Sales: {
        select: {
          id: true,
          publicId: true,
          dueDate: true,
          saleId: true,
          billingType: true,
          value: true,
          netValue: true,
          status: true,
          invoiceUrl: true,
          transactionReceiptUrl: true,
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });

  const totals = await prisma.patientConsultation.groupBy({
    by: ["status"],
    _count: {
      status: true,
    },
    where: {
      dateOpen: {
        gte: new Date(initialDateSolicitation),
        lte: new Date(finalDateSolicitation),
      },
      userId: userId ? Number(userId) : undefined,
      patientId: patientId ? Number(patientId) : undefined,
      benefitTypeId: benefitTypeId ? Number(benefitTypeId) : undefined,
      reportPurposeId: reportPurposeId ? Number(reportPurposeId) : undefined,
    },
  });

  const consultations = data.map((item) => {
    const leftTime = moment().diff(moment(formatDate(item.dateOpen)), "days");

    return {
      ...item,
      isSolicitationCorrection: !item.reasonCorrection && leftTime <= 30,
      dateOpen: formatDate(item.dateOpen),
      dateClose: item.dateClose ? formatDate(item.dateClose) : null,
      dateAntecipation: item.dateAntecipation
        ? formatDate(item.dateAntecipation)
        : null,
      dateCorrection: item.dateCorrection
        ? formatDate(item.dateCorrection)
        : null,
      deadline: moment(formatDate(item.dateOpen))
        .add(30, "days")
        .format("YYYY-MM-DD"),
    };
  });

  return {
    consultations,
    totals: totals.map((item) => {
      return {
        status: item.status,
        total: item._count.status,
      };
    }),
  };
};

export const consultationCreate = async (
  payload: SolicitationConsultationProps
) => {
  try {
    return await prisma.patientConsultation.create({
      data: {
        content: String(payload.content),
        benefitTypeId: Number(payload.benefitTypeId),
        reportPurposeId: Number(payload.reportPurposeId),
        patientId: Number(payload.patientId),
        medicId: payload.medicId ? Number(payload.medicId) : undefined,
        status: "open",
        processSituation: payload.processSituation
          ? String(payload.processSituation)
          : undefined,
        proccessNumber: payload.proccessNumber
          ? String(payload.proccessNumber)
          : undefined,
        tipValue: payload.tipValue ? Number(payload.tipValue) : undefined,
        userId: Number(payload.userId),
        consultationId: Number(payload.consultationId),
        dateOpen: new Date(payload.dateOpen!),
        consultationValue: Number(payload.consultationValue ?? 0),
        valueCredit: Number(payload.valueCredit ?? 0),
        publicId: uuidv7(),
      },
    });
  } catch (error) {
    console.log("🚀 ~ error:", error);
    throw createError({
      statusCode: 500,
      message: "Error create solicitation consulta",
    });
  }
};

export const consultationUpdate = async (
  payload: SolicitationConsultationProps
) => {
  await exists(payload.publicId!);

  try {
    const dataConsultation = await prisma.patientConsultation.update({
      data: {
        content: payload.content ? payload.content : undefined,
        benefitTypeId: payload.benefitTypeId
          ? Number(payload.benefitTypeId)
          : undefined,
        reportPurposeId: payload.reportPurposeId
          ? Number(payload.reportPurposeId)
          : undefined,
        patientId: payload.patientId ? Number(payload.patientId) : undefined,
        medicId: payload.medicId ? Number(payload.medicId) : undefined,
        status: payload.status ? String(payload.status) : undefined,
        processSituation: payload.processSituation
          ? String(payload.processSituation)
          : undefined,
        proccessNumber: payload.proccessNumber
          ? String(payload.proccessNumber)
          : undefined,
        tipValue: payload.tipValue ? Number(payload.tipValue) : undefined,
        userId: payload.userId ? Number(payload.userId) : undefined,
        consultationId: payload.consultationId
          ? Number(payload.consultationId)
          : undefined,
        dateClose: payload.dateClose ? new Date(payload.dateClose) : undefined,
        dateAntecipation: payload.dateAntecipation
          ? new Date(payload.dateAntecipation)
          : undefined,
        dateCorrection: payload.dateCorrection
          ? new Date(payload.dateCorrection)
          : undefined,
        rate: payload.rate ? Number(payload.rate) : undefined,
        reasonCorrection: payload.reasonCorrection
          ? String(payload.reasonCorrection)
          : undefined,
        consultationValue: payload.consultationValue,
        antecipationValue: payload.antecipationValue,
      },
      where: {
        publicId: payload.publicId,
      },
    });

    //atualizar o agendamento para concluído
    await prisma.schedule.updateMany({
      where: {
        patientConsultationId: dataConsultation.id,
        status: "active",
      },
      data: {
        status: "scheduled",
      },
    });

    return dataConsultation;
  } catch (error) {
    console.log("🚀 ~ error:", error);
    throw createError({
      statusCode: 500,
      message: "Error update solicitation consulta",
    });
  }
};

export const consultationDestroy = async (id: string) => {
  await exists(id);
  try {
    await prisma.patientConsultation.delete({
      where: {
        publicId: id,
      },
    });
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Error remove solicitation consulta",
    });
  }
};

export const consultationShow = async (id: string) => {
  return exists(id);
};

const exists = async (id: string) => {
  const data = await prisma.patientConsultation.findFirst({
    select: {
      id: true,
      content: true,
      benefitTypeId: true,
      reportPurposeId: true,
      patientId: true,
      medicId: true,
      status: true,
      valueCredit: true,
      processSituation: true,
      proccessNumber: true,
      antecipationValue: true,
      consultationValue: true,
      dateAntecipation: true,
      dateCorrection: true,
      dateClose: true,
      dateOpen: true,
      reasonCorrection: true,
      tipValue: true,
      userId: true,
      publicId: true,
      PatientConsultationReport: {
        take: 1,
        select: {
          id: true,
          content: true,
          publicId: true,
          reportDate: true,
          Medic: {
            select: {
              id: true,
              name: true,
              email: true,
              crm: true,
              crmUf: true,
            },
          },
        },
        where: {
          status: "active",
        },
      },
      Schedule: {
        select: {
          scheduleDate: true,
          scheduleHour: true,
          title: true,
          Medic: {
            select: {
              name: true,
            },
          },
        },
        where: {
          status: "active",
        },
      },
      BenefitType: {
        select: {
          id: true,
          name: true,
        },
      },
      ReportPurpose: {
        select: {
          id: true,
          name: true,
        },
      },
      Patient: {
        select: {
          id: true,
          name: true,
          surname: true,
          cpf: true,
          phone: true,
          birthDate: true,
          email: true,
          motherName: true,
          rg: true,
          sexy: true,
          User: {
            select: {
              id: true,
              name: true,
              officeName: true,
              oab: true,
              oabUf: true,
              cpfCnpj: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      Consultation: {
        select: {
          id: true,
          consultationName: true,
          value: true,
          valueCredit: true,
          valueAntecipation24: true,
          valueAntecipation48: true,
          valueAntecipation72: true,
        },
      },
    },
    where: {
      publicId: id,
    },
  });

  if (!data) {
    throw createError({
      statusCode: 404,
      message: "Not found",
    });
  }

  return {
    ...data,
    PatientConsultationReport: data.PatientConsultationReport[0],
  };
};

export const paidConsultationCreditSalt = async (
  solicitation: SolicitationConsultationProps
) => {
  try {
    const salts = await prisma.userCredit.findMany({
      select: {
        id: true,
        publicId: true,
        status: true,
        invoiceUrl: true,
        transactionReceiptUrl: true,
        expireDate: true,
        value: true,
        salt: true,
      },
      where: {
        userId: solicitation.userId,
        status: "CONFIRMED",
        expireDate: {
          gte: new Date(), // data de expiração mair ou igual a data atual
        },
        category: "package",
        salt: {
          gt: 0, // saldo maior que zero
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    let totalCheck =
      Number(solicitation.valueCredit ?? 0) +
      Number(solicitation.antecipationValue ?? 0);

    const updateSalts = salts.map(async (userCreditItem) => {
      const currentDate = moment();

      //verificar se a data de expiração do saldo não foi expirada
      if (!moment(userCreditItem.expireDate).isBefore(currentDate)) {
        if (Number(userCreditItem.salt) >= totalCheck && totalCheck > 0) {
          // se o saldo disponível do item for maior ou igual ao total
          await prisma.userCredit.update({
            data: {
              salt: Number(userCreditItem.salt) - totalCheck,
            },
            where: {
              publicId: userCreditItem.publicId!,
            },
          });

          await prisma.userCreditLog.create({
            data: {
              userCreditId: userCreditItem.id!,
              history:
                `Saída de crédito ref. a compra de  solicitação de consulta Nª ${
                  solicitation.id
                } no valor de R$ ${totalCheck.toFixed(
                  2
                )}, saldo a descontar: ${totalCheck.toFixed(2)}`.trim(),
              type: "D",
              value: totalCheck,
            },
          });

          totalCheck = 0;
        } else if (Number(userCreditItem.salt) < totalCheck && totalCheck > 0) {
          await prisma.userCredit.update({
            data: {
              salt: 0, // se for menor então utilizar o total do saldo e zear o mesmo
            },
            where: {
              publicId: userCreditItem.publicId!,
            },
          });

          await prisma.userCreditLog.create({
            data: {
              userCreditId: userCreditItem.id!,
              history:
                `Saída de crédito ref. a compra de  solicitação de consulta Nª ${
                  solicitation.id
                } no valor de R$ ${totalCheck.toFixed(
                  2
                )}, saldo restante a descontar: ${Number(
                  userCreditItem.salt
                ).toFixed(2)}`.trim(),
              type: "D",
              value: Number(totalCheck - Number(userCreditItem.salt)),
            },
          });

          // atualizar total check para debitar o restante de outro pacote disponível
          totalCheck = totalCheck - Number(userCreditItem.salt);
        }
      }
    });

    if (updateSalts.length > 0) {
      //atualizar os saldos dos pacotes
      await Promise.all(updateSalts);

      //atualizar a solicitação para paga
      await prisma.patientConsultation.update({
        data: {
          status: "paid",
        },
        where: {
          publicId: solicitation.publicId!,
        },
      }); // atualizar status da solicitação
    }
  } catch (error) {
    console.log("🚀 ~ error:", error);
    throw createError({
      statusCode: 500,
      message: "Error paid consultation salt",
    });
  }
};
