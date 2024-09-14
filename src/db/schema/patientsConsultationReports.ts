import {
  date,
  foreignKey,
  integer,
  pgTable,
  serial,
  text,
} from "drizzle-orm/pg-core";
import users from "./users";
import reportModels from "./reportModels";
import patientConsultations from "./patientConsultations";
import { relations } from "drizzle-orm";

const patientsConsultationReports = pgTable(
  "patients_consultation_reports",
  {
    id: serial("id").primaryKey().notNull(),
    userId: integer("user_id").notNull(),
    patientConsultationId: integer("patient_consultation_id").notNull(),
    reportModelId: integer("report_model_id"),
    content: text("content").notNull(),
    dateLimitCorrection: date("date_limit_correction").notNull(),
  },
  (table) => {
    return {
      patientsConsultationReportsPatientConsultationIdFkey: foreignKey({
        columns: [table.patientConsultationId],
        foreignColumns: [patientConsultations.id],
        name: "patients_consultation_reports_patient_consultation_id_fkey",
      }),
      patientsConsultationReportsReportModelIdFkey: foreignKey({
        columns: [table.reportModelId],
        foreignColumns: [reportModels.id],
        name: "patients_consultation_reports_report_model_id_fkey",
      }),
      patientsConsultationReportsUserIdFkey: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "patients_consultation_reports_user_id_fkey",
      }),
    };
  }
);

export const patientsConsultationReportsRelations = relations(
  patientsConsultationReports,
  ({ one }) => ({
    PatientConsultation: one(patientConsultations, {
      fields: [patientsConsultationReports.patientConsultationId],
      references: [patientConsultations.id],
    }),
    ReportModel: one(reportModels, {
      fields: [patientsConsultationReports.reportModelId],
      references: [reportModels.id],
    }),
    Medic: one(users, {
      fields: [patientsConsultationReports.userId],
      references: [users.id],
    }),
  })
);

export default patientsConsultationReports;
