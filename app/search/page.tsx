'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { GameCard } from '@/components/games/game-card'
import { Game } from '@/components/games/game-card'

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('query')
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (query) {
      setLoading(true)
      fetch(`/api/games/search?query=${query}`)
        .then((res) => res.json())
        .then((data) => {
          setGames(data)
          setLoading(false)
        })
    }
  }, [query])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search Results for "{query}"</h1>
      {loading ? (
        <p>Loading...</p>
      ) : games.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <p>No games found.</p>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}
