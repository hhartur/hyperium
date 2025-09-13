"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send } from "lucide-react";
import { useAuthContext } from "@/components/providers/auth-provider";
import prisma from "@/lib/prisma";
import Image from "next/image";

interface Comment {
  id: string;
  game_id: string;
  user_id: string;
  content: string;
  created_at: Date;
  user: { username: string; avatar_url?: string | null };
}

interface GameCommentsProps {
  gameId: string;
}

export function GameComments({ gameId }: GameCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  const fetchComments = useCallback(async () => {
    try {
      try {
        const data = await prisma.comment.findMany({
          where: { game_id: gameId },
          include: { user: { select: { username: true, avatar_url: true } } },
          orderBy: { created_at: "desc" },
        });
        setComments(data as Comment[]);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch comments", error);
        setLoading(false);
      }
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
      await prisma.comment.create({
        data: {
          user_id: user.id,
          game_id: gameId,
          content: newComment.trim(),
        },
      });
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Failed to submit comment", error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
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
          <MessageCircle className="w-5 h-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {user && (
          <div className="border rounded-lg p-4 bg-muted/50">
            <Input
              value={newComment}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewComment(e.target.value)
              }
              placeholder="Share your thoughts about this game..."
              className="resize-none mb-3"
            />
            <Button onClick={submitComment} disabled={!newComment.trim()}>
              <Send className="w-4 h-4 mr-2" />
              Post Comment
            </Button>
          </div>
        )}

        {comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b pb-4 last:border-b-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  {comment.user.avatar_url ? (
                    <Image
                      src={comment.user.avatar_url}
                      alt={comment.user.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium">
                      {comment.user.username[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{comment.user.username}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-sm">{comment.content}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
