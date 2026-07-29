"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Map, Marker, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { CloudRain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEFAULT_CENTER, MALAYSIA_BOUNDS } from "@/lib/constants";
import type { MapSelection } from "@/lib/types";

const RADAR_SOURCE_ID = "rainviewer-radar";
const RADAR_LAYER_ID = "rainviewer-radar-layer";

interface WeatherMapProps {
  selection: MapSelection | null;
  onSelect: (selection: MapSelection) => void;
  flyTo?: MapSelection | null;
}

export function WeatherMap({ selection, onSelect, flyTo }: WeatherMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const [radarEnabled, setRadarEnabled] = useState(false);
  const [radarLoading, setRadarLoading] = useState(false);

  const removeRadarLayer = useCallback((map: Map) => {
    if (map.getLayer(RADAR_LAYER_ID)) map.removeLayer(RADAR_LAYER_ID);
    if (map.getSource(RADAR_SOURCE_ID)) map.removeSource(RADAR_SOURCE_ID);
  }, []);

  const addRadarLayer = useCallback(
    async (map: Map) => {
      setRadarLoading(true);
      try {
        const res = await fetch("/api/radar");
        if (!res.ok) throw new Error("radar failed");
        const { tileUrl } = await res.json();

        removeRadarLayer(map);

        map.addSource(RADAR_SOURCE_ID, {
          type: "raster",
          tiles: [tileUrl],
          tileSize: 256,
        });

        map.addLayer({
          id: RADAR_LAYER_ID,
          type: "raster",
          source: RADAR_SOURCE_ID,
          paint: { "raster-opacity": 0.55 },
        });
      } finally {
        setRadarLoading(false);
      }
    },
    [removeRadarLayer]
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          "carto-dark": {
            type: "raster",
            tiles: [
              "https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
            ],
            tileSize: 256,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
          },
        },
        layers: [
          {
            id: "carto-dark-layer",
            type: "raster",
            source: "carto-dark",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [DEFAULT_CENTER.longitude, DEFAULT_CENTER.latitude],
      zoom: DEFAULT_CENTER.zoom,
      maxBounds: MALAYSIA_BOUNDS,
    });

    map.addControl(new NavigationControl(), "top-right");

    map.on("click", (e) => {
      onSelect({
        latitude: e.lngLat.lat,
        longitude: e.lngLat.lng,
      });
    });

    mapRef.current = map;

    return () => {
      markerRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, [onSelect]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selection) return;

    if (!markerRef.current) {
      markerRef.current = new Marker({ color: "#38bdf8" })
        .setLngLat([selection.longitude, selection.latitude])
        .addTo(map);
    } else {
      markerRef.current.setLngLat([
        selection.longitude,
        selection.latitude,
      ]);
    }
  }, [selection]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !flyTo) return;

    map.flyTo({
      center: [flyTo.longitude, flyTo.latitude],
      zoom: 11,
      essential: true,
    });
  }, [flyTo]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (radarEnabled) {
      void addRadarLayer(map);
    } else {
      removeRadarLayer(map);
    }
  }, [radarEnabled, addRadarLayer, removeRadarLayer]);

  return (
    <div className="relative h-full w-full">
      <div
        ref={containerRef}
        className="h-full w-full rounded-xl border border-white/10 shadow-2xl"
      />
      <div className="absolute top-3 left-3 z-10">
        <Button
          type="button"
          size="sm"
          variant={radarEnabled ? "default" : "outline"}
          className={
            radarEnabled
              ? "bg-sky-600 hover:bg-sky-500"
              : "border-white/20 bg-slate-950/80 text-white backdrop-blur-md hover:bg-slate-900"
          }
          onClick={() => setRadarEnabled((prev) => !prev)}
          disabled={radarLoading}
        >
          <CloudRain className="mr-1.5 h-4 w-4" />
          {radarLoading ? "加载雷达…" : radarEnabled ? "关闭雷达" : "降雨雷达"}
        </Button>
      </div>
    </div>
  );
}
