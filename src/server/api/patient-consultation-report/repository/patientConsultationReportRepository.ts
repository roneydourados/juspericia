import prisma from "@/lib/prisma";
import { PatientConsultationReportProps } from "@/types/PatientConsultationReport";
import { uuidv7 } from "uuidv7";

export const index = async (input: {
  initialDate: string;
  finalDate: string;
  userId?: number;
}) => {
  const { finalDate, initialDate, userId } = input;

  try {
    return prisma.patientConsultationReport.findMany({
      select: {
        publicId: true,
        id: true,
        status: true,
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
        PatientConsultation: {
          select: {
            publicId: true,
            dateOpen: true,
            dateClose: true,
            Patient: {
              select: {
                name: true,
                surname: true,
                cpf: true,
              },
            },
          },
        },
      },
      where: {
        reportDate: {
          gte: new Date(initialDate),
          lte: new Date(finalDate),
        },

        AND: [
          {
            PatientConsultation: {
              userId,
            },
          },
        ],
      },
    });
  } catch (error) {
    console.log("🚀 ~ error:", error);
    throw createError({
      statusCode: 500,
      message: "Internal server error",
    });
  }
};

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
