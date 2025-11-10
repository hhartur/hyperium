"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ShoppingCart, Star, Download, Flag, Play } from "lucide-react";
import { useAuthContext } from "@/components/providers/auth-provider";
import { useCart } from "@/components/providers/cart-provider";
import Image from 'next/image';
import { useI18n } from "@/hooks/useI18n";
import { PriceDisplay } from "./price-display";
import { useRealtimeTranslate } from '@/hooks/useRealtimeTranslate';

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
  rating: number;
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
  reviews: {
    id: string;
    rating: number;
    comment: string | null;
    created_at: Date;
    user: {
      username: string;
      avatar_url?: string | null;
    };
  }[];
  reviewCount: number;
}

interface GameDetailsProps {
  game: Game;
}

export function GameDetails({ game }: GameDetailsProps) {
  const { i18n, t } = useI18n();
  const translatedDescription = useRealtimeTranslate(game.description);
  const translatedTitle = useRealtimeTranslate(game.title);
  const translatedDeveloper = useRealtimeTranslate(game.developer);
  const translatedPublisher = useRealtimeTranslate(game.publisher);
  const [isPurchased, setIsPurchased] = useState(false);
  const [inCart, setInCart] = useState(false);
  const { user } = useAuthContext();
  const { addToCart } = useCart();

  const getEmbedUrl = (url: string | null | undefined) => {
    if (!url) return null;
    const youtubeWatchRegex = /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/g;
    const match = youtubeWatchRegex.exec(url);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url; // Return original if not a recognized YouTube watch URL
  };

  const embedVideoUrl = getEmbedUrl(game.video_url);

  const purchaseGame = async () => {
    if (!user) return;

    try {
      // TODO: Implement purchase logic
      console.log("Purchase logic not implemented yet");
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
          game_id: game.id,
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
          <Image
            fill
            src={game.image_url || "/placeholder-game.jpg"}
            alt={game.title}
            className="w-full h-full object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <h1 className="text-3xl font-bold mb-2">{translatedTitle}</h1>
            <p className="text-lg opacity-90">by {translatedDeveloper}</p>
          </div>
        </div>

        {/* Screenshots */}
        {game.screenshots && game.screenshots.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">{t('screenshots')}</h3>
            <Carousel className="w-full">
              <CarouselContent>
                {game.screenshots.map((screenshot, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <Image
                        fill
                        src={screenshot}
                        alt={`${translatedTitle} screenshot ${index + 1}`}
                        className="rounded-lg aspect-video object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        )}

        {/* Description */}
        <div>
          <h3 className="text-xl font-semibold mb-4">{t('about_this_game')}</h3>
          <p className="text-muted-foreground leading-relaxed">
            {translatedDescription}
          </p>
        </div>

        {/* Tags */}
        <div>
          <h3 className="text-xl font-semibold mb-4">{t('tags')}</h3>
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
                <span className="font-medium">{game.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">
                  ({game.reviewCount} {t('reviews')})
                </span>
              </div>
            </div>

            <div className="mb-6 flex items-center gap-2">
              <PriceDisplay price={game.price} discountPrice={game.discount_price} lang={i18n.language} />
              {game.discount_price && (
                 <Badge className="bg-red-600 text-white">
                    -{Math.round((1 - game.discount_price / game.price) * 100)}%
                  </Badge>
              )}
            </div>

            <div className="space-y-3">
              {isPurchased ? (
                <Button className="w-full" size="lg">
                  <Download className="w-4 h-4 mr-2" />
                  {t('download_game')}
                </Button>
              ) : inCart ? (
                <Button className="w-full" size="lg" variant="outline">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {t('in_cart')}
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
                    {t('purchase_now')}
                  </Button>
                  <Button
                    onClick={() => addToCart(game.id)}
                    variant="outline"
                    className="w-full"
                    size="lg"
                    disabled={!user}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {t('add_to_cart')}
                  </Button>
                </>
              )}

              {game.video_url && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="w-full" size="lg">
                      <Play className="w-4 h-4 mr-2" />
                      {t('watch_trailer')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>{game.title} - Trailer</DialogTitle>
                    </DialogHeader>
                    <div className="aspect-video">
                      <iframe
                        className="w-full h-full"
                        src={embedVideoUrl || ''}
                        title={`${game.title} trailer`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  <strong>{t('developer')}:</strong> {translatedDeveloper}
                </p>
                <p>
                  <strong>{t('publisher')}:</strong> {translatedPublisher}
                </p>
                <p>
                  <strong>{t('release_date')}:</strong>{" "}
                  {new Date(game.release_date).toLocaleDateString()}
                </p>
                <p>
                  <strong>{t('genres')}:</strong> {game.genre.join(", ")}
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
                    {t('report')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                      <DialogTitle>{t('report_game')}</DialogTitle>
                  </DialogHeader>
                  <ReportForm onSubmit={reportGame} t={t} />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Seller Info */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">{t('sold_by')}</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center relative overflow-hidden">
                {game.seller?.avatar_url ? (
                  <Image
                    fill
                    src={game.seller.avatar_url}
                    alt={game.seller.username}
                    className="w-full h-full rounded-full object-cover"
                    sizes="40px"
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
                  {t('independent_developer')}
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
  t,
}: {
  onSubmit: (reason: string, description?: string) => void;
  t: (key: string) => string;
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
        <label className="block text-sm font-medium mb-2">{t('reason')}</label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">{t('select_reason')}</option>
          {reasons.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">
          {t('description_optional')}
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-md resize-none"
          rows={3}
          placeholder={t('provide_more_details')}
        />
      </div>
      <Button onClick={() => onSubmit(reason, description)} disabled={!reason}>
        {t('submit_report')}
      </Button>
    </div>
  );
}
