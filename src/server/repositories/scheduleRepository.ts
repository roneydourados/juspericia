import prisma from "@/lib/prisma";
import { ScheduleProps } from "@/types/Schedule";
import { uuidv7 } from "uuidv7";

export const index = async (filters: ScheduleProps) => {
  const { medicId, scheduleDate, patientId, status } = filters;

  const schedules = await prisma.schedule.findMany({
    where: {
      medicId,
      scheduleDate,
      //status: "active",
      PatientConsultation: patientId
        ? {
            patientId,
          }
        : undefined,
    },
    select: {
      id: true,
      medicId: true,
      patientConsultationId: true,
      scheduleDate: true,
      scheduleHour: true,
      title: true,
      userSchedule: true,
      publicId: true,
      status: true,
      Medic: {
        select: {
          name: true,
        },
      },
      PatientConsultation: {
        select: {
          id: true,
          status: true,
          publicId: true,
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
              sexy: true,
            },
          },
        },
      },
    },
  });

  return schedules;
};

export const create = async (payload: ScheduleProps) => {
  try {
    // primeiro cancelar qualquer agendamento aberto desta consulta
    await prisma.schedule.updateMany({
      where: {
        patientConsultationId: payload.patientConsultationId!,
        status: "active",
      },
      data: {
        status: "canceled",
      },
    });

    //depois inserir novo agendamento
    await prisma.schedule.create({
      data: {
        medicId: payload.medicId!,
        patientConsultationId: payload.patientConsultationId,
        scheduleDate: payload.scheduleDate!,
        scheduleHour: payload.scheduleHour!,
        title: payload.title!,
        userSchedule: payload.userSchedule!,
        publicId: uuidv7(),
      },
    });

    if (payload.patientConsultationId) {
      await prisma.patientConsultation.update({
        data: {
          status: "scheduled",
        },
        where: {
          id: payload.patientConsultationId,
        },
      });
    }
  } catch (error) {
    console.log("🚀 ~ create ~ error:", error);
    throw createError({
      statusCode: 500,
      message: "Error create schedule",
    });
  }
};

export const update = async (payload: ScheduleProps) => {
  const data = await exists(payload.publicId!);

  if (!data) return;

  try {
    await prisma.schedule.update({
      data: {
        medicId: payload.medicId,
        patientConsultationId: payload.patientConsultationId,
        scheduleDate: payload.scheduleDate,
        scheduleHour: payload.scheduleHour,
        title: payload.title,
        userSchedule: payload.userSchedule,
        status: payload.status,
      },
      where: {
        id: data.id,
      },
    });
  } catch (error) {
    console.log("🚀 ~ create ~ error:", error);
    throw createError({
      statusCode: 500,
      message: "Error create schedule",
    });
  }
};

export const destroy = async (id: string) => {
  const data = await exists(id);

  try {
    await prisma.schedule.delete({
      where: {
        publicId: id,
      },
    });
    if (data.patientConsultationId) {
      await prisma.patientConsultation.update({
        data: {
          status: "open",
        },
        where: {
          id: data.patientConsultationId,
        },
      });
    }
  } catch (error) {
    console.log("🚀 ~ error remove schedule:", error);
    throw createError({
      statusCode: 500,
      message: "Error to remove schedule",
    });
  }
};

export const show = async (id: string) => {
  return exists(id);
};

const exists = async (id: string) => {
  const existsData = await prisma.schedule.findFirst({
    select: {
      id: true,
      medicId: true,
      patientConsultationId: true,
      scheduleDate: true,
      scheduleHour: true,
      title: true,
      userSchedule: true,
      publicId: true,
      Medic: {
        select: {
          name: true,
        },
      },
      PatientConsultation: {
        select: {
          id: true,
          status: true,
          content: true,
          reasonCorrection: true,
          publicId: true,
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
              sexy: true,
            },
          },
        },
      },
    },
    where: {
      publicId: id,
    },
  });

  if (!existsData) {
    throw createError({
      statusCode: 404,
      message: "Schedule not found",
    });
  }

  return existsData;
};
