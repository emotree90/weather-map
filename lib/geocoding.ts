import type { GeocodingResult } from "@/lib/types";

/** 英文搜索，优先返回马来西亚地点 */
export async function searchLocation(
  query: string
): Promise<GeocodingResult[]> {
  const params = new URLSearchParams({
    name: query,
    count: "8",
    language: "en",
    format: "json",
    countryCode: "MY",
  });

  const url = `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    throw new Error("地名搜索失败");
  }

  const data = await res.json();
  return data.results ?? [];
}
