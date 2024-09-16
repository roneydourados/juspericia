import {
  pgTable,
  varchar,
  timestamp,
  text,
  integer,
  index,
  serial,
  char,
  foreignKey,
  boolean,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { relations, sql } from "drizzle-orm";
import profiles from "./profiles";
import schedules from "./schedules";
import patients from "./patients";
import patientsConsultationReports from "./patientsConsultationReports";
import userLogCredits from "./userLogCredits";
import patientConsultations from "./patientConsultations";

const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey().notNull(),
    name: varchar("name", { length: 200 }).notNull(),
    email: varchar("email", { length: 1000 }).notNull(),
    password: text("password").notNull(),
    phone: varchar("phone", { length: 20 }),
    cpfCnpj: varchar("cpf_cnpj", { length: 30 }),
    oab: varchar("oab", { length: 10 }),
    oabUf: char("oab_uf", { length: 2 }),
    crm: varchar("crm", { length: 10 }),
    crmUf: char("crm_uf", { length: 2 }),
    profileId: integer("profile_id").notNull(),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", {
      precision: 3,
      mode: "string",
    }).notNull(),
    officeName: varchar("office_name", { length: 200 }),
    active: boolean("active").default(true).notNull(),
    officeCnpj: varchar("office_cnpj", { length: 30 }),
    officeEmail: varchar("office_email", { length: 1000 }),
    officePhone: varchar("office_phone", { length: 20 }),
  },
  (table) => {
    return {
      emailKey: uniqueIndex("users_email_key").using(
        "btree",
        table.email.asc().nullsLast()
      ),
      idxActive: index("users_idx_active").using(
        "btree",
        table.active.asc().nullsLast()
      ),
      idxCpfCnpj: index("users_idx_cpf_cnpj").using(
        "btree",
        table.cpfCnpj.asc().nullsLast()
      ),
      idxEmail: index("users_idx_email").using(
        "btree",
        table.email.asc().nullsLast()
      ),
      idxName: index("users_idx_name").using(
        "btree",
        table.name.asc().nullsLast()
      ),
      usersProfileIdFkey: foreignKey({
        columns: [table.profileId],
        foreignColumns: [profiles.id],
        name: "users_profile_id_fkey",
      }),
    };
  }
);

export const usersRelations = relations(users, ({ one, many }) => ({
  Schedules: many(schedules),
  Patient: many(patients),
  PatientsConsultationReports: many(patientsConsultationReports),
  UserLogCredits: many(userLogCredits),
  PatientConsultations: many(patientConsultations),
  Profile: one(profiles, {
    fields: [users.profileId],
    references: [profiles.id],
  }),
}));

export default users;
