import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const benefitTypes = pgTable("benefit_types", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 200 }).notNull(),
});
