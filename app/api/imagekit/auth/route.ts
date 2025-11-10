import { NextRequest, NextResponse } from "next/server";
import { imagekit } from "@/lib/imagekit";

export async function GET(req: NextRequest) {
  const result = imagekit.getAuthenticationParameters();
  return NextResponse.json(result);
}
