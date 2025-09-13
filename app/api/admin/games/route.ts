import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { cookies } from 'next/headers';

type GameWhereInput = {
  OR?: GameWhereInput[];
  title?: { contains: string; mode?: 'insensitive' | 'default' };
  developer?: { contains: string; mode?: 'insensitive' | 'default' };
  is_active?: boolean;
};

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

    const where: GameWhereInput = {};

    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { developer: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    const games = await prisma.game.findMany({
      where,
      orderBy: {
        created_at: 'desc',
      },
    });

    const formattedGames = games.map(game => ({
      ...game,
      price: game.price.toNumber(),
      discount_price: game.discount_price?.toNumber(),
    }));

    return NextResponse.json(formattedGames);
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
    const { gameId, is_active } = body;

    if (!gameId || typeof is_active === 'undefined') {
      return new NextResponse('Missing gameId or is_active', { status: 400 });
    }

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: { is_active },
    });

    return NextResponse.json(updatedGame);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}