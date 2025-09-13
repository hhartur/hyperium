import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      where: {
        is_active: true,
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 4,
    });

    const formattedGames = games.map(game => ({
      ...game,
      price: game.price.toNumber(), // Convert Decimal to number
      discount_price: game.discount_price?.toNumber(), // Convert Decimal to number
    }));

    return NextResponse.json(formattedGames);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}