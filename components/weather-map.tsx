"use client";

import { useEffect, useRef } from "react";
import { Map, Marker, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { DEFAULT_CENTER, MALAYSIA_BOUNDS } from "@/lib/constants";
import type { MapSelection } from "@/lib/types";

interface WeatherMapProps {
  selection: MapSelection | null;
  onSelect: (selection: MapSelection) => void;
  flyTo?: MapSelection | null;
}

export function WeatherMap({ selection, onSelect, flyTo }: WeatherMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);

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

  return (
    <div
      ref={containerRef}
      className="h-full w-full rounded-xl border border-white/10 shadow-2xl"
    />
  );
}
