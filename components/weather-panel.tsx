"use client";

import { useEffect, useState } from "react";
import { Heart, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { addFavorite, isFavorite, removeFavorite } from "@/lib/favorites";
import type { FavoriteLocation, MapSelection, WeatherResponse } from "@/lib/types";
import { getWeatherEmoji, getWeatherLabel } from "@/lib/weather-codes";

interface WeatherPanelProps {
  selection: MapSelection | null;
  favorites: FavoriteLocation[];
  onFavoritesChange: (favorites: FavoriteLocation[]) => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("zh-CN", {
    month: "short",
    day: "numeric",
    weekday: "short",
  });
}

export function WeatherPanel({
  selection,
  favorites,
  onFavoritesChange,
}: WeatherPanelProps) {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locationName =
    selection?.name ??
    (selection
      ? `${selection.latitude.toFixed(2)}°, ${selection.longitude.toFixed(2)}°`
      : null);

  const favorited =
    selection && isFavorite(selection.latitude, selection.longitude, favorites);

  useEffect(() => {
    if (!selection) {
      setWeather(null);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const { latitude, longitude } = selection;

    async function loadWeather() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/weather?lat=${latitude}&lon=${longitude}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error("加载失败");

        const json = await res.json();
        setWeather(json.data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError("无法获取天气数据，请稍后重试");
        setWeather(null);
      } finally {
        setLoading(false);
      }
    }

    loadWeather();
    return () => controller.abort();
  }, [selection]);

  function handleToggleFavorite() {
    if (!selection || !locationName) return;

    if (favorited) {
      const target = favorites.find(
        (f) =>
          Math.abs(f.latitude - selection.latitude) < 0.01 &&
          Math.abs(f.longitude - selection.longitude) < 0.01
      );
      if (target) onFavoritesChange(removeFavorite(target.id));
    } else {
      onFavoritesChange(
        addFavorite(locationName, selection.latitude, selection.longitude)
      );
    }
  }

  if (!selection) {
    return (
      <Card className="h-full border-white/10 bg-slate-950/80 text-white backdrop-blur-md">
        <CardHeader>
          <CardTitle>天气详情</CardTitle>
          <CardDescription className="text-slate-400">
            点击地图任意位置查看该处天气
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center text-slate-400">
          <MapPin className="h-10 w-10 text-sky-400" />
          <p>默认中心为吉隆坡，点击地图开始探索马来西亚各地天气</p>
        </CardContent>
      </Card>
    );
  }

  const currentCode =
    weather?.current?.weathercode ??
    weather?.hourly.weathercode[0] ??
    0;
  const currentTemp =
    weather?.current?.temperature_2m ?? weather?.hourly.temperature_2m[0];

  return (
    <Card className="flex h-full flex-col border-white/10 bg-slate-950/80 text-white backdrop-blur-md">
      <CardHeader className="shrink-0 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-xl">{locationName}</CardTitle>
            <CardDescription className="text-slate-400">
              {selection.latitude.toFixed(4)}°, {selection.longitude.toFixed(4)}°
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 border-white/20 bg-white/5 hover:bg-white/10"
            onClick={handleToggleFavorite}
            disabled={loading}
            aria-label={favorited ? "取消收藏" : "收藏地点"}
          >
            <Heart
              className={`h-4 w-4 ${favorited ? "fill-rose-400 text-rose-400" : ""}`}
            />
          </Button>
        </div>

        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-32 bg-white/10" />
            <Skeleton className="h-4 w-24 bg-white/10" />
          </div>
        ) : error ? (
          <p className="text-sm text-rose-300">{error}</p>
        ) : weather ? (
          <div className="flex items-center gap-3">
            <span className="text-4xl">{getWeatherEmoji(currentCode)}</span>
            <div>
              <p className="text-4xl font-semibold tracking-tight">
                {currentTemp != null ? `${Math.round(currentTemp)}°C` : "--"}
              </p>
              <p className="text-slate-300">{getWeatherLabel(currentCode)}</p>
            </div>
          </div>
        ) : null}
      </CardHeader>

      <CardContent className="min-h-0 flex-1">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full bg-white/10" />
            ))}
          </div>
        ) : weather ? (
          <ScrollArea className="h-[min(420px,50vh)] pr-3">
            <div className="space-y-6">
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-slate-300">7 天预报</h3>
                  <Badge variant="secondary" className="bg-white/10 text-slate-200">
                    马来西亚时区
                  </Badge>
                </div>
                <div className="space-y-2">
                  {weather.daily.time.map((day, index) => (
                    <div
                      key={day}
                      className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm"
                    >
                      <span className="w-24 text-slate-300">
                        {formatDate(day)}
                      </span>
                      <span>{getWeatherEmoji(weather.daily.weathercode[index])}</span>
                      <span className="text-slate-400">
                        {getWeatherLabel(weather.daily.weathercode[index])}
                      </span>
                      <span className="font-medium">
                        {Math.round(weather.daily.temperature_2m_max[index])}° /{" "}
                        {Math.round(weather.daily.temperature_2m_min[index])}°
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-sm font-medium text-slate-300">
                  未来 24 小时
                </h3>
                <div className="space-y-2">
                  {weather.hourly.time.slice(0, 24).map((hour, index) => (
                    <div
                      key={hour}
                      className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm"
                    >
                      <span className="w-16 text-slate-400">
                        {new Date(hour).toLocaleTimeString("zh-CN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span>{getWeatherEmoji(weather.hourly.weathercode[index])}</span>
                      <span>{Math.round(weather.hourly.temperature_2m[index])}°C</span>
                      <span className="text-sky-300">
                        {weather.hourly.precipitation_probability[index] ?? 0}%
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </ScrollArea>
        ) : null}
      </CardContent>
    </Card>
  );
}
