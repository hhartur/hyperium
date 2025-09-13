import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const sessionToken = (await cookies()).get('session_token')?.value;

  if (!sessionToken) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const user = await getSession(sessionToken);

  if (!user || !user.email_verified) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, price, genre, developer, publisher, image_url } = body;

    if (!title || !description || !price || !genre || !developer || !publisher || !image_url) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const game = await prisma.game.create({
      data: {
        seller_id: user.id,
        title,
        description,
        price,
        release_date: new Date(),
        genre,
        developer,
        publisher,
        image_url,
        user_id: user.id,
      },
    });

    return NextResponse.json(game);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit');
    const category = searchParams.get('category');
    const searchQuery = searchParams.get('searchQuery');

    const where: any = { is_active: true };

    if (category) {
      where.genre = { has: category };
    }

    if (searchQuery) {
      where.title = { contains: searchQuery, mode: 'insensitive' };
    }

    const games = await prisma.game.findMany({
      where,
      orderBy: {
        created_at: 'desc',
      },
      take: limit ? parseInt(limit, 10) : undefined,
    });

    return NextResponse.json(games);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}