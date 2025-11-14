'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '../ui/badge'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/components/providers/cart-provider';
import { useAuthContext } from '@/components/providers/auth-provider';
import { useI18n } from '@/hooks/useI18n';
import { useRealtimeTranslate } from '@/hooks/useRealtimeTranslate';
import { PriceDisplay } from './price-display';

export interface Game {
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

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const { addToCart } = useCart();
  const { user } = useAuthContext();
  const { i18n, t } = useI18n();

  //const setInCart = () => {}; // Placeholder to avoid unused variable warning

  const translatedTitle = useRealtimeTranslate(game.title);
  const translatedDeveloper = useRealtimeTranslate(game.developer);

    return (
    <Card key={game.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="aspect-video relative overflow-hidden">
        <Link href={`/games/${game.id}`}>
          <Image
            fill
            src={game.image_url || '/placeholder-game.jpg'}
            alt={translatedTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
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
        <h3 className="font-semibold text-lg mb-1 truncate" title={translatedTitle}>{translatedTitle}</h3>
        <p className="text-sm text-muted-foreground mb-3">{translatedDeveloper}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm ml-1">{game.rating ? game.rating.toFixed(1) : 'N/A'}</span>
          </div>
          <div className="text-right">
             <PriceDisplay price={game.price} discountPrice={game.discount_price} lang={i18n.language} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild className="flex-1" size="sm" variant='outline'>
            <Link href={`/games/${game.id}`}>{t('view_details_button')}</Link>
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => addToCart(game.id)}
            disabled={!user}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
