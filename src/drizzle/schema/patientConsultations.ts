import { sql } from "drizzle-orm";
import {
  date,
  foreignKey,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { patients } from "./patients";
import { consultations } from "./consultations";
import { reportPurposes } from "./reportPurposes";
import { benefitTypes } from "./benefitTypes";
import { users } from "./users";

export const patientConsultations = pgTable(
  "patient_consultations",
  {
    id: serial("id").primaryKey().notNull(),
    patientId: integer("patient_id").notNull(),
    userId: integer("user_id").notNull(),
    medicId: integer("medic_id"),
    consultationId: integer("consultation_id").notNull(),
    content: text("content").notNull(),
    benefitTypeId: integer("benefit_type_id").notNull(),
    proccessNumber: varchar("proccess_number", { length: 30 }),
    processSituation: varchar("process_situation", { length: 2 }),
    reportPurposeId: integer("report_purpose_id").notNull(),
    status: varchar("status", { length: 30 }).default("open").notNull(),
    tipValue: numeric("tip_value", { precision: 18, scale: 2 })
      .default("0")
      .notNull(),
    dateClose: date("date_close"),
    dateOpen: date("date_open")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    rate: integer("rate").default(0),
    dateAntecipation: date("date_antecipation"),
    dateCorrection: date("date_correction"),
  },
  (table) => {
    return {
      patientConsultationsPatientIdFkey: foreignKey({
        columns: [table.patientId],
        foreignColumns: [patients.id],
        name: "patient_consultations_patient_id_fkey",
      }),
      patientConsultationsConsultationIdFkey: foreignKey({
        columns: [table.consultationId],
        foreignColumns: [consultations.id],
        name: "patient_consultations_consultation_id_fkey",
      }),
      patientConsultationsReportPurposeIdFkey: foreignKey({
        columns: [table.reportPurposeId],
        foreignColumns: [reportPurposes.id],
        name: "patient_consultations_report_purpose_id_fkey",
      }),
      patientConsultationsBenefitTypeIdFkey: foreignKey({
        columns: [table.benefitTypeId],
        foreignColumns: [benefitTypes.id],
        name: "patient_consultations_benefit_type_id_fkey",
      }),
      patientConsultationsMedicIdFkey: foreignKey({
        columns: [table.medicId],
        foreignColumns: [users.id],
        name: "patient_consultations_medic_id_fkey",
      }),
    };
  }
);
