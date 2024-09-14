import {
  pgTable,
  varchar,
  integer,
  serial,
  foreignKey,
  boolean,
} from "drizzle-orm/pg-core";
import profiles from "./profiles";
import { relations } from "drizzle-orm";

const profileRoutes = pgTable(
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

export const profileRoutesRelations = relations(profileRoutes, ({ one }) => ({
  Profile: one(profiles, {
    fields: [profileRoutes.profileId],
    references: [profiles.id],
  }),
}));

export default profileRoutes;
