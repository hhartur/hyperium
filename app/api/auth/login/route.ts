import { login } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { setCookie } from 'cookies-next';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new NextResponse('Missing email or password', { status: 400 });
    }

    const sessionToken = await login(email, password);

    const response = new NextResponse('Logged in successfully', { status: 200 });
    setCookie('session_token', sessionToken, { req, res: response, httpOnly: process.env.NODE_ENV === 'production', secure: process.env.NODE_ENV === 'production' });

    return response;
  } catch (error: any) {
    console.error(error);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}
