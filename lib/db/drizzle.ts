import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

export const isDatabaseConfigured = (): boolean => {
  return Boolean(
    connectionString &&
      (connectionString.startsWith("postgres://") ||
        connectionString.startsWith("postgresql://"))
  );
};

const globalForDrizzle = globalThis as unknown as {
  pool: pg.Pool | undefined;
  db: ReturnType<typeof drizzle<typeof schema>> | undefined;
};

export const pool =
  globalForDrizzle.pool ??
  new pg.Pool({
    connectionString: connectionString || undefined,
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
