import { getLatestRadarFrame } from "@/lib/rainviewer";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const radar = await getLatestRadarFrame();
    return NextResponse.json(radar);
  } catch {
    return NextResponse.json({ error: "获取雷达数据失败" }, { status: 502 });
  }
}
