// app/api/games/get-game/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return new NextResponse('Missing game id', { status: 400 });
    }

    const game = await prisma.game.findUnique({
      where: { id, is_active: true },
      include: {
        seller: { select: { username: true, avatar_url: true } },
      },
    });

    if (!game) {
      return new NextResponse('Game not found', { status: 404 });
    }

    return NextResponse.json({
      ...game,
      price: game.price.toNumber(),
      discount_price: game.discount_price?.toNumber(),
    });
  } catch (error) {
    console.error('Failed to fetch game:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
