// app/api/purchases/[purchaseId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest, { params }: { params: Promise<{ purchaseId: string }> }) {
  const sessionToken = (await cookies()).get('session_token')?.value;

  if (!sessionToken) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const user = await getSession(sessionToken);

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const awaitedParams = await params;
  const { purchaseId } = awaitedParams;

  try {
    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
      include: {
        game: {
          select: {
            title: true,
            image_url: true,
            seller_id: true, // Include seller_id to check authorization
          },
        },
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!purchase) {
      return new NextResponse('Purchase not found', { status: 404 });
    }

    // Check if the logged-in user is either the buyer or the seller
    if (purchase.user_id !== user.id && purchase.game.seller_id !== user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formattedPurchase = {
      ...purchase,
      amount_paid: purchase.amount_paid.toNumber(),
      price: purchase.price.toNumber(),
      created_at: purchase.created_at.toISOString(),
    };

    // Fetch seller details
    const seller = await prisma.user.findUnique({
      where: { id: purchase.game.seller_id },
      select: { 
        id: true,
        username: true 
      },
    });

    return NextResponse.json({
      ...formattedPurchase,
      seller: seller, // Add seller details to the response
    });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
