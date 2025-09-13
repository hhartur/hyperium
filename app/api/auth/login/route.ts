import { login } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new NextResponse('Missing email or password', { status: 400 });
    }

    const sessionToken = await login(email, password);

    const response = NextResponse.json(
      { message: 'Logged in successfully' },
      { status: 200 }
    );

    response.cookies.set({
      name: 'session_token',
      value: sessionToken,
      httpOnly: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return response;
  } catch (error: any) {
    console.error(error);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}
