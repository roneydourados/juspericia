import { relations, sql } from "drizzle-orm";
import {
  char,
  foreignKey,
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import users from "./users";
import patientConsultations from "./patientConsultations";

const patients = pgTable(
  "patients",
  {
    id: serial("id").primaryKey().notNull(),
    userId: integer("user_id").notNull(),
    name: varchar("name", { length: 200 }).notNull(),
    email: varchar("email", { length: 1000 }),
    motherName: varchar("mother_name", { length: 200 }),
    phone: varchar("phone", { length: 20 }),
    cpf: varchar("cpf", { length: 30 }).notNull(),
    rg: varchar("rg", { length: 30 }).notNull(),
    status: varchar("status", { length: 1 }).default("A").notNull(),
    sexy: char("sexy", { length: 1 }).notNull(),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    surname: varchar("surname", { length: 200 }).notNull(),
    updatedAt: timestamp("updated_at", {
      precision: 3,
      mode: "string",
    }).notNull(),
    birthDate: varchar("birth_date", { length: 10 }).notNull(),
  },
  (table) => {
    return {
      cpfKey: uniqueIndex("patients_cpf_key").using(
        "btree",
        table.cpf.asc().nullsLast()
      ),
      idxCpf: index("patients_idx_cpf").using(
        "btree",
        table.cpf.asc().nullsLast()
      ),
      idxEmail: index("patients_idx_email").using(
        "btree",
        table.email.asc().nullsLast()
      ),
      idxName: index("patients_idx_name").using(
        "btree",
        table.name.asc().nullsLast()
      ),
      rgKey: uniqueIndex("patients_rg_key").using(
        "btree",
        table.rg.asc().nullsLast()
      ),
      patientsUserIdFkey: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "patients_user_id_fkey",
      }),
    };
  }
);

export const patientsRelations = relations(patients, ({ one, many }) => ({
  User: one(users, {
    fields: [patients.userId],
    references: [users.id],
  }),
  PatientConsultation: many(patientConsultations),
}));

export default patients;
