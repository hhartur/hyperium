import { createUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, username, password } = await req.json();

    if (!email || !username || !password) {
      return new NextResponse('Missing email, username or password', { status: 400 });
    }

    const user = await createUser(email, username, password);

    return NextResponse.json(user);
  } catch (error: any) {
    if (error.message.includes('already exists') || error.message.includes('is already taken')) {
      return new NextResponse(error.message, { status: 409 });
    }
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
