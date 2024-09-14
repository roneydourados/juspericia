import { defineConfig } from "drizzle-kit";
import env from "./env";

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema/index.ts",
  out: "./db/migrations",
  dbCredentials: {
    url: env.DATABASE_URL, //process.env.DATABASE_URL || "",
  },
  verbose: true,
  strict: true,
});
