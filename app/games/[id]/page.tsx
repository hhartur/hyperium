import { GameDetails } from '@/components/games/game-details'
import { GameReviews } from '@/components/games/game-reviews'
import { GameComments } from '@/components/games/game-comments'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

async function getGame(id: string) {
  const game = await prisma.game.findUnique({
    where: {
      id: id,
      is_active: true,
    },
    include: {
      seller: {
        select: {
          username: true,
          avatar_url: true,
        },
      },
    },
  });

  if (!game) {
    return null;
  }

  return {
    ...game,
    price: game.price.toNumber(),
    discount_price: game.discount_price?.toNumber(),
  };
}

export default async function GamePage({ params }:  { params: { id: string } }) {
  const game = await getGame(params.id)

  if (!game) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <GameDetails game={game} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        <div className="lg:col-span-2">
          <GameComments gameId={game.id} />
        </div>
        <div>
          <GameReviews gameId={game.id} />
        </div>
      </div>
    </div>
  )
}
