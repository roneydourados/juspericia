import { pgTable, varchar, serial } from "drizzle-orm/pg-core";

import { profileType } from "./databaseTypes";
import { relations } from "drizzle-orm";
import profileRoutes from "./profileRoutes";
import users from "./users";

const profiles = pgTable("profiles", {
  id: serial("id").primaryKey().notNull(),
  profileName: varchar("profile_name", { length: 50 }).notNull(),
  type: profileType("type").default("ADVOGADO").notNull(),
});

export const profilesRelations = relations(profiles, ({ many }) => ({
  profileRoutes: many(profileRoutes),
  users: many(users),
}));

export default profiles;
