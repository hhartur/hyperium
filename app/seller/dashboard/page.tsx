// app/seller/dashboard/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/components/providers/auth-provider';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Edit, Trash2, MessageCircle, PlusCircle } from 'lucide-react';

interface Game {
  id: string;
  title: string;
  description: string;
  price: number;
  discount_price?: number;
  image_url: string;
  developer: string;
  publisher: string;
  release_date: Date;
  genre: string[];
  tags: string[];
  rating: number;
  screenshots: string[];
  video_url?: string | null;
  file_url?: string | null;
  seller_id: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

interface PurchaseWithGameAndUser {
  id: string;
  game_id: string;
  user_id: string;
  price: number;
  amount_paid: number;
  created_at: string;
  game: {
    title: string;
    image_url: string;
  };
  user: {
    username: string;
  };
}

export default function SellerDashboardPage() {
  const { user, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [sellerPurchases, setSellerPurchases] = useState<PurchaseWithGameAndUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPurchases = sellerPurchases.filter(purchase =>
    purchase.game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    purchase.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!authLoading && (!user || !user.email_verified)) {
      router.push('/'); // Redirect unverified or non-logged-in users
    }
  }, [user, authLoading, router]);

  const fetchSellerGames = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/seller/games');
      if (res.ok) {
        const data = await res.json();
        setGames(data);
      } else {
        console.error('Failed to fetch seller games');
      }
    } catch (error) {
      console.error('Failed to fetch seller games', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchSellerPurchases = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/seller/purchases');
      if (res.ok) {
        const data = await res.json();
        setSellerPurchases(data);
      } else {
        console.error('Failed to fetch seller purchases');
      }
    } catch (error) {
      console.error('Failed to fetch seller purchases', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchSellerGames();
      fetchSellerPurchases();
    }
  }, [user, fetchSellerGames, fetchSellerPurchases]);

  const deleteGame = async (gameId: string) => {
    if (!window.confirm('Are you sure you want to delete this game?')) {
      return;
    }
    try {
      const res = await fetch('/api/seller/games', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId }),
      });
      if (res.ok) {
        fetchSellerGames(); // Refresh list
      } else {
        console.error('Failed to delete game');
      }
    } catch (error) {
      console.error('Failed to delete game', error);
    }
  };

  if (authLoading || loading) {
    return <p>Loading dashboard...</p>;
  }

  if (!user || !user.email_verified) {
    return null; // Should be redirected by useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <Input
          type="text"
          placeholder="Search by game title or username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your Games</CardTitle>
          <Link href="/games/add">
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add New Game
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {filteredGames.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              You haven&apos;t added any games yet.
            </p>
          ) : (
            <div className="space-y-4">
              {filteredGames.map((game) => (
                <Card key={game.id}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        fill
                        src={game.image_url || '/placeholder-game.jpg'}
                        alt={game.title}
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{game.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {game.developer}
                      </p>
                      <p className="text-sm font-bold mt-1">
                        ${game.discount_price !== undefined && game.discount_price !== null ? game.discount_price.toFixed(2) : game.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/games/edit/${game.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteGame(game.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Purchase Chats</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPurchases.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No purchase chats yet.
            </p>
          ) : (
            <div className="space-y-4">
              {filteredPurchases.map((purchase) => (
                <Card key={purchase.id}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        fill
                        src={purchase.game.image_url || '/placeholder-game.jpg'}
                        alt={purchase.game.title}
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{purchase.game.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Purchased by {purchase.user.username} on {new Date(purchase.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Link href={`/chat/${purchase.id}`}>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        View Chat
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}