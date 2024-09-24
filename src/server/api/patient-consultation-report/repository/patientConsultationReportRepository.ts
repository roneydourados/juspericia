import prisma from "@/lib/prisma";
import { PatientConsultationReportProps } from "@/types/PatientConsultationReport";
import { uuidv7 } from "uuidv7";

export const create = async (payload: PatientConsultationReportProps) => {
  if (payload.publicId) {
    const exists = await prisma.patientConsultationReport.findFirst({
      where: {
        publicId: payload.publicId,
      },
    });

    if (exists) {
      await prisma.patientConsultationReport.update({
        where: {
          publicId: payload.publicId,
        },
        data: {
          status: "deleted",
          userDeleted: payload.userDeleted,
          deletedAt: new Date(),
        },
      });
    }
  }

  const data = await prisma.patientConsultationReport.create({
    data: {
      content: payload.content!,
      status: "active",
      userId: payload.userId!,
      publicId: uuidv7(),
      patientConsultationId: payload.patientConsultationId!,
    },
  });

  return data;
};

export const show = async (publicId: string) => {
  const data = await prisma.patientConsultationReport.findFirst({
    select: {
      content: true,
      patientConsultationId: true,
      publicId: true,
      userId: true,
      Medic: {
        select: {
          id: true,
          name: true,
          email: true,
          crm: true,
          crmUf: true,
        },
      },
      PatientConsultation: {
        select: {
          id: true,
          status: true,
          content: true,
          proccessNumber: true,
          dateClose: true,
          dateOpen: true,
          dateAntecipation: true,
          dateCorrection: true,
          processSituation: true,
          consultationValue: true,
          rate: true,
          publicId: true,
          Patient: {
            select: {
              id: true,
              name: true,
              cpf: true,
              email: true,
              phone: true,
            },
          },
        },
      },
    },
    where: {
      publicId,
    },
  });

  if (!data) {
    throw createError({
      statusCode: 404,
      message: "Report not found",
    });
  }

  return data;
};
