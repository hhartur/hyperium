import { createServerClient } from "@/lib/database";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createServerClient();

    const { data: games, error } = await supabase.from("games").select("*");

    if (error) {
      return NextResponse.json({ err: "Failed to fetch games", details: error.message }, { status: 500 });
    }

    if (!games || games.length === 0) {
      return NextResponse.json({ err: "Games not found" }, { status: 404 });
    }

    return NextResponse.json({ games }, { status: 200 });
  } catch (err) {
    console.error("Error occurred while getting games:", err);
    return NextResponse.json({ err: "Internal Server Error" }, { status: 500 });
  }
}
