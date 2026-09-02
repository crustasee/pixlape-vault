'use server';

import { revalidatePath } from 'next/cache';
import { db, isDatabaseConfigured } from '@/lib/db';
import { users, type UserSelect } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export interface ActionResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

/**
 * Server Action: Menambahkan user baru melalui FormData (form submission standard Next.js)
 */
export async function createUser(formData: FormData): Promise<ActionResponse<UserSelect>> {
  const name = formData.get('name')?.toString()?.trim();
  const email = formData.get('email')?.toString()?.trim()?.toLowerCase();

  return createUserAction({ name: name || '', email: email || '' });
}

/**
 * Server Action: Menambahkan user baru dengan typed parameter object
 */
export async function createUserAction(payload: {
  name: string;
  email: string;
}): Promise<ActionResponse<UserSelect>> {
  const { name, email } = payload;

  if (!name || name.length < 2) {
    return {
      success: false,
      message: 'Nama wajib diisi minimal 2 karakter.',
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return {
      success: false,
      message: 'Alamat email tidak valid.',
    };
  }

  if (!isDatabaseConfigured()) {
    return {
      success: false,
      message: 'Koneksi database Neon belum dikonfigurasi pada environment variable.',
    };
  }

  try {
    // Mengeksekusi query insert ke Neon Database menggunakan Drizzle ORM
    const [insertedUser] = await db
      .insert(users)
      .values({
        name,
        email,
      })
      .returning();

    // Invalidate cache halaman agar data terbaru langsung ter-render
    revalidatePath('/users');

    return {
      success: true,
      message: 'User berhasil ditambahkan ke database!',
      data: insertedUser,
    };
  } catch (error: unknown) {
    console.error('Gagal menambahkan user:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Terjadi kesalahan pada database.';

    // Penanganan duplikasi email pada database Postgres (unique constraint error 23505)
    if (errorMessage.includes('unique') || errorMessage.includes('23505')) {
      return {
        success: false,
        message: 'Email sudah terdaftar. Silakan gunakan email lain.',
      };
    }

    return {
      success: false,
      message: 'Gagal menambahkan user ke database.',
      error: errorMessage,
    };
  }
}

/**
 * Server Action: Mengambil seluruh user dari database
 */
export async function getUsersAction(): Promise<ActionResponse<UserSelect[]>> {
  if (!isDatabaseConfigured()) {
    return {
      success: false,
      message: 'Database belum dikonfigurasi.',
      data: [],
    };
  }

  try {
    // Drizzle Relational Queries findMany dengan order descending createdAt
    const allUsers = await db.query.users.findMany({
      orderBy: (table, { desc }) => [desc(table.createdAt)],
    });

    return {
      success: true,
      message: 'Data user berhasil diambil.',
      data: allUsers,
    };
  } catch (error: unknown) {
    console.error('Gagal mengambil data user:', error);
    return {
      success: false,
      message: 'Gagal mengambil data user dari database.',
      error: error instanceof Error ? error.message : String(error),
      data: [],
    };
  }
}

/**
 * Server Action: Menghapus user berdasarkan ID
 */
export async function deleteUserAction(id: number): Promise<ActionResponse<void>> {
  if (!isDatabaseConfigured()) {
    return { success: false, message: 'Database belum dikonfigurasi.' };
  }

  try {
    await db.delete(users).where(eq(users.id, id));
    revalidatePath('/users');
    return { success: true, message: 'User berhasil dihapus.' };
  } catch (error: unknown) {
    console.error('Gagal menghapus user:', error);
    return {
      success: false,
      message: 'Gagal menghapus user dari database.',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}