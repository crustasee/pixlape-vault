import { neon, NeonQueryFunction } from '@neondatabase/serverless';

const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.DIRECT_URL ||
  '';

export const getNeonClient = (): NeonQueryFunction<false, false> | null => {
  if (!databaseUrl) {
    console.warn('⚠️ DATABASE_URL is not configured for Neon client.');
    return null;
  }
  return neon(databaseUrl);
};

export const neonClient = databaseUrl ? neon(databaseUrl) : null;

export default neonClient;