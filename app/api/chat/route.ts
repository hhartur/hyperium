// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const purchaseId = searchParams.get('purchaseId');

  if (!purchaseId) {
    return NextResponse.json({ error: 'Purchase ID not provided' }, { status: 400 });
  }

  try {
    const messages = await prisma.message.findMany({
      where: { purchase_id: purchaseId },
      include: {
        sender: {
          select: {
            username: true,
            avatar_url: true,
          },
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    return NextResponse.json(messages);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}




