import { relations, sql } from "drizzle-orm";
import {
  numeric,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import patientConsultations from "./patientConsultations";

const consultations = pgTable("consultations", {
  id: serial("id").primaryKey().notNull(),
  consultationName: varchar("consultation_name", { length: 200 }).notNull(),
  createdAt: timestamp("created_at", { precision: 3, mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", {
    precision: 3,
    mode: "string",
  }).notNull(),
  value: numeric("value", { precision: 18, scale: 2 }).notNull(),
  valueAntecipation: numeric("value_antecipation", {
    precision: 18,
    scale: 2,
  }).notNull(),
  valueCredit: numeric("value_credit", { precision: 18, scale: 2 }).notNull(),
  valuePacket: numeric("value_packet", { precision: 18, scale: 2 }).notNull(),
});

export const consultationsRelations = relations(consultations, ({ many }) => ({
  PatientConsultation: many(patientConsultations),
}));

export default consultations;
