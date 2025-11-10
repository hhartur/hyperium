import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      where: {
        is_active: true,
      },
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 4,
    });

    const formattedGames = games.map(game => {
      const totalRating = game.reviews.reduce((acc, review) => acc + review.rating, 0);
      const avgRating = game.reviews.length > 0 ? totalRating / game.reviews.length : 0;

      return {
        ...game,
        price: game.price.toNumber(), // Convert Decimal to number
        discount_price: game.discount_price?.toNumber(), // Convert Decimal to number
        avgRating: avgRating,
        reviews: undefined, // remove reviews from the final object
      };
    });

    return NextResponse.json(formattedGames);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}