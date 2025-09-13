'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Download, History } from 'lucide-react'
import Link from 'next/link'
import { useAuthContext } from '@/components/providers/auth-provider'

interface Purchase {
  id: string
  game_id: string
  user_id: string
  amount_paid: number
  purchased_at: Date
  games: {
    id: string
    title: string
    developer: string
    image_url: string
    file_url?: string | null
  }
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      fetchPurchases()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchPurchases = async () => {
    try {
      const response = await fetch('/api/purchases');
      if (!response.ok) {
        throw new Error('Failed to fetch purchases');
      }
      const data = await response.json();
      setPurchases(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch purchases', error);
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="p-8 text-center">
            <History className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-4">Login Required</h1>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to view your purchase history.
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
        <h1 className="text-3xl font-bold">Purchase History</h1>
        <p className="text-muted-foreground mt-2">
          {purchases.length} {purchases.length === 1 ? 'purchase' : 'purchases'}
        </p>
      </div>

      {purchases.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <History className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No purchases yet</h2>
            <p className="text-muted-foreground mb-6">
              Start shopping to see your purchase history here!
            </p>
            <Button onClick={() => router.push('/')}>
              Browse Games
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <Card key={purchase.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img
                    src={purchase.games.image_url || '/placeholder-game.jpg'}
                    alt={purchase.games.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{purchase.games.title}</h3>
                        <p className="text-sm text-muted-foreground">{purchase.games.developer}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Purchased on {new Date(purchase.purchased_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${purchase.amount_paid.toFixed(2)}</p>
                        <Badge variant="secondary" className="mt-1">
                          Purchased
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <a href={`/chat/${purchase.id}`}>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Contact Seller
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        }
        </div>
      )
    }
    </div>
  )
}
