import moment from "moment";
import { formatDate } from "~/server/utils/functionts";
import {
  SolicitationConsultationFilterProps,
  SolicitationConsultationProps,
} from "~/types/SolicitationConsultation";

import { eq, and, between, sql } from "drizzle-orm";
import { patientConsultations } from "@/db/schema";
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
      BenefitType: true,
      ReportPurpose: true,
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
    },
    where: and(
      between(
        patientConsultations.dateOpen,
        initialDateSolicitation,
        finalDateSolicitation
      ),
      userId ? eq(patientConsultations.userId, userId) : undefined,
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
      dateOpen: formatDate(new Date(item.dateOpen)),
      dateClose: item.dateClose ? formatDate(new Date(item.dateClose)) : null,
      dateAntecipation: item.dateAntecipation
        ? formatDate(new Date(item.dateAntecipation))
        : null,
      dateCorrection: item.dateCorrection
        ? formatDate(new Date(item.dateCorrection))
        : null,
      deadline: moment(formatDate(new Date(item.dateOpen)))
        .add(30, "days")
        .format("YYYY-MM-DD"),
    };
  });

  return {
    consultations,
    totals: totals.map((item) => {
      return {
        status: item.status,
        total: item._count,
      };
    }),
  };
};

export const consultationCreate = async (
  payload: SolicitationConsultationProps
) => {
  try {
    return await db.insert(patientConsultations).values({
      consultationId: payload.consultationId!,
      content: payload.content!,
      dateOpen: payload.dateOpen,
      patientId: payload.patientId!,
      proccessNumber: payload.proccessNumber
        ? payload.proccessNumber
        : undefined,
      medicId: payload.medicId ? Number(payload.medicId) : undefined,
      status: "open",
      processSituation: payload.processSituation
        ? String(payload.processSituation)
        : undefined,
      userId: payload.userId!,
      benefitTypeId: payload.benefitTypeId!,
      reportPurposeId: payload.reportPurposeId!,
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
    return await db
      .update(patientConsultations)
      .set({
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
        proccessNumber: payload.proccessNumber,
        tipValue: String(payload.tipValue ?? 0),
        userId: payload.userId,
        consultationId: payload.consultationId
          ? Number(payload.consultationId)
          : undefined,
        dateClose: payload.dateClose,
        dateAntecipation: payload.dateAntecipation,
        dateCorrection: payload.dateCorrection,
        rate: payload.rate ? Number(payload.rate) : undefined,
        reasonCorrection: payload.reasonCorrection
          ? String(payload.reasonCorrection)
          : undefined,
        consultationValue: payload.consultationValue
          ? String(payload.consultationValue)
          : undefined,
        antecipationValue: payload.antecipationValue
          ? String(payload.antecipationValue)
          : undefined,
      })
      .where(eq(patientConsultations.id, payload.id!));
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
    await db
      .delete(patientConsultations)
      .where(eq(patientConsultations.id, id));
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
  const data = await db.query.patientConsultations.findFirst({
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
      BenefitType: true,
      ReportPurpose: true,
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
    },
    where: eq(patientConsultations.id, id),
  });

  if (!exists) {
    throw createError({
      statusCode: 404,
      message: "Not found",
    });
  }

  return data;
};
