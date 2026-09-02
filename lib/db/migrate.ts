import { config } from 'dotenv';
config({ path: '.env.local' });
config();

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

const connectionString =
  process.env.DATABASE_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.DIRECT_URL;

const main = async () => {
  if (!connectionString) {
    console.warn('⚠️ DATABASE_URL tidak ditemukan pada environment variables. Melewati tahap migrasi...');
    process.exit(0);
  }

  try {
    console.log('Memulai migrasi database ke Neon...');
    const sql = neon(connectionString);
    const db = drizzle(sql);

    // Menjalankan migrasi dari folder ./drizzle/migrations
    await migrate(db, { migrationsFolder: './drizzle/migrations' });
    console.log('✅ Migrasi database berhasil!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migrasi gagal:', error);
    process.exit(1);
  }
};

main();