import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Query not provided" }, { status: 400 });
  }

  try {
    const games = await prisma.game.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            developer: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            genre: {
              has: query,
            },
          },
        ],
      },
    });
    return NextResponse.json(games);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to search games" }, { status: 500 });
  }
}
