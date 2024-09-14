import { relations } from "drizzle-orm";
import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import patientsConsultationReports from "./patientsConsultationReports";

const reportModels = pgTable("report_models", {
  id: serial("id").primaryKey().notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
});

export const reportModelsRelations = relations(reportModels, ({ many }) => ({
  PatientsConsultationReports: many(patientsConsultationReports),
}));

export default reportModels;
