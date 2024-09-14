import { relations, sql } from "drizzle-orm";
import {
  foreignKey,
  index,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import users from "./users";

const userLogCredits = pgTable(
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

export const userLogCreditsRelations = relations(userLogCredits, ({ one }) => ({
  user: one(users, {
    fields: [userLogCredits.userId],
    references: [users.id],
  }),
}));

export default userLogCredits;
