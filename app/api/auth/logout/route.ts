import { deleteSession } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { getCookie, deleteCookie } from 'cookies-next';

export async function POST(req: Request) {
  try {
    const sessionToken = getCookie('session_token', { req });

    if (sessionToken) {
      await deleteSession(sessionToken);
    }

    const response = new NextResponse('Logged out successfully', { status: 200 });
    deleteCookie('session_token', { req, res: response });

    return response;
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
