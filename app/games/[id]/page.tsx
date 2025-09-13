"use client"

import { useEffect, useState } from "react"
import { GameDetails } from '@/components/games/game-details'
import { GameReviews } from '@/components/games/game-reviews'
import { GameComments } from '@/components/games/game-comments'
import { useParams, useRouter } from 'next/navigation'

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const [game, setGame] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGame() {
      try {
        const res = await fetch("/api/games/get-game", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: params.id })
        })

        if (!res.ok) {
          router.push("/404") // redireciona se não encontrar
          return
        }

        const data = await res.json() // <- converte para JSON
        setGame(data)
      } catch (err) {
        console.error(err)
        router.push("/404")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) fetchGame()
  }, [params.id, router])

  if (loading) return <p>Loading...</p>
  if (!game) return null

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
