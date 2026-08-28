import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const getConnectionString = () =>
  process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || process.env.DIRECT_URL;

export const isDatabaseConfigured = (): boolean => {
  const conn = getConnectionString();
  return Boolean(
    conn &&
      (conn.startsWith("postgres://") || conn.startsWith("postgresql://"))
  );
};

const globalForDrizzle = globalThis as unknown as {
  pool: pg.Pool | undefined;
  db: ReturnType<typeof drizzle<typeof schema>> | undefined;
};

export const pool =
  globalForDrizzle.pool ??
  new pg.Pool({
    connectionString: getConnectionString() || undefined,
    ssl:
      process.env.NODE_ENV === "production" ||
      getConnectionString()?.includes("neon.tech") ||
      getConnectionString()?.includes("supabase.co")
        ? { rejectUnauthorized: false }
        : undefined,
  });

export const db =
  globalForDrizzle.db ??
  drizzle(pool, {
    schema,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDrizzle.pool = pool;
  globalForDrizzle.db = db;
}

export default db;
