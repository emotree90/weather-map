import { getRedis } from "@/lib/redis";
import { getWeatherData } from "@/lib/weather";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const lon = req.nextUrl.searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "缺少坐标参数" }, { status: 400 });
  }

  const cacheKey = `weather:${Number(lat).toFixed(2)}:${Number(lon).toFixed(2)}`;

  try {
    const redis = getRedis();

    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return NextResponse.json({ source: "cache", data: cached });
      }
    }

    const data = await getWeatherData(Number(lat), Number(lon));

    if (redis) {
      await redis.set(cacheKey, data, { ex: 600 });
    }

    return NextResponse.json({ source: "live", data });
  } catch {
    return NextResponse.json({ error: "获取天气数据失败" }, { status: 502 });
  }
}
