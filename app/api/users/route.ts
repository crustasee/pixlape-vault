import { NextRequest, NextResponse } from 'next/server';
import { db, isDatabaseConfigured } from '@/lib/db';
import { users } from '@/lib/db/schema';

/**
 * GET /api/users
 * Mengambil daftar user dari Neon Database menggunakan Drizzle Relational Queries
 */
export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error: 'Database Neon belum dikonfigurasi pada environment variable.',
      },
      { status: 503 }
    );
  }

  try {
    // Menggunakan Drizzle Relational Queries (db.query)
    const allUsers = await db.query.users.findMany({
      orderBy: (table, { desc }) => [desc(table.createdAt)],
    });

    return NextResponse.json(
      {
        success: true,
        count: allUsers.length,
        data: allUsers,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error fetching users from Neon:', error);
    const message =
      error instanceof Error ? error.message : 'Gagal mengambil data dari database';

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users
 * Menambahkan user baru ke Neon Database
 */
export async function POST(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error: 'Database Neon belum dikonfigurasi pada environment variable.',
      },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const name = body?.name?.toString()?.trim();
    const email = body?.email?.toString()?.trim()?.toLowerCase();

    if (!name || name.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: 'Field "name" wajib diisi minimal 2 karakter.',
        },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Format email tidak valid.',
        },
        { status: 400 }
      );
    }

    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: 'User berhasil dibuat.',
        data: newUser,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error creating user:', error);
    const message =
      error instanceof Error ? error.message : 'Gagal menyimpan user ke database';

    if (message.includes('unique') || message.includes('23505')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email sudah terdaftar.',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}