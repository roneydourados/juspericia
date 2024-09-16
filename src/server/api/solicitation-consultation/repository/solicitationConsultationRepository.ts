//import prisma from "@/lib/prisma";
import moment from "moment";
import { formatDate } from "~/server/utils/functionts";
import {
  SolicitationConsultationFilterProps,
  SolicitationConsultationProps,
} from "~/types/SolicitationConsultation";

import {
  eq,
  and,
  or,
  ilike,
  inArray,
  asc,
  between,
  sum,
  sql,
} from "drizzle-orm";
import { users, profiles, patientConsultations } from "@/db/schema";
import { db } from "@/db";

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

  const data = await db.query.patientConsultations.findMany({
    where: and(
      between(
        patientConsultations.dateOpen,
        initialDateSolicitation,
        finalDateSolicitation
      ),
      eq(patientConsultations.userId, userId ?? 0),
      eq(patientConsultations.status, status),
      patientId ? eq(patientConsultations.patientId, patientId) : undefined,
      benefitTypeId
        ? eq(patientConsultations.benefitTypeId, benefitTypeId)
        : undefined,
      reportPurposeId
        ? eq(patientConsultations.reportPurposeId, reportPurposeId)
        : undefined
    ),
    // where: {
    //   dateOpen: {
    //     gte: new Date(initialDateSolicitation),
    //     lte: new Date(finalDateSolicitation),
    //   },
    //   userId,
    //   status,
    //   patientId: patientId ? patientId : undefined,
    //   benefitTypeId: benefitTypeId ? benefitTypeId : undefined,
    //   reportPurposeId: reportPurposeId ? reportPurposeId : undefined,
    // },
    with: {
      Medic: {
        columns: {
          id: true,
          name: true,
          crm: true,
          crmUf: true,
        },
      },
      Consultation: {
        columns: {
          id: true,
          consultationName: true,
          value: true,
          valueCredit: true,
          valueAntecipation24: true,
          valueAntecipation48: true,
          valueAntecipation72: true,
        },
      },
      Patient: {
        columns: {
          id: true,
          name: true,
          surname: true,
          cpf: true,
          phone: true,
        },
        with: {
          User: {
            columns: {
              id: true,
              name: true,
              oab: true,
              oabUf: true,
              officeName: true,
            },
          },
        },
      },
    },
    columns: {
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
      content: true,
      reasonCorrection: true,

      // Consultation: {
      //   select: {
      //     id: true,
      //     consultationName: true,
      //     value: true,
      //     valueCredit: true,
      //     valueAntecipation24: true,
      //     valueAntecipation48: true,
      //     valueAntecipation72: true,
      //   },
      // },
      // BenefitType: {
      //   select: {
      //     id: true,
      //     name: true,
      //   },
      // },
      // ReportPurpose: {
      //   select: {
      //     id: true,
      //     name: true,
      //   },
      // },
    },
  });

  if (data.length === 0) {
    return [];
  }

  const totals = await db
    .select({
      status: patientConsultations.status,
      _count: sql<number>`cast(count(${patientConsultations.status}) as integer)`,
    })
    .from(patientConsultations)
    .where(
      and(
        between(
          patientConsultations.dateOpen,
          initialDateSolicitation,
          finalDateSolicitation
        ),
        patientId ? eq(patientConsultations.patientId, patientId) : undefined,
        benefitTypeId
          ? eq(patientConsultations.benefitTypeId, benefitTypeId)
          : undefined,
        reportPurposeId
          ? eq(patientConsultations.reportPurposeId, reportPurposeId)
          : undefined
      )
    )
    .groupBy(patientConsultations.status);
  // const totals = await prisma.patientConsultation.groupBy({
  //   by: ["status"],
  //   _count: {
  //     status: true,
  //   },
  //   where: {
  //     dateOpen: {
  //       gte: new Date(initialDateSolicitation),
  //       lte: new Date(finalDateSolicitation),
  //     },
  //     patientId: patientId ? patientId : undefined,
  //     benefitTypeId: benefitTypeId ? benefitTypeId : undefined,
  //     reportPurposeId: reportPurposeId ? reportPurposeId : undefined,
  //   },
  // });

  const consultations = data.map((item) => {
    const leftTime = moment().diff(
      moment(formatDate(new Date(item.dateOpen))),
      "days"
    );

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
        id: payload.id,
      },
    });
  } catch (error) {
    console.log("🚀 ~ error:", error);
    throw createError({
      statusCode: 500,
      message: "Error update solicitation consulta",
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
      antecipationValue: true,
      consultationValue: true,
      dateAntecipation: true,
      dateCorrection: true,
      dateClose: true,
      dateOpen: true,
      reasonCorrection: true,
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
          valueAntecipation24: true,
          valueAntecipation48: true,
          valueAntecipation72: true,
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
