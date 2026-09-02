"use server";

import { neon } from "@neondatabase/serverless";

const getDatabaseUrl = () =>
  process.env.DATABASE_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.DIRECT_URL;

export async function getNeonSql() {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }
  return neon(databaseUrl);
}

export async function getData() {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) {
    console.warn("⚠️ DATABASE_URL is not set for getData");
    return [];
  }
  const sql = neon(databaseUrl);
  const data = await sql`SELECT 1 as connected`;
  return data;
}