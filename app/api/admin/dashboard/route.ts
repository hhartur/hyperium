import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const totalUsers = await prisma.user.count();
    const activeGames = await prisma.game.count({
      where: { is_active: true },
    });
    const pendingReports = await prisma.report.count({
      where: { status: "pending" },
    });

    return NextResponse.json({
      totalUsers,
      activeGames,
      pendingReports,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
