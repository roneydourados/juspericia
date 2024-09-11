import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const reportModels = pgTable("report_models", {
  id: serial("id").primaryKey().notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
});
