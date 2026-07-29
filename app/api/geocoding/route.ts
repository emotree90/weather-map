import { searchLocation } from "@/lib/geocoding";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ error: "请输入至少 2 个字符" }, { status: 400 });
  }

  try {
    const results = await searchLocation(query.trim());
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: "地名搜索失败" }, { status: 502 });
  }
}
