'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { GameCard } from './game-card';

interface Game {
  id: string;
  title: string;
  description: string;
  price: number;
  discount_price?: number;
  image_url: string;
  developer: string;
  genre: string[];
  rating?: number;
  reviewCount?: number;
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
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  )
}
