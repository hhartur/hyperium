'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send } from 'lucide-react';
import { useAuthContext } from '@/components/providers/auth-provider';
import Image from 'next/image';
import { useI18n } from '@/hooks/useI18n';
import { useRealtimeTranslate } from '@/hooks/useRealtimeTranslate';

interface Comment {
  id: string;
  game_id: string;
  user_id: string;
  content: string;
  created_at: Date;
  user: { id: string; username: string; avatar_url?: string | null };
}

interface GameCommentsProps {
  gameId: string;
}

export function GameComments({ gameId }: GameCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedCommentContent, setEditedCommentContent] = useState('');
  const { user } = useAuthContext();
  const { t } = useI18n();

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?gameId=${gameId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data as Comment[]);
      }
    } catch (error) {
      console.error('Failed to fetch comments', error);
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const submitComment = async () => {
    if (!user || !newComment.trim()) return;

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId,
          userId: user.id,
          content: newComment.trim(),
        }),
      });

      if (res.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch (error) {
      console.error('Failed to submit comment', error);
    }
  };

  const editComment = async (commentId: string) => {
    if (!user || !editedCommentContent.trim()) return;

    try {
      const res = await fetch('/api/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentId,
          userId: user.id,
          content: editedCommentContent.trim(),
        }),
      });

      if (res.ok) {
        setEditingCommentId(null);
        setEditedCommentContent('');
        fetchComments(); // Re-fetch comments to update the list
      } else {
        console.error('Failed to update comment');
      }
    } catch (error) {
      console.error('Failed to update comment', error);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!user) return;

    if (!window.confirm(t('are_you_sure_delete_comment'))) {
      return;
    }

    try {
      const res = await fetch('/api/comments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, userId: user.id }),
      });

      if (res.ok) {
        fetchComments(); // Re-fetch comments to update the list
      } else {
        console.error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Failed to delete comment', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
        <CardTitle>{t('comments')}</CardTitle>
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
          <MessageCircle className='w-5 h-5' />
          {t('comments')} ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {user && (
          <div className='border rounded-lg p-4 bg-muted/50'>
            <Input
              value={newComment}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewComment(e.target.value)
              }
              placeholder={t('share_thoughts')}
              className='resize-none mb-3'
            />
            <Button
              className='w-full'
              variant='outline'
              onClick={submitComment}
              disabled={!newComment.trim()}
            >
              <Send className='w-4 h-4 mr-2' />
              {t('post_comment')}
            </Button>
          </div>
        )}

        {comments.length === 0 ? (
          <p className='text-muted-foreground text-center py-8'>
            {t('no_comments')}
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              user={user}
              editingCommentId={editingCommentId}
              editedCommentContent={editedCommentContent}
              onEdit={editComment}
              onDelete={deleteComment}
              onCancelEdit={() => {
                setEditingCommentId(null);
                setEditedCommentContent('');
              }}
              onStartEdit={(id, content) => {
                setEditingCommentId(id);
                setEditedCommentContent(content);
              }}
              onEditContentChange={setEditedCommentContent}
              t={t}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}

function CommentItem({
  comment,
  user,
  editingCommentId,
  editedCommentContent,
  onEdit,
  onDelete,
  onCancelEdit,
  onStartEdit,
  onEditContentChange,
  t,
}: {
  comment: Comment;
  user: any;
  editingCommentId: string | null;
  editedCommentContent: string;
  onEdit: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  onCancelEdit: () => void;
  onStartEdit: (id: string, content: string) => void;
  onEditContentChange: (content: string) => void;
  t: (key: string) => string;
}) {
  return (
    <div className='border-b pb-4 last:border-b-0'>
      <div className='flex items-center gap-3 mb-2'>
        <div className='relative w-8 h-8 bg-muted rounded-full flex items-center justify-center overflow-hidden'>
          {comment.user.avatar_url ? (
            <Image
              fill
              src={comment.user.avatar_url}
              alt={comment.user.username}
              className='w-full h-full rounded-full object-cover'
              sizes='32px'
            />
          ) : (
            <span className='text-sm font-medium'>
              {comment.user.username[0].toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <p className='font-medium'>{comment.user.username}</p>
          <p className='text-xs text-muted-foreground'>
            {new Date(comment.created_at).toLocaleDateString()}
          </p>
        </div>
        {user && (user.id === comment.user_id || user.is_admin) && (
          <div className="ml-auto flex gap-2">
            {editingCommentId === comment.id ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(comment.id)}
                  disabled={!editedCommentContent.trim()}
                >
                  {t('save')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCancelEdit}
                >
                  {t('cancel')}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onStartEdit(comment.id, comment.content)}
                >
                  {t('edit')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(comment.id)}
                >
                  {t('delete')}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
      {editingCommentId === comment.id ? (
        <Input
          value={editedCommentContent}
          onChange={(e) => onEditContentChange(e.target.value)}
          className="mt-2"
        />
      ) : (
        <p className='text-sm'>
          <TranslatedCommentText text={comment.content} />
        </p>
      )}
    </div>
  );
}

function TranslatedCommentText({ text }: { text: string }) {
  const translatedText = useRealtimeTranslate(text);
  return <>{translatedText}</>;
}
