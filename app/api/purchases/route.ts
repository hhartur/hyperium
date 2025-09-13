import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const sessionToken = (await cookies()).get('session_token')?.value;

  if (!sessionToken) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const user = await getSession(sessionToken);

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const purchases = await prisma.purchase.findMany({
      where: {
        user_id: user.id,
      },
      include: {
        game: {
          select: { id: true, title: true, developer: true, image_url: true, file_url: true, price: true, discount_price: true },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const formattedPurchases = purchases.map(purchase => ({
      ...purchase,
      amount_paid: purchase.amount_paid.toNumber(),
      games: {
        ...purchase.game,
        price: purchase.game.price.toNumber(),
        discount_price: purchase.game.discount_price?.toNumber(),
      }
    }));

    return NextResponse.json(formattedPurchases);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
