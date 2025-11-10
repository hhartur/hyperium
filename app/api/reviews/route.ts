import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const gameId = searchParams.get("gameId");

  if (!gameId) {
    return NextResponse.json({ error: "Game ID not provided" }, { status: 400 });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { game_id: gameId },
      include: {
        user: {
          select: {
            id: true, // Include user ID
            username: true,
            avatar_url: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(reviews);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { gameId, userId, rating, comment, reviewId } = await req.json();

  if (!gameId || !userId || !rating) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    if (reviewId) {
      // Update existing review
      const updatedReview = await prisma.review.update({
        where: { id: reviewId },
        data: { rating, comment },
        include: { // Include user data after update
            user: {
                select: {
                    id: true,
                    username: true,
                    avatar_url: true,
                },
            },
        },
      });
      return NextResponse.json(updatedReview);
    } else {
      // Create new review
      const newReview = await prisma.review.create({
        data: {
          user_id: userId,
          game_id: gameId,
          rating,
          comment,
        },
        include: { // Include user data after creation
            user: {
                select: {
                    id: true,
                    username: true,
                    avatar_url: true,
                },
            },
        },
      });
      return NextResponse.json(newReview);
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { reviewId, userId } = await req.json();

  if (!reviewId || !userId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (review.user_id !== userId && !user.is_admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    return NextResponse.json({ message: "Review deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}