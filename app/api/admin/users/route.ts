import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  const sessionToken = (await cookies()).get('session_token')?.value;

  if (!sessionToken) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const user = await getSession(sessionToken);

  if (!user || !user.is_admin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get('searchQuery');

    const where: any = {};

    if (searchQuery) {
      where.OR = [
        { username: { contains: searchQuery, mode: 'insensitive' } },
        { email: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(req: Request) {
  const sessionToken = (await cookies()).get('session_token')?.value;

  if (!sessionToken) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const user = await getSession(sessionToken);

  if (!user || !user.is_admin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await req.json();
    const { userId, is_admin, username, email } = body;

    if (!userId) {
      return new NextResponse('Missing userId', { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(typeof is_admin !== 'undefined' && { is_admin }),
        ...(username && { username }),
        ...(email && { email }),
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
