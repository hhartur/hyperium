'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, ShoppingCart } from 'lucide-react'
import { useAuthContext } from '@/components/providers/auth-provider'
import { useCart } from '@/components/providers/cart-provider'

export default function CartPage() {
  const { user } = useAuthContext()
  const { cartItems, loading, removeFromCart, purchaseAll, total } = useCart()
  const router = useRouter()

  useEffect(() => {
    if (!user && !loading) {
      // Redirect if user is not logged in and loading is complete
      // This handles cases where user might be null initially but then loads
      // or if they are explicitly not logged in
    }
  }, [user, loading])

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="p-8 text-center">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-4">Login Required</h1>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to view your cart.
            </p>
            <Button onClick={() => router.push('/')}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <p className="text-muted-foreground mt-2">
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      {cartItems.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some games to get started!
            </p>
            <Button onClick={() => router.push('/')}>
              Browse Games
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.game.image_url || '/placeholder-game.jpg'}
                      alt={item.game.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.game.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.game.developer}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {item.game.discount_price ? (
                          <>
                            <span className="text-sm text-muted-foreground line-through">
                              ${item.game.price.toFixed(2)}
                            </span>
                            <span className="font-bold text-primary-600">
                              ${item.game.discount_price.toFixed(2)}
                            </span>
                            <Badge className="bg-red-600 text-white">
                              -{Math.round((1 - item.game.discount_price / item.game.price) * 100)}%
                            </Badge>
                          </>
                        ) : (
                          <span className="font-bold">${item.game.price.toFixed(2)}</span>
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
            ))}
          </div>

          {/* Checkout Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Button
                onClick={purchaseAll}
                className="w-full mt-6"
                size="lg"
              >
                Complete Purchase
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                This is a simulation - no real payment will be processed
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}