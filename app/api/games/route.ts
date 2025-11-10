import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

type GameWhereInput = {
  is_active?: boolean;
  genre?: { has: string };
  title?: { contains: string; mode?: 'insensitive' | 'default' };
};

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
    const { 
      title, 
      description, 
      price, 
      discount_price,
      genre, 
      tags,
      developer, 
      publisher, 
      release_date,
      image_url,
      screenshots,
      video_url,
      file_url
    } = body;

    if (!title || !description || !price || !genre || !developer || !publisher || !release_date || !image_url) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const game = await prisma.game.create({
      data: {
        seller_id: user.id,
        title,
        description,
        price,
        discount_price,
        release_date: new Date(release_date),
        genre,
        tags,
        developer,
        publisher,
        image_url,
        screenshots,
        video_url,
        file_url,
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

    const where: GameWhereInput = {};

    if (category) {
      where.genre = { has: category };
    }

    if (searchQuery) {
      where.title = { contains: searchQuery, mode: 'insensitive' };
    }

    const games = await prisma.game.findMany({
      where,
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
      take: limit ? parseInt(limit, 10) : undefined,
    });

    const formattedGames = games.map(game => {
      const reviewCount = game.reviews.length;
      const averageRating = reviewCount > 0 ? game.reviews.reduce((acc, review) => acc + review.rating, 0) / reviewCount : 0;

      return {
        ...game,
        price: game.price.toNumber(),
        discount_price: game.discount_price?.toNumber(),
        rating: averageRating,
        reviewCount: reviewCount,
      };
    });

    return NextResponse.json(formattedGames);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
