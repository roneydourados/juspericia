import {
  boolean,
  foreignKey,
  index,
  integer,
  pgTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import users from "./users";
import patientConsultations from "./patientConsultations";
import { relations } from "drizzle-orm";

const schedules = pgTable(
  "schedules",
  {
    id: serial("id").primaryKey().notNull(),
    userId: integer("user_id").notNull(),
    patientConsultationId: integer("patient_consultation_id"),
    start: varchar("start", { length: 30 }).notNull(),
    end: varchar("end", { length: 30 }).notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    content: text("content").notNull(),
    class: varchar("class", { length: 30 }).notNull(),
    background: boolean("background").default(false).notNull(),
    split: varchar("split", { length: 30 }).notNull(),
    allDay: boolean("allDay").default(false).notNull(),
    deletable: boolean("deletable").default(true).notNull(),
    resizable: boolean("resizable").default(true).notNull(),
    userSchedule: varchar("user_schedule", { length: 200 }).notNull(),
  },
  (table) => {
    return {
      idxEnd: index("schedules_idx_end").using(
        "btree",
        table.end.asc().nullsLast()
      ),
      idxStart: index("schedules_idx_start").using(
        "btree",
        table.start.asc().nullsLast()
      ),
      idxUserId: index("schedules_idx_user_id").using(
        "btree",
        table.userId.asc().nullsLast()
      ),
      schedulesUserIdFkey: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "schedules_user_id_fkey",
      }),
      schedulesPatientConsultationIdFkey: foreignKey({
        columns: [table.patientConsultationId],
        foreignColumns: [patientConsultations.id],
        name: "schedules_patient_consultation_id_fkey",
      }),
    };
  }
);

export const schedulesRelations = relations(schedules, ({ one }) => ({
  patientConsultation: one(patientConsultations, {
    fields: [schedules.patientConsultationId],
    references: [patientConsultations.id],
  }),
  user: one(users, {
    fields: [schedules.userId],
    references: [users.id],
  }),
}));

export default schedules;
