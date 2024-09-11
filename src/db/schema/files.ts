import { pgTable, varchar, integer, index, serial } from "drizzle-orm/pg-core";

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
