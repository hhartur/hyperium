'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Check, X, Eye } from 'lucide-react'
import Link from 'next/link'

interface Game {
  id: string
  title: string
  description: string
  price: number
  developer: string
  publisher: string
  release_date: Date
  genre: string[]
  tags: string[]
  image_url: string
  screenshots: string[]
  video_url?: string | null
  file_url?: string | null
  seller_id: string
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export function GameModeration() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('searchQuery', searchQuery);

      const response = await fetch(`/api/admin/games?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error('Error fetching games:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleGameStatus = async (gameId: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/admin/games', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameId, is_active: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update game status');
      }

      // Update local state
      setGames(games.map(game =>
        game.id === gameId ? { ...game, is_active: !currentStatus } : game
      ))
    } catch (error) {
      console.error('Error updating game status:', error)
    }
  }

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.developer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading games...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Game Moderation</span>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredGames.map((game) => (
            <div key={game.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <img
                  src={game.image_url}
                  alt={game.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <p className="font-medium">{game.title}</p>
                  <p className="text-sm text-muted-foreground">by {game.developer}</p>
                  <p className="text-xs text-muted-foreground">
                    Added {new Date(game.created_at).toLocaleDateString()}
                  </p>
                  <div className="flex gap-1 mt-1">
                    {game.genre.slice(0, 2).map((g) => (
                      <Badge key={g} variant="secondary" className="text-xs">
                        {g}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={game.is_active ? "default" : "destructive"}>
                  {game.is_active ? "Active" : "Inactive"}
                </Badge>
                <div className="flex space-x-2">
                  <Link href={`/games/${game.id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant={game.is_active ? "destructive" : "default"}
                    onClick={() => toggleGameStatus(game.id, game.is_active)}
                  >
                    {game.is_active ? (
                      <>
                        <X className="h-4 w-4 mr-1" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Activate
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {filteredGames.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No games found matching your search.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
