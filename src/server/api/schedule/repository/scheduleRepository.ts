import prisma from "@/lib/prisma";
import { ScheduleProps } from "~/types/Schedule";

export const index = async (filters: ScheduleProps) => {
  const { medicId, scheduleDate, patientId } = filters;

  const schedules = await prisma.schedule.findMany({
    where: {
      medicId,
      scheduleDate,
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
      Medic: {
        select: {
          name: true,
        },
      },
      PatientConsultation: {
        select: {
          id: true,
          status: true,
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
    await prisma.schedule.create({
      data: {
        medicId: payload.medicId!,
        patientConsultationId: payload.patientConsultationId,
        scheduleDate: payload.scheduleDate!,
        scheduleHour: payload.scheduleHour!,
        title: payload.title!,
        userSchedule: payload.userSchedule!,
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
  await exists(payload.id!);
  try {
    await prisma.schedule.update({
      data: {
        medicId: payload.medicId!,
        patientConsultationId: payload.patientConsultationId,
        scheduleDate: payload.scheduleDate!,
        scheduleHour: payload.scheduleHour!,
        title: payload.title!,
        userSchedule: payload.userSchedule!,
      },
      where: {
        id: payload.id!,
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

export const destroy = async (id: number) => {
  const data = await exists(id);

  try {
    await prisma.schedule.delete({
      where: {
        id,
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

export const show = async (id: number) => {
  return exists(id);
};

const exists = async (id: number) => {
  const existsData = await prisma.schedule.findFirst({
    select: {
      id: true,
      medicId: true,
      patientConsultationId: true,
      scheduleDate: true,
      scheduleHour: true,
      title: true,
      userSchedule: true,
      Medic: {
        select: {
          name: true,
        },
      },
      PatientConsultation: {
        select: {
          id: true,
          status: true,
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
      id,
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
