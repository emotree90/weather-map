import type { FavoriteLocation } from "@/lib/types";

const STORAGE_KEY = "weather-map-favorites";

export function getFavorites(): FavoriteLocation[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as FavoriteLocation[];
  } catch {
    return [];
  }
}

export function saveFavorites(favorites: FavoriteLocation[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export function addFavorite(
  name: string,
  latitude: number,
  longitude: number
): FavoriteLocation[] {
  const favorites = getFavorites();
  const exists = favorites.some(
    (f) =>
      f.name === name &&
      Math.abs(f.latitude - latitude) < 0.01 &&
      Math.abs(f.longitude - longitude) < 0.01
  );

  if (exists) return favorites;

  const next: FavoriteLocation[] = [
    {
      id: crypto.randomUUID(),
      name,
      latitude,
      longitude,
      createdAt: new Date().toISOString(),
    },
    ...favorites,
  ].slice(0, 10);

  saveFavorites(next);
  return next;
}

export function removeFavorite(id: string): FavoriteLocation[] {
  const next = getFavorites().filter((f) => f.id !== id);
  saveFavorites(next);
  return next;
}

export function isFavorite(
  latitude: number,
  longitude: number,
  favorites: FavoriteLocation[]
): boolean {
  return favorites.some(
    (f) =>
      Math.abs(f.latitude - latitude) < 0.01 &&
      Math.abs(f.longitude - longitude) < 0.01
  );
}
