"use client";

import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { removeFavorite } from "@/lib/favorites";
import type { FavoriteLocation } from "@/lib/types";

interface FavoritesPanelProps {
  favorites: FavoriteLocation[];
  onFavoritesChange: (favorites: FavoriteLocation[]) => void;
  onSelect: (favorite: FavoriteLocation) => void;
}

export function FavoritesPanel({
  favorites,
  onFavoritesChange,
  onSelect,
}: FavoritesPanelProps) {
  if (favorites.length === 0) return null;

  return (
    <Card className="border-white/10 bg-slate-950/80 text-white backdrop-blur-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Star className="h-4 w-4 text-amber-400" />
          收藏地点
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {favorites.map((favorite) => (
          <div
            key={favorite.id}
            className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 pl-3"
          >
            <button
              type="button"
              className="py-1.5 text-sm hover:text-sky-300"
              onClick={() => onSelect(favorite)}
            >
              {favorite.name}
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-white/10"
              onClick={() => onFavoritesChange(removeFavorite(favorite.id))}
              aria-label={`移除 ${favorite.name}`}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
