import { getWeatherData } from "@/lib/weather";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const lon = req.nextUrl.searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "缺少坐标参数" }, { status: 400 });
  }

  try {
    const data = await getWeatherData(Number(lat), Number(lon));
    return NextResponse.json({ source: "live", data });
  } catch {
    return NextResponse.json({ error: "获取天气数据失败" }, { status: 502 });
  }
}
