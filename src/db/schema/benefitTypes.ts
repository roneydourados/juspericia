import { relations } from "drizzle-orm";
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import patientConsultations from "./patientConsultations";

const benefitTypes = pgTable("benefit_types", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 200 }).notNull(),
});

export const benefitTypesRelations = relations(benefitTypes, ({ many }) => ({
  PatientConsultations: many(patientConsultations),
}));

export default benefitTypes;
