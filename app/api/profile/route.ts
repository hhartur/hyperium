import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function PUT(req: Request) {
  const sessionToken = (await cookies()).get('session_token')?.value;

  if (!sessionToken) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const user = await getSession(sessionToken);

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await req.json();
    const { avatar_url } = body;

    if (!avatar_url) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        avatar_url,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}