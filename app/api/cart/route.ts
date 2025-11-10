import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "User not provided" }, { status: 400 });

  try {
    const items = await prisma.cart.findMany({
      where: { user_id: userId },
      include: {
        game: {
          select: {
            id: true,
            title: true,
            price: true,
            discount_price: true,
            image_url: true,
            developer: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const formatted = items.map(item => ({
      ...item,
      game: {
        ...item.game,
        price: Number(item.game.price),
        discount_price: item.game.discount_price ? Number(item.game.discount_price) : undefined,
      },
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { user_id, game_id } = await req.json();
  if (!user_id || !game_id) return NextResponse.json({ error: "Missing parameters" }, { status: 400 });

  try {
    const cartItem = await prisma.cart.create({
      data: { user_id, game_id, quantity: 1 },
    });
    return NextResponse.json(cartItem);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { cart_id, userId } = await req.json();

  if (!cart_id || !userId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    await prisma.cart.delete({
      where: { id: cart_id, user_id: userId },
    });
    return NextResponse.json({ message: "Item removed from cart" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to remove item from cart" }, { status: 500 });
  }
}