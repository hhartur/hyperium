'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
/*import { Button } from '@/components/ui/button'
import { Badge } from '../ui/badge'
import { Star, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useI18n } from '@/hooks/useI18n';
import { useRealtimeTranslate } from '@/hooks/useRealtimeTranslate';
import { PriceDisplay } from './price-display';*/
import { FeaturedGameCard } from './featured-game-card';
import { useI18n } from '@/hooks/useI18n';

interface Game {
  id: string;
  title: string;
  description: string;
  price: number;
  discount_price?: number | null;
  image_url: string;
  avgRating?: number;
}

export function FeaturedGames() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useI18n();

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
        <h2 className="text-3xl font-bold mb-6">{t('featured_games')}</h2>
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
      <h2 className="text-3xl font-bold mb-6">{t('featured_games')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {games.map((game) => (
          <FeaturedGameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  )
}