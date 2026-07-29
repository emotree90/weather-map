/** 默认中心：吉隆坡 */
export const DEFAULT_CENTER = {
  latitude: 3.139,
  longitude: 101.6869,
  zoom: 10,
  name: "吉隆坡",
} as const;

/** 马来西亚大致边界，用于限制地图视野 */
export const MALAYSIA_BOUNDS: [[number, number], [number, number]] = [
  [99.0, 0.8],
  [119.5, 7.5],
];
