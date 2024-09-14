import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@/db/schema";

const { Pool } = pg;

// export const connection = new Pool({
//   connectionString: process.env.DATABASE_URL || "",
//   max: process.env.DB_MIGRATING || process.env.DB_SEEDING ? 1 : undefined,
//   //onnotice: proce.env.DB_SEEDING ? () => {} : undefined,
// });

export const connection = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: process.env.DB_MIGRATING || process.env.DB_SEEDING ? 1 : undefined,
});

export const db = drizzle(connection, { schema, logger: true });
export type db = typeof db;
export default db;
