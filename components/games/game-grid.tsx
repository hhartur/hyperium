'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '../ui/badge'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Game {
  id: string;
  title: string;
  description: string;
  price: number;
  discount_price?: number;
  image_url: string;
  developer: string;
  genre: string[];
}

interface GameGridProps {
  limit?: number
  category?: string
  searchQuery?: string
}

export function GameGrid({ limit, category, searchQuery }: GameGridProps) {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGames() {
      try {
        const params = new URLSearchParams();
        if (limit) params.set('limit', limit.toString());
        if (category) params.set('category', category);
        if (searchQuery) params.set('searchQuery', searchQuery);

        const response = await fetch(`/api/games?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchGames()
  }, [limit, category, searchQuery])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(limit || 8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-video bg-muted rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3 mb-3"></div>
              <div className="h-8 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {games.map((game) => (
        <Card key={game.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
          <div className="aspect-video relative overflow-hidden">
            <Image
            fill
              src={game.image_url || '/placeholder-game.jpg'}
              alt={game.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {game.discount_price && (
              <Badge className="absolute top-2 right-2 bg-red-600 text-white">
                -{Math.round((1 - game.discount_price / Number(game.price)) * 100)}%
              </Badge>
            )}
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-1 truncate">{game.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{game.developer}</p>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {game.description}
            </p>
            <div className="flex flex-wrap gap-1 mb-3">
              {game.genre.slice(0, 2).map((g) => (
                <Badge key={g} variant="secondary" className="text-xs">
                  {g}
                </Badge>
              ))}
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm ml-1">4.5</span>
                <span className="text-xs text-muted-foreground ml-1">(123)</span>
              </div>
              <div className="flex items-center gap-2">
                {game.discount_price ? (
                  <>
                    <span className="text-sm text-muted-foreground line-through">
                      ${Number(game.price).toFixed(2)}
                    </span>
                    <span className="font-bold text-primary-600">
                      ${game.discount_price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="font-bold">${Number(game.price).toFixed(2)}</span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild className="flex-1" size="sm" variant='outline'>
                <Link href={`/games/${game.id}`}>View</Link>
              </Button>
              <Button 
                size="sm" 
                variant="outline"
              >
                <ShoppingCart className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
