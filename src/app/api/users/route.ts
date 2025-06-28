import { NextResponse } from 'next/server';
import { query } from '../lib/db';
import { z } from 'zod';

// Schema for updating user role
const updateRoleSchema = z.object({
  role: z.enum(['user', 'admin'])
});

// GET /api/users
export async function GET(request: Request) {
  try {
    const users = await query(
      'SELECT id, email, phone, role, created_at, updated_at FROM users'
    ) as any[];

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Serveri viga' },
      { status: 500 }
    );
  }
}

// GET /api/users/:id
export async function getUser(request: Request, { params }: { params: { id: string } }) {
  try {
    const users = await query(
      'SELECT id, email, phone, role, created_at, updated_at FROM users WHERE id = ?',
      [params.id]
    ) as any[];

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Kasutajat ei leitud' },
        { status: 404 }
      );
    }

    return NextResponse.json(users[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Serveri viga' },
      { status: 500 }
    );
  }
}

// PATCH /api/users/:id/role
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const validatedData = updateRoleSchema.parse(body);

    await query(
      'UPDATE users SET role = ? WHERE id = ?',
      [validatedData.role, params.id]
    );

    return NextResponse.json({ message: 'Kasutaja roll on edukalt uuendatud' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error updating user role:', error);
    return NextResponse.json(
      { error: 'Serveri viga' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/:id
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await query('DELETE FROM users WHERE id = ?', [params.id]);
    return NextResponse.json({ message: 'Kasutaja on edukalt kustutatud' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Serveri viga' },
      { status: 500 }
    );
  }
}