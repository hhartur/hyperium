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
        reviews: {
          include: {
            user: {
              select: {
                username: true,
                avatar_url: true,
              },
            },
          },
        },
      },
    });

    if (!game) {
      return new NextResponse('Game not found', { status: 404 });
    }

    const reviewCount = game.reviews.length;
    const averageRating = reviewCount > 0 ? game.reviews.reduce((acc, review) => acc + review.rating, 0) / reviewCount : 0;

    if (game.rating !== averageRating) {
      await prisma.game.update({
        where: { id },
        data: { rating: averageRating },
      });
    }

    return NextResponse.json({
      ...game,
      price: game.price.toNumber(),
      discount_price: game.discount_price?.toNumber(),
      rating: averageRating,
      reviewCount: reviewCount,
    });
  } catch (error) {
    console.error('Failed to fetch game:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
