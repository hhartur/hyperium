import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { user_id, game_id } = await req.json();
  const cartItem = await prisma.cart.create({
    data: { user_id, game_id, quantity: 1 }
  });
  return new Response(JSON.stringify(cartItem));
}
