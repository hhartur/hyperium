import { GameGrid } from '@/components/games/game-grid'
import { FeaturedGames } from '@/components/games/featured-games'
import { GameCategories } from '@/components/games/game-categories'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <section className="text-center py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-3xl mb-12 text-white shadow-2xl relative overflow-hidden animate-fade-in">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <h1 className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent animate-slide-in">
            Welcome to Hyperium
          </h1>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed animate-slide-in animate-delay-100">
            Discover and buy amazing indie games from talented developers around the world
          </p>
          <div className="flex justify-center gap-6 animate-slide-in animate-delay-200">
            <Button asChild size="lg" variant="secondary" className="shadow-lg hover:shadow-xl transition-shadow">
              <Link href="/games">Browse Games</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 shadow-lg hover:shadow-xl transition-all">
              <Link href="/games/add">Sell Your Game</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <FeaturedGames />

      {/* Categories */}
      <GameCategories />

      {/* Recent Games */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Recently Added</h2>
          <Button asChild variant="outline">
            <Link href="/games">View All</Link>
          </Button>
        </div>
        <GameGrid limit={8} />
      </section>
    </div>
  )
}