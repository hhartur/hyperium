'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useAuthContext } from '@/components/providers/auth-provider';
import Image from 'next/image';
import { useI18n } from '@/hooks/useI18n';
import { useRealtimeTranslate } from '@/hooks/useRealtimeTranslate';

interface Review {
  id: string;
  user_id: string;
  game_id: string;
  rating: number;
  comment: string | null;
  created_at: Date;
  user: {
    id: string;
    username: string;
    avatar_url?: string | null;
  };
}

export function GameReviews({ gameId }: { gameId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();
  const { t } = useI18n();

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?gameId=${gameId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data as Review[]);
        if (user) {
          const userRev = data.find((r: Review) => r.user_id === user.id);
          setUserReview(userRev || null);
        }
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
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
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId,
          userId: user.id,
          rating,
          comment,
          reviewId: userReview?.id,
        }),
      });

      if (res.ok) {
        fetchReviews();
        setUserReview(null); // Clear userReview after submission
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!user) return;

    if (!window.confirm(t('are_you_sure_delete_review'))) {
      return;
    }

    try {
      const res = await fetch('/api/reviews', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, userId: user.id }),
      });

      if (res.ok) {
        fetchReviews(); // Re-fetch reviews to update the list
      } else {
        console.error('Failed to delete review');
      }
    } catch (error) {
      console.error('Failed to delete review', error);
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
        <CardTitle>{t('reviews')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='animate-pulse space-y-4'>
            <div className='h-4 bg-muted rounded'></div>
            <div className='h-4 bg-muted rounded w-3/4'></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Star className='w-5 h-5 fill-yellow-400 text-yellow-400' />
          {averageRating.toFixed(1)} ({reviews.length} {t('reviews').toLowerCase()})
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {user && <ReviewForm existingReview={userReview} onSubmit={submitReview} />}
        {reviews.map((review) => (
          <ReviewItem
            key={review.id}
            review={review}
            user={user}
            userReview={userReview}
            onEdit={setUserReview}
            onDelete={deleteReview}
            t={t}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function ReviewItem({
  review,
  user,
  userReview,
  onEdit,
  onDelete,
  t,
}: {
  review: Review;
  user: { id: string; is_admin?: boolean } | null;
  userReview: Review | null;
  onEdit: (review: Review | null) => void;
  onDelete: (reviewId: string) => void;
  t: (key: string) => string;
}) {
  return (
    <div className='border-b pb-4 last:border-b-0'>
      <div className='flex items-center gap-2 mb-2'>
        <div className='relative w-8 h-8 bg-muted rounded-full flex items-center justify-center overflow-hidden'>
          {review.user.avatar_url ? (
            <Image
              fill
              src={review.user.avatar_url}
              alt={review.user.username}
              className='w-full h-full rounded-full object-cover'
              sizes='32px'
            />
          ) : (
            <span className='text-sm font-medium'>
              {review.user.username[0].toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <p className='font-medium'>{review.user.username}</p>
          <div className='flex items-center'>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < review.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
        </div>
        {user && (user.id === review.user_id || user.is_admin) && (
          <div className="ml-auto flex gap-2">
            {userReview?.id === review.id ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(null)} // Cancel editing
              >
                {t('cancel_edit')}
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(review)} // Set this review as the one to edit
              >
                {t('edit')}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(review.id)}
            >
              {t('delete')}
            </Button>
          </div>
        )}
      </div>
      {review.comment && (
        <p className='text-sm text-muted-foreground'>
          <TranslatedText text={review.comment} />
        </p>
      )}
    </div>
  );
}

function TranslatedText({ text }: { text: string }) {
  const translatedText = useRealtimeTranslate(text);
  return <>{translatedText}</>;
}

function ReviewForm({
  existingReview,
  onSubmit,
}: {
  existingReview: Review | null;
  onSubmit: (rating: number, comment?: string) => void;
}) {
  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const { t } = useI18n();

  useEffect(() => {
    setRating(existingReview?.rating || 5);
    setComment(existingReview?.comment || '');
  }, [existingReview]);

  return (
    <div className='border rounded-lg p-4 bg-muted/50'>
      <h4 className='font-medium mb-3'>
        {existingReview ? t('update_your_review') : t('write_a_review')}
      </h4>
      <div className='flex items-center gap-1 mb-3'>
        {[...Array(5)].map((_, i) => (
          <button
            key={i}
            onClick={() => setRating(i + 1)}
            className='focus:outline-none'
          >
            <Star
              className={`w-5 h-5 ${
                i < rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground'
              }`}
            />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={t('share_thoughts_placeholder')}
        className='w-full p-2 border rounded-md resize-none mb-3'
        rows={3}
      />
      <Button
        className='w-full'
        variant='outline'
        onClick={() => onSubmit(rating, comment)}
      >
        {existingReview ? t('update_review') : t('submit_review')}
      </Button>
    </div>
  );
}
