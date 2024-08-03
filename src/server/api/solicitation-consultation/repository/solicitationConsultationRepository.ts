import { prisma } from "@/server/providers/prisma";
import { SolicitationConsultationProps } from "~/types/SolicitationConsultation";

export const index = async () => {
  try {
    return await prisma.patientConsultation.findMany({
      select: {
        dateOpen: true,
        dateClose: true,
        proccessNumber: true,
        status: true,
        processSituation: true,
        tipValue: true,
        Medic: {
          select: {
            name: true,
            crm: true,
            crmUf: true,
          },
        },
        Patient: {
          select: {
            name: true,
            surname: true,
            cpf: true,
            phone: true,
            User: {
              select: {
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
            consultationName: true,
            value: true,
            valueCredit: true,
            valueAntecipation: true,
          },
        },
        BenefitType: {
          select: {
            name: true,
          },
        },
        ReportPurpose: {
          select: {
            name: true,
          },
        },
      },
    });
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Error list solicitation consulta",
    });
  }
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
        tipValue: payload.tipValue ? Number(payload.tipValue) : undefined,
        userId: Number(payload.userId),
        consultationId: Number(payload.consultationId),
        dateOpen: new Date(payload.dateOpen!),
      },
    });
  } catch (error) {
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
        tipValue: payload.tipValue ? Number(payload.tipValue) : undefined,
        userId: payload.userId,
        consultationId: payload.consultationId,
        dateClose: payload.dateClose,
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
          User: {
            select: {
              name: true,
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
