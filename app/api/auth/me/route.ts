import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      acc[name] = value;
      return acc;
    }, {});

    const sessionToken = cookies['session_token'];

    if (!sessionToken) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await getSession(sessionToken);

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
