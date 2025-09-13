"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useAuthContext } from "@/components/providers/auth-provider";
import prisma from "@/lib/prisma";
import Image from "next/image";

interface Review {
  id: string;
  user_id: string;
  game_id: string;
  rating: number;
  comment: string | null;
  created_at: Date;
  user: {
    // <-- aqui deve ser `user`, não `users`
    username: string;
    avatar_url?: string | null;
  };
}

export function GameReviews({ params }: { params: { id: string } }) {
  const gameId = params.id;
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  const fetchReviews = useCallback(async () => {
    try {
      try {
        const data = await prisma.review.findMany({
          where: {
            game_id: gameId,
          },
          include: {
            user: {
              select: { username: true, avatar_url: true },
            },
          },
          orderBy: {
            created_at: "desc",
          },
        });

        setReviews(data as Review[]);

        if (user) {
          const userRev = data.find((r) => r.user_id === user.id);
          setUserReview((userRev as Review) || null);
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setLoading(false);
      }
    } finally {
      setLoading(false);
    }
  }, [gameId, user]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const submitReview = async (rating: number, comment?: string) => {
    if (!user) return;

    try {
      if (userReview) {
        // Update existing review
        await prisma.review.update({
          where: { id: userReview.id },
          data: { rating, comment },
        });
      } else {
        // Create new review
        await prisma.review.create({
          data: {
            user_id: user.id,
            game_id: gameId,
            rating,
            comment,
          },
        });
      }

      fetchReviews();
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          {averageRating.toFixed(1)} ({reviews.length} reviews)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {user && (
          <ReviewForm existingReview={userReview} onSubmit={submitReview} />
        )}
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-4 last:border-b-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                {review.user.avatar_url ? (
                  <Image
                    src={review.user.avatar_url}
                    alt={review.user.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium">
                    {review.user.username[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="font-medium">{review.user.username}</p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            {review.comment && (
              <p className="text-sm text-muted-foreground">{review.comment}</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ReviewForm({
  existingReview,
  onSubmit,
}: {
  existingReview: Review | null;
  onSubmit: (rating: number, comment?: string) => void;
}) {
  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [comment, setComment] = useState(existingReview?.comment || "");

  return (
    <div className="border rounded-lg p-4 bg-muted/50">
      <h4 className="font-medium mb-3">
        {existingReview ? "Update your review" : "Write a review"}
      </h4>
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <button
            key={i}
            onClick={() => setRating(i + 1)}
            className="focus:outline-none"
          >
            <Star
              className={`w-5 h-5 ${
                i < rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your thoughts about this game..."
        className="w-full p-2 border rounded-md resize-none mb-3"
        rows={3}
      />
      <Button onClick={() => onSubmit(rating, comment)}>
        {existingReview ? "Update Review" : "Submit Review"}
      </Button>
    </div>
  );
}
