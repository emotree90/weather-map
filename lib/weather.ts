import type { WeatherResponse } from "@/lib/types";

/**
 * 马来西亚地区使用全球 GFS 模型（best_match 在东南亚同样会选全球模式）。
 * 不使用 minutely_15：该地区无高分辨率短临数据，仅为小时插值。
 */
export async function getWeatherData(
  lat: number,
  lon: number
): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: "temperature_2m,weathercode",
    hourly:
      "temperature_2m,precipitation_probability,precipitation,weathercode",
    daily: "weathercode,temperature_2m_max,temperature_2m_min",
    models: "best_match",
    past_days: "7",
    forecast_days: "7",
    timezone: "Asia/Kuala_Lumpur",
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const res = await fetch(url, { next: { revalidate: 600 } });

  if (!res.ok) {
    throw new Error("获取天气数据失败");
  }

  return res.json();
}
