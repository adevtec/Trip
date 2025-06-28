import { NextResponse } from 'next/server';
import { z } from 'zod';
import { 
  registerUser, 
  loginUser, 
  registerSchema, 
  loginSchema 
} from '../../../services/auth/authService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type } = body;

    if (type === 'register') {
      try {
        const validatedData = registerSchema.parse(body);
        const result = await registerUser(validatedData);
        return NextResponse.json(result);
      } catch (error) {
        if (error instanceof Error) {
          return NextResponse.json(
            { error: error.message },
            { status: 400 }
          );
        }
        throw error;
      }
    } else if (type === 'login') {
      try {
        const validatedData = loginSchema.parse(body);
        const result = await loginUser(validatedData);
        return NextResponse.json(result);
      } catch (error) {
        if (error instanceof Error) {
          return NextResponse.json(
            { error: error.message },
            { status: 401 }
          );
        }
        throw error;
      }
    }

    return NextResponse.json(
      { error: 'Vale päring' },
      { status: 400 }
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Serveri viga' },
      { status: 500 }
    );
  }
}
