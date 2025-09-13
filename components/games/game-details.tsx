"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ShoppingCart, Star, Download, Flag, Play } from "lucide-react";
import { useAuthContext } from "@/components/providers/auth-provider";
import prisma from "@/lib/prisma";

interface Game {
  id: string;
  title: string;
  description: string;
  price: number;
  discount_price?: number | null;
  image_url: string;
  developer: string;
  publisher: string;
  release_date: Date;
  genre: string[];
  tags: string[];
  screenshots: string[];
  video_url?: string | null;
  file_url?: string | null;
  seller_id: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  seller: {
    username: string;
    avatar_url?: string | null;
  } | null;
}

interface GameDetailsProps {
  game: Game;
}

export function GameDetails({ game }: GameDetailsProps) {
  const [isPurchased, setIsPurchased] = useState(false);
  const [inCart, setInCart] = useState(false);
  const { user } = useAuthContext();

  const addToCart = async () => {
    if (!user) return;

    try {
      await prisma.cart.create({
        data: {
          user_id: user.id,
          game_id: game.id,
          quantity: 1,
        },
      });
      setInCart(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const purchaseGame = async () => {
    if (!user) return;

    const price = game.discount_price || game.price;

    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, game_id: game.id }),
      });

      setIsPurchased(true);
    } catch (error) {
      console.error("Error purchasing game:", error);
    }
  };

  const reportGame = async (reason: string, description?: string) => {
    if (!user) return;

    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reporter_id: user.id,
          game_id: game.id, // ← mesmo nome do schema
          reason,
          description,
        }),
      });

      if (res.ok) {
        alert("Report submitted successfully!");
      } else {
        alert("Failed to submit report");
      }
    } catch (error) {
      console.error("Error reporting game:", error);
      alert("An error occurred");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Hero Image */}
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <img
            src={game.image_url || "/placeholder-game.jpg"}
            alt={game.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <h1 className="text-3xl font-bold mb-2">{game.title}</h1>
            <p className="text-lg opacity-90">by {game.developer}</p>
          </div>
        </div>

        {/* Screenshots */}
        {game.screenshots && game.screenshots.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Screenshots</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {game.screenshots.map((screenshot, index) => (
                <img
                  key={index}
                  src={screenshot}
                  alt={`${game.title} screenshot ${index + 1}`}
                  className="rounded-lg aspect-video object-cover"
                />
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <h3 className="text-xl font-semibold mb-4">About This Game</h3>
          <p className="text-muted-foreground leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Tags */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {game.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Purchase Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">4.5</span>
                <span className="text-sm text-muted-foreground">
                  (123 reviews)
                </span>
              </div>
            </div>

            <div className="mb-6">
              {game.discount_price ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-primary-600">
                    ${game.discount_price.toFixed(2)}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    ${game.price.toFixed(2)}
                  </span>
                  <Badge className="bg-red-600 text-white">
                    -{Math.round((1 - game.discount_price / game.price) * 100)}%
                  </Badge>
                </div>
              ) : (
                <span className="text-2xl font-bold">
                  ${game.price.toFixed(2)}
                </span>
              )}
            </div>

            <div className="space-y-3">
              {isPurchased ? (
                <Button className="w-full" size="lg">
                  <Download className="w-4 h-4 mr-2" />
                  Download Game
                </Button>
              ) : inCart ? (
                <Button className="w-full" size="lg" variant="outline">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  In Cart
                </Button>
              ) : (
                <>
                  <Button
                    onClick={purchaseGame}
                    className="w-full"
                    size="lg"
                    disabled={!user}
                    variant="outline"
                  >
                    Purchase Now
                  </Button>
                  <Button
                    onClick={addToCart}
                    variant="outline"
                    className="w-full"
                    size="lg"
                    disabled={!user}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </>
              )}

              {game.video_url && (
                <Button variant="ghost" className="w-full" size="lg">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Trailer
                </Button>
              )}
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  <strong>Developer:</strong> {game.developer}
                </p>
                <p>
                  <strong>Publisher:</strong> {game.publisher}
                </p>
                <p>
                  <strong>Release Date:</strong>{" "}
                  {new Date(game.release_date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Genres:</strong> {game.genre.join(", ")}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    Report
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Report Game</DialogTitle>
                  </DialogHeader>
                  <ReportForm onSubmit={reportGame} />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Seller Info */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Sold by</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                {game.seller?.avatar_url ? (
                  <img
                    src={game.seller.avatar_url}
                    alt={game.seller.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="font-medium">
                    {game.seller?.username[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="font-medium">{game.seller?.username}</p>
                <p className="text-sm text-muted-foreground">
                  Independent Developer
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ReportForm({
  onSubmit,
}: {
  onSubmit: (reason: string, description?: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  const reasons = [
    "Inappropriate content",
    "Copyright infringement",
    "Spam or misleading",
    "Broken download",
    "Other",
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Reason</label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">Select a reason</option>
          {reasons.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">
          Description (optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-md resize-none"
          rows={3}
          placeholder="Provide more details..."
        />
      </div>
      <Button onClick={() => onSubmit(reason, description)} disabled={!reason}>
        Submit Report
      </Button>
    </div>
  );
}
