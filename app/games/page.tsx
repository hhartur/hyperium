import { GameGrid } from '@/components/games/game-grid'
import { GameCategories } from '@/components/games/game-categories'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function GamesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">All Games</h1>
          <p className="text-muted-foreground">Discover amazing indie games from talented developers</p>
        </div>
        <Button asChild>
          <Link href="/games/add">Add Your Game</Link>
        </Button>
      </div>

      <GameCategories />

      <div className="mt-8">
        <GameGrid />
      </div>
    </div>
  )
}
