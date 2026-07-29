"use client";

import { useCallback, useEffect, useState } from "react";
import { CloudSun } from "lucide-react";
import { FavoritesPanel } from "@/components/favorites-panel";
import { SearchBar } from "@/components/search-bar";
import { WeatherMap } from "@/components/weather-map";
import { WeatherPanel } from "@/components/weather-panel";
import { DEFAULT_CENTER } from "@/lib/constants";
import { getFavorites } from "@/lib/favorites";
import type {
  FavoriteLocation,
  GeocodingResult,
  MapSelection,
} from "@/lib/types";

export function WeatherApp() {
  const [selection, setSelection] = useState<MapSelection | null>(null);
  const [flyTo, setFlyTo] = useState<MapSelection | null>(null);
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
    setSelection({
      latitude: DEFAULT_CENTER.latitude,
      longitude: DEFAULT_CENTER.longitude,
      name: DEFAULT_CENTER.name,
    });
  }, []);

  const handleMapSelect = useCallback((next: MapSelection) => {
    setSelection(next);
    setFlyTo(null);
  }, []);

  const handleSearchSelect = useCallback((result: GeocodingResult) => {
    const next = {
      latitude: result.latitude,
      longitude: result.longitude,
      name: result.name,
    };
    setSelection(next);
    setFlyTo(next);
  }, []);

  const handleFavoriteSelect = useCallback((favorite: FavoriteLocation) => {
    const next = {
      latitude: favorite.latitude,
      longitude: favorite.longitude,
      name: favorite.name,
    };
    setSelection(next);
    setFlyTo(next);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/90 px-4 py-4 backdrop-blur-md md:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400">
              <CloudSun className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                马来西亚天气地图
              </h1>
              <p className="text-sm text-slate-400">
                点击地图查看天气 · 英文搜索 · 降雨雷达 · 本地收藏
              </p>
            </div>
          </div>
          <SearchBar onSelect={handleSearchSelect} />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 p-4 md:p-6">
        <FavoritesPanel
          favorites={favorites}
          onFavoritesChange={setFavorites}
          onSelect={handleFavoriteSelect}
        />

        <div className="grid min-h-[70vh] flex-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="min-h-[50vh] lg:min-h-0">
            <WeatherMap
              selection={selection}
              onSelect={handleMapSelect}
              flyTo={flyTo}
            />
          </div>
          <div className="min-h-[400px] lg:min-h-0">
            <WeatherPanel
              selection={selection}
              favorites={favorites}
              onFavoritesChange={setFavorites}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
