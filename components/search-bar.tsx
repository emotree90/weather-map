"use client";

import { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { GeocodingResult } from "@/lib/types";

interface SearchBarProps {
  onSelect: (result: GeocodingResult) => void;
}

export function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/geocoding?q=${encodeURIComponent(query.trim())}`
        );
        const json = await res.json();

        if (!res.ok) {
          setError(json.error ?? "搜索失败");
          setResults([]);
          return;
        }

        setResults(json.results ?? []);
      } catch {
        setError("搜索失败，请稍后重试");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索马来西亚城市（英文）…"
          className="border-white/20 bg-slate-950/80 pl-9 text-white placeholder:text-slate-500 backdrop-blur-md"
        />
        {loading && (
          <Loader2 className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
        )}
      </div>

      {(results.length > 0 || error) && query.trim().length >= 2 && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-md">
          {error ? (
            <p className="px-4 py-3 text-sm text-rose-300">{error}</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-slate-400">未找到匹配地点</p>
          ) : (
            <ul>
              {results.map((result) => (
                <li key={result.id}>
                  <button
                    type="button"
                    className="flex w-full flex-col items-start px-4 py-3 text-left transition hover:bg-white/5"
                    onClick={() => {
                      onSelect(result);
                      setQuery(result.name);
                      setResults([]);
                    }}
                  >
                    <span className="font-medium text-white">{result.name}</span>
                    <span className="text-xs text-slate-400">
                      {[result.admin1, result.country].filter(Boolean).join(" · ")}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
