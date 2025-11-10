'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '../ui/badge'
import { Star, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useI18n } from '@/hooks/useI18n';
import { useRealtimeTranslate } from '@/hooks/useRealtimeTranslate';
import { PriceDisplay } from './price-display';

interface Game {
  id: string;
  title: string;
  description: string;
  price: number;
  discount_price?: number | null;
  image_url: string;
  avgRating?: number;
}

interface FeaturedGameCardProps {
  game: Game;
}

export function FeaturedGameCard({ game }: FeaturedGameCardProps) {
  const { i18n } = useI18n();

  const price = game.price;
  const discountPrice = game.discount_price;

  const translatedTitle = useRealtimeTranslate(game.title);
  const translatedDescription = useRealtimeTranslate(game.description);
  const { t } = useI18n(); // For 'View Details' button

  return (
    <Card key={game.id} className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative overflow-hidden">
        <Image
        fill
          src={game.image_url || '/placeholder-game.jpg'}
          alt={translatedTitle}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {discountPrice && (
          <Badge className="absolute top-2 right-2 bg-red-600 text-white">
            -{Math.round((1 - discountPrice / price) * 100)}%
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 truncate">{translatedTitle}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {translatedDescription}
        </p>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm ml-1">{game.avgRating ? game.avgRating.toFixed(1) : 'N/A'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PriceDisplay price={price} discountPrice={discountPrice} lang={i18n.language} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild className="flex-1" size="sm" variant='outline'>
            <Link href={`/games/${game.id}`}>{t('view_details_button')}</Link>
          </Button>
          <Button size="sm" variant="outline">
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}