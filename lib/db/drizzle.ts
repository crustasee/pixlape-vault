import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Mengambil database connection string dari environment variables.
 * Prioritas: DATABASE_URL -> DATABASE_URL_UNPOOLED -> DIRECT_URL
 */
export const getConnectionString = (): string =>
  process.env.DATABASE_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.DIRECT_URL ||
  "";

/**
 * Mengecek apakah konfigurasi database sudah valid untuk query runtime.
 */
export const isDatabaseConfigured = (): boolean => {
  const conn = getConnectionString();
  return Boolean(
    conn &&
      (conn.startsWith("postgres://") || conn.startsWith("postgresql://")) &&
      !conn.includes("ep-placeholder")
  );
};

// Fallback placeholder URL agar tidak crash saat Next.js build-time / CI ketika ENV belum diset
const activeConnectionString =
  getConnectionString() || "postgresql://placeholder:dummy@ep-placeholder.neon.tech/neondb";

const globalForDrizzle = globalThis as unknown as {
  neonSql: NeonQueryFunction<false, false> | undefined;
  db: NeonHttpDatabase<typeof schema> | undefined;
};

/**
 * HTTP-based Serverless Neon SQL client.
 * Stateless, tidak membuka persistent TCP connection, bebas connection exhaustion pada serverless functions.
 */
export const sqlClient = globalForDrizzle.neonSql ?? neon(activeConnectionString);

/**
 * Drizzle ORM instance yang dikonfigurasi dengan Neon HTTP driver dan schema relasional.
 * Mendukung query builder biasa (db.select, db.insert) dan Relational Queries (db.query.*).
 */
export const db =
  globalForDrizzle.db ??
  drizzle(sqlClient, {
    schema,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDrizzle.neonSql = sqlClient;
  globalForDrizzle.db = db;
}

/**
 * Kompatibilitas mundur untuk skrip yang sebelumnya menggunakan pg.Pool (seperti seed.ts).
 * Neon HTTP driver stateless sehingga tidak memerlukan penutupan pool.
 */
export const pool = {
  end: async () => Promise.resolve(),
};

export default db;
