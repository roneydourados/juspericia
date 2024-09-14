import { relations } from "drizzle-orm";
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import patientConsultations from "./patientConsultations";

const reportPurposes = pgTable("report_purposes", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 200 }).notNull(),
});

export const reportPurposesRelations = relations(
  reportPurposes,
  ({ many }) => ({
    patientConsultations: many(patientConsultations),
  })
);

export default reportPurposes;
