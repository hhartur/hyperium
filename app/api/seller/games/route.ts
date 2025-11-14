// app/api/seller/games/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(_req: NextRequest) {
  const sessionToken = (await cookies()).get('session_token')?.value;

  if (!sessionToken) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const user = await getSession(sessionToken);

  if (!user || !user.email_verified) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const games = await prisma.game.findMany({
      where: {
        seller_id: user.id,
      },
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

export async function POST(req: NextRequest) {
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
      file_url,
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
        user_id: user.id, // Assuming user_id is also seller_id for simplicity
      },
    });

    return NextResponse.json(game);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
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
    const { id, ...updatedData } = body;

    if (!id) {
      return new NextResponse('Missing game ID', { status: 400 });
    }

    const existingGame = await prisma.game.findUnique({
      where: { id },
    });

    if (!existingGame || existingGame.seller_id !== user.id) {
      return new NextResponse('Unauthorized or Game not found', { status: 401 });
    }

    const game = await prisma.game.update({
      where: { id },
      data: {
        ...updatedData,
        release_date: updatedData.release_date ? new Date(updatedData.release_date) : undefined,
      },
    });

    return NextResponse.json(game);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
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
    const { gameId } = body;

    if (!gameId) {
      return new NextResponse('Missing game ID', { status: 400 });
    }

    const existingGame = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!existingGame || existingGame.seller_id !== user.id) {
      return new NextResponse('Unauthorized or Game not found', { status: 401 });
    }

    await prisma.game.delete({
      where: { id: gameId },
    });

    return NextResponse.json({ message: 'Game deleted successfully' });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}