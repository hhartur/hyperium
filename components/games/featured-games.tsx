'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '../ui/badge'
import { Star, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Game {
  id: string;
  title: string;
  description: string;
  price: number | string;
  discount_price?: number | string;
  image_url: string;
}

export function FeaturedGames() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeaturedGames() {
      try {
        const response = await fetch('/api/games/featured');
        if (!response.ok) {
          throw new Error('Failed to fetch featured games');
        }
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedGames()
  }, [])

  if (loading) {
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Featured Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-video bg-muted rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6">Featured Games</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {games.map((game) => {
          const price = typeof game.price === 'string' ? parseFloat(game.price) : game.price;
          const discountPrice = game.discount_price ? (typeof game.discount_price === 'string' ? parseFloat(game.discount_price) : game.discount_price) : undefined;

          return (
            <Card key={game.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src={game.image_url || '/placeholder-game.jpg'}
                  alt={game.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {discountPrice && (
                  <Badge className="absolute top-2 right-2 bg-red-600 text-white">
                    -{Math.round((1 - discountPrice / price) * 100)}%
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 truncate">{game.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {game.description}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm ml-1">4.5</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {discountPrice ? (
                      <>
                        <span className="text-sm text-muted-foreground line-through">
                          ${price.toFixed(2)}
                        </span>
                        <span className="font-bold text-primary-600">
                          ${discountPrice.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="font-bold">${price.toFixed(2)}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button asChild className="flex-1" size="sm" variant='outline'>
                    <Link href={`/games/${game.id}`}>View Details</Link>
                  </Button>
                  <Button size="sm" variant="outline">
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  )
}
