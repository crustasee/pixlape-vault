import dotenv from "dotenv";
import type { Config } from "drizzle-kit";

dotenv.config({ path: ".env.local" });
dotenv.config();

const config: Config = {
  schema: "./lib/db/schema.ts",
  out: "./drizzle/migrations",
  connectionString:
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.DIRECT_URL ||
    process.env.DATABASE_URL ||
    "",
};

export default config;




