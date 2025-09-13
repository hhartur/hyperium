import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { cookies } from "next/headers";

type ReportWhereInput = {
  OR?: ReportWhereInput[];
  reason?: { contains: string; mode?: 'insensitive' | 'default' };
  description?: { contains: string; mode?: 'insensitive' | 'default' };
  reporter?: {
    username?: { contains: string; mode?: 'insensitive' | 'default' };
  };
  reported_game?: {
    title?: { contains: string; mode?: 'insensitive' | 'default' };
  };
  reported_user?: {
    username?: { contains: string; mode?: 'insensitive' | 'default' };
  };
};

export async function GET(req: Request) {
  const sessionToken = (await cookies()).get("session_token")?.value;

  if (!sessionToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await getSession(sessionToken);

  if (!user || !user.is_admin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get("searchQuery");

    const where: ReportWhereInput = {};

    if (searchQuery) {
      where.OR = [
        { reason: { contains: searchQuery, mode: "insensitive" } },
        { description: { contains: searchQuery, mode: "insensitive" } },
        {
          reporter: {
            username: { contains: searchQuery, mode: "insensitive" },
          },
        },
        {
          reported_game: {
            title: { contains: searchQuery, mode: "insensitive" },
          },
        },
        {
          reported_user: {
            username: { contains: searchQuery, mode: "insensitive" },
          },
        },
      ];
    }

    const reports = await prisma.report.findMany({
      include: {
        reporter: {
          select: { username: true, email: true },
        },
        game: {
          select: { title: true, developer: true },
        },
      },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  const sessionToken = (await cookies()).get("session_token")?.value;

  if (!sessionToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await getSession(sessionToken);

  if (!user || !user.is_admin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { reportId, status } = body;

    if (!reportId || !status) {
      return new NextResponse("Missing reportId or status", { status: 400 });
    }

    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: { status },
    });

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
