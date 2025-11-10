'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, ShoppingCart } from 'lucide-react'
import { useAuthContext } from '@/components/providers/auth-provider'
import { useCart } from '@/components/providers/cart-provider'
import { useI18n } from '@/hooks/useI18n';
import { useRealtimeTranslate } from '@/hooks/useRealtimeTranslate';
import { PriceDisplay } from '@/components/games/price-display';
import Image from 'next/image';

function CartItem({ item }) {
  const { removeFromCart } = useCart();
  const { i18n } = useI18n();
  const translatedTitle = useRealtimeTranslate(item.game.title);
  const translatedDeveloper = useRealtimeTranslate(item.game.developer);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative w-20 h-20">
            <Image
              fill
              src={item.game.image_url || '/placeholder-game.jpg'}
              alt={translatedTitle}
              className="object-cover rounded"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{translatedTitle}</h3>
            <p className="text-sm text-muted-foreground">{translatedDeveloper}</p>
            <div className="flex items-center gap-2 mt-2">
              <PriceDisplay price={item.game.price} discountPrice={item.game.discount_price} lang={i18n.language} />
              {item.game.discount_price && (
                <Badge className="bg-red-600 text-white">
                  -{Math.round((1 - item.game.discount_price / item.game.price) * 100)}%
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeFromCart(item.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CartPage() {
  const { user } = useAuthContext()
  const { cartItems, loading, removeFromCart, purchaseAll, total } = useCart()
  const router = useRouter()
  const { t, i18n } = useI18n();

  useEffect(() => {
    if (!user && !loading) {
      // Redirect if user is not logged in and loading is complete
      // This handles cases where user might be null initially but then loads
      // or if they are explicitly not logged in
    }
  }, [user, loading])

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {!user ? (
        <Card>
          <CardContent className="p-8 text-center">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold">{t('login_required_title')}</h1>
            <p className="text-muted-foreground mb-6">
              {t('login_required_message')}
            </p>
            <Button onClick={() => router.push('/')}>
              {t('go_to_home_button')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-muted rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                        <div className="h-3 bg-muted rounded w-1/4"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <> {/* Fragment to wrap multiple elements */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold">{t('shopping_cart_title')}</h1>
              <p className="text-muted-foreground mt-2">
                {t('items_in_cart', { count: cartItems.length })}
              </p>
            </div>

            {cartItems.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-xl font-semibold mb-2">{t('cart_empty_title')}</h2>
                  <p className="text-muted-foreground mb-6">
                    {t('cart_empty_message')}
                  </p>
                  <Button onClick={() => router.push('/')}>
                    {t('browse_games_button')}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>

                {/* Checkout Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('order_summary_title')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>{t('subtotal', { count: cartItems.length })}</span>
                        <PriceDisplay price={total} lang={i18n.language} />
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>{t('total')}</span>
                        <PriceDisplay price={total} lang={i18n.language} />
                      </div>
                    </div>
                    <Button
                      onClick={purchaseAll}
                      className="w-full mt-6"
                      variant='outline'
                      size="lg"
                    >
                      {t('complete_purchase_button')}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      {t('simulation_message')}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
}
