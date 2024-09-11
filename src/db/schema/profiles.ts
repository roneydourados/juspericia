import { pgTable, varchar, serial } from "drizzle-orm/pg-core";

import { profileType } from "./schema";

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey().notNull(),
  profileName: varchar("profile_name", { length: 50 }).notNull(),
  type: profileType("type").default("ADVOGADO").notNull(),
});
