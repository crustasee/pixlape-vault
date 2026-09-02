/**
 * Database Entry Point (Neon Serverless + Drizzle ORM)
 *
 * File ini mengekspor instance Drizzle `db`, client Neon `sqlClient`,
 * seluruh schema tabel relasional, serta helper queries untuk API Routes dan Server Actions.
 */

export {
  db,
  sqlClient,
  sqlClient as sql,
  isDatabaseConfigured,
  getConnectionString,
} from "./drizzle";

export * from "./schema";
export * from "./card";
export * from "./article";
export * from "./team";
export * from "./server";
export { default } from "./drizzle";
