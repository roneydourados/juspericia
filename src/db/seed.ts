import { profileRoutes } from "~/db/schema";
import { Table, getTableName, sql } from "drizzle-orm";
import env from "@/env";
import { db, connection } from "@/db";
import * as schema from "./schema";
import * as seeds from "./seeds";

if (!env.DB_SEEDING) {
  throw new Error('You must set DB_SEEDING to "true" when running seeds');
}

async function resetTable(db: db, table: Table) {
  return db.execute(
    sql.raw(`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`)
  );
}

for (const table of [
  schema.address,
  schema.benefitTypes,
  schema.consultations,
  schema.patientConsultations,
  schema.patients,
  schema.profileRoutes,
  schema.profiles,
  schema.reportPurposes,
  schema.users,
]) {
  // await db.delete(table); // clear tables without truncating / resetting ids
  await resetTable(db, table);
}

await seeds.profile(db);
await seeds.profileRoutes(db);
await seeds.user(db);
await seeds.patient(db);
await seeds.benefitType(db);
await seeds.reportPurpose(db);
await seeds.consultation(db);
await seeds.patientConsultations(db);
await seeds.adress(db);

await connection.end();
