import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { config } from 'dotenv';

config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const main = async () => {
  try {
    console.log('Memulai migrasi database...');
    // Menjalankan migrasi dari folder ./drizzle
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Migrasi selesai!');
    process.exit(0);
  } catch (error) {
    console.error('Migrasi gagal:', error);
    process.exit(1);
  }
};

main();