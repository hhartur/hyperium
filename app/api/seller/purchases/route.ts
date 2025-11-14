// app/api/seller/purchases/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(_: NextRequest) {
  const sessionToken = (await cookies()).get('session_token')?.value;

  if (!sessionToken) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const user = await getSession(sessionToken);

  if (!user || !user.email_verified) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const purchases = await prisma.purchase.findMany({
      where: {
        game: {
          seller_id: user.id,
        },
      },
      include: {
        game: {
          select: {
            title: true,
            image_url: true,
          },
        },
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const formattedPurchases = purchases.map(purchase => ({
      ...purchase,
      amount_paid: purchase.amount_paid.toNumber(),
      price: purchase.price.toNumber(),
      created_at: purchase.created_at.toISOString(),
    }));

    return NextResponse.json(formattedPurchases);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
