import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const gameId = searchParams.get("gameId");

  if (!gameId) {
    return NextResponse.json({ error: "Game ID not provided" }, { status: 400 });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { game_id: gameId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar_url: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(comments);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { gameId, userId, content } = await req.json();

  if (!gameId || !userId || !content) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        game_id: gameId,
        user_id: userId,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar_url: true,
          },
        },
      },
    });
    return NextResponse.json(newComment);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to submit comment" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
    const { commentId, userId, content } = await req.json();
  
    if (!commentId || !userId || !content) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }
  
    try {
      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
      });
  
      if (!comment) {
        return NextResponse.json({ error: "Comment not found" }, { status: 404 });
      }
  
      if (comment.user_id !== userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const updatedComment = await prisma.comment.update({
        where: { id: commentId },
        data: { content },
        include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar_url: true,
              },
            },
          },
      });
  
      return NextResponse.json(updatedComment);
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Failed to update comment" }, { status: 500 });
    }
  }
  
  export async function DELETE(req: NextRequest) {
    const { commentId, userId } = await req.json();
  
    if (!commentId || !userId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }
  
    try {
      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
      });
  
      if (!comment) {
        return NextResponse.json({ error: "Comment not found" }, { status: 404 });
      }
  
      const user = await prisma.user.findUnique({
          where: { id: userId },
      });
  
      if (!user) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
  
      if (comment.user_id !== userId && !user.is_admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      await prisma.comment.delete({
        where: { id: commentId },
      });
  
      return NextResponse.json({ message: "Comment deleted" });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
    }
  }