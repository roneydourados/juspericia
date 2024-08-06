import { prisma } from "@/server/providers/prisma";
import moment from "moment";
import { formatDate } from "~/server/utils/functionts";
import { SolicitationConsultationProps } from "~/types/SolicitationConsultation";

export const index = async () => {
  const data = await prisma.patientConsultation.findMany({
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
      tipValue: true,
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
          valueAntecipation: true,
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
    },
    orderBy: {
      id: "desc",
    },
  });

  return data.map((item) => {
    return {
      ...item,
      dateOpen: formatDate(item.dateOpen),
      dateClose: item.dateClose ? formatDate(item.dateClose) : null,
      dateAntecipation: item.dateAntecipation
        ? formatDate(item.dateAntecipation)
        : null,
      dateCorrection: item.dateCorrection
        ? formatDate(item.dateCorrection)
        : null,
      deadline: moment(item.dateOpen).add(30, "days").format("YYYY-MM-DD"),
    };
  });
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
  await exists(payload.id!);
  try {
    return await prisma.patientConsultation.update({
      data: {
        content: payload.content,
        benefitTypeId: payload.benefitTypeId,
        reportPurposeId: payload.reportPurposeId,
        patientId: payload.patientId,
        medicId: payload.medicId ? Number(payload.medicId) : undefined,
        status: payload.status,
        processSituation: payload.processSituation
          ? String(payload.processSituation)
          : undefined,
        proccessNumber: payload.proccessNumber
          ? String(payload.proccessNumber)
          : undefined,
        tipValue: payload.tipValue ? Number(payload.tipValue) : undefined,
        userId: payload.userId,
        consultationId: payload.consultationId,
        dateClose: payload.dateClose,
        dateAntecipation: payload.dateAntecipation,
        dateCorrection: payload.dateCorrection,
        rate: payload.rate,
      },
      where: {
        id: payload.id,
      },
    });
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Error create solicitation consulta",
    });
  }
};

export const consultationDestroy = async (id: number) => {
  await exists(id);
  try {
    await prisma.patientConsultation.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Error remove solicitation consulta",
    });
  }
};

export const consultationShow = async (id: number) => {
  return exists(id);
};

const exists = async (id: number) => {
  const data = await prisma.patientConsultation.findFirst({
    select: {
      id: true,
      content: true,
      benefitTypeId: true,
      reportPurposeId: true,
      patientId: true,
      medicId: true,
      status: true,
      processSituation: true,
      proccessNumber: true,
      tipValue: true,
      userId: true,
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
          valueAntecipation: true,
        },
      },
    },
    where: {
      id,
    },
  });

  if (!exists) {
    throw createError({
      statusCode: 404,
      message: "Not found",
    });
  }

  return data;
};
