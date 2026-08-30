import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DATABASE_URL_UNPOOLED ||
      process.env.DIRECT_URL ||
      process.env.DATABASE_URL ||
      "",
  },
} as any;
