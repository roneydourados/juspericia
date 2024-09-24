import prisma from "@/lib/prisma";
import { PatientConsultationReportProps } from "@/types/PatientConsultationReport";
import { uuidv7 } from "uuidv7";

export const create = async (payload: PatientConsultationReportProps) => {
  // verificar se já existe um laudo, se sim então descartar criar outro
  const exists = await prisma.patientConsultationReport.findFirst({
    where: {
      patientConsultationId: payload.patientConsultationId!,
      status: "active",
    },
  });

  if (exists) {
    await prisma.patientConsultationReport.update({
      where: {
        publicId: exists.publicId!,
      },
      data: {
        status: "deleted",
        userDeleted: payload.userDeleted,
        deletedAt: new Date(),
      },
    });
  }

  const data = await prisma.patientConsultationReport.create({
    data: {
      content: payload.content!,
      patientConsultationId: payload.patientConsultationId!,
      userId: payload.userId!,
      status: "active",
      publicId: uuidv7(),
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
