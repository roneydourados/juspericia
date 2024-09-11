import {
  pgTable,
  varchar,
  timestamp,
  text,
  integer,
  index,
  serial,
  char,
  numeric,
  foreignKey,
  boolean,
  uniqueIndex,
  date,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const paymentType = pgEnum("PaymentType", [
  "CREDIT_CARD",
  "BOLETO",
  "PIX",
]);
export const profileType = pgEnum("ProfileType", [
  "ADMIN",
  "ADVOGADO",
  "MEDICO",
]);

export const prismaMigrations = pgTable("_prisma_migrations", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  checksum: varchar("checksum", { length: 64 }).notNull(),
  finishedAt: timestamp("finished_at", { withTimezone: true, mode: "string" }),
  migrationName: varchar("migration_name", { length: 255 }).notNull(),
  logs: text("logs"),
  rolledBackAt: timestamp("rolled_back_at", {
    withTimezone: true,
    mode: "string",
  }),
  startedAt: timestamp("started_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  appliedStepsCount: integer("applied_steps_count").default(0).notNull(),
});

export const address = pgTable(
  "address",
  {
    id: serial("id").primaryKey().notNull(),
    ownerId: integer("owner_id").notNull(),
    addressCategory: varchar("address_category", { length: 30 }).notNull(),
    addressZipcode: varchar("address_zipcode", { length: 20 }),
    addressCity: varchar("address_city", { length: 100 }),
    addressDistrict: varchar("address_district", { length: 100 }),
    addressStreet: varchar("address_street", { length: 100 }),
    addressNumber: varchar("address_number", { length: 10 }),
    addressState: char("address_state", { length: 2 }),
    addressComplement: varchar("address_complement", { length: 100 }),
  },
  (table) => {
    return {
      idxAddressCategory: index("address_idx_address_category").using(
        "btree",
        table.addressCategory.asc().nullsLast()
      ),
      idxAddressCity: index("address_idx_address_city").using(
        "btree",
        table.addressCity.asc().nullsLast()
      ),
      idxAddressState: index("address_idx_address_state").using(
        "btree",
        table.addressState.asc().nullsLast()
      ),
      idxOwnerId: index("address_idx_owner_id").using(
        "btree",
        table.ownerId.asc().nullsLast()
      ),
    };
  }
);

export const files = pgTable(
  "files",
  {
    id: serial("id").primaryKey().notNull(),
    ownerId: integer("owner_id").notNull(),
    fileCategory: varchar("file_category", { length: 30 }).notNull(),
    fileName: varchar("file_name", { length: 300 }).notNull(),
  },
  (table) => {
    return {
      idxFileCategory: index("files_idx_file_category").using(
        "btree",
        table.fileCategory.asc().nullsLast()
      ),
      idxOwnerId: index("files_idx_owner_id").using(
        "btree",
        table.ownerId.asc().nullsLast()
      ),
    };
  }
);

export const consultations = pgTable("consultations", {
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

export const reportPurposes = pgTable("report_purposes", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 200 }).notNull(),
});

export const reportModels = pgTable("report_models", {
  id: serial("id").primaryKey().notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
});

export const schedules = pgTable(
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
      schedulesPatientConsultationIdFkey: foreignKey({
        columns: [table.patientConsultationId],
        foreignColumns: [patientConsultations.id],
        name: "schedules_patient_consultation_id_fkey",
      }),
      schedulesUserIdFkey: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "schedules_user_id_fkey",
      }),
    };
  }
);

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey().notNull(),
  profileName: varchar("profile_name", { length: 50 }).notNull(),
  type: profileType("type").default("ADVOGADO").notNull(),
});

export const benefitTypes = pgTable("benefit_types", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 200 }).notNull(),
});

export const patients = pgTable(
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

export const patientsConsultationReports = pgTable(
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

export const profileRoutes = pgTable(
  "profile_routes",
  {
    id: serial("id").primaryKey().notNull(),
    profileId: integer("profile_id").notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    to: varchar("to", { length: 300 }).notNull(),
    icon: varchar("icon", { length: 100 }).notNull(),
    visible: boolean("visible").default(true).notNull(),
    isMenu: boolean("is_menu").default(true).notNull(),
  },
  (table) => {
    return {
      profileRoutesProfileIdFkey: foreignKey({
        columns: [table.profileId],
        foreignColumns: [profiles.id],
        name: "profile_routes_profile_id_fkey",
      }),
    };
  }
);

export const userLogCredits = pgTable(
  "user_log_credits",
  {
    id: serial("id").primaryKey().notNull(),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    userId: integer("user_id").notNull(),
    history: text("history").notNull(),
    oldValue: numeric("old_value", { precision: 18, scale: 2 })
      .default("0")
      .notNull(),
    inputValue: numeric("input_value", { precision: 18, scale: 2 })
      .default("0")
      .notNull(),
    outputValue: numeric("output_value", { precision: 18, scale: 2 })
      .default("0")
      .notNull(),
    saltValue: numeric("salt_value", { precision: 18, scale: 2 })
      .default("0")
      .notNull(),
  },
  (table) => {
    return {
      idxCreatedAt: index("user_log_credits_idx_created_at").using(
        "btree",
        table.createdAt.asc().nullsLast()
      ),
      userLogCreditsUserIdFkey: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "user_log_credits_user_id_fkey",
      }),
    };
  }
);

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
      patientConsultationsBenefitTypeIdFkey: foreignKey({
        columns: [table.benefitTypeId],
        foreignColumns: [benefitTypes.id],
        name: "patient_consultations_benefit_type_id_fkey",
      }),
      patientConsultationsConsultationIdFkey: foreignKey({
        columns: [table.consultationId],
        foreignColumns: [consultations.id],
        name: "patient_consultations_consultation_id_fkey",
      }),
      patientConsultationsMedicIdFkey: foreignKey({
        columns: [table.medicId],
        foreignColumns: [users.id],
        name: "patient_consultations_medic_id_fkey",
      }),
      patientConsultationsPatientIdFkey: foreignKey({
        columns: [table.patientId],
        foreignColumns: [patients.id],
        name: "patient_consultations_patient_id_fkey",
      }),
      patientConsultationsReportPurposeIdFkey: foreignKey({
        columns: [table.reportPurposeId],
        foreignColumns: [reportPurposes.id],
        name: "patient_consultations_report_purpose_id_fkey",
      }),
    };
  }
);

export const users = pgTable(
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
