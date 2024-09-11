import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const reportPurposes = pgTable("report_purposes", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 200 }).notNull(),
});
