export interface RadarFrame {
  time: number;
  path: string;
}

export interface RadarMetadata {
  host: string;
  frame: RadarFrame;
  tileUrl: string;
}

export async function getLatestRadarFrame(): Promise<RadarMetadata> {
  const res = await fetch("https://api.rainviewer.com/public/weather-maps.json", {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error("获取雷达数据失败");
  }

  const data = await res.json();
  const frames: RadarFrame[] = data.radar?.past ?? [];

  if (frames.length === 0) {
    throw new Error("暂无雷达图层");
  }

  const frame = frames[frames.length - 1];
  const host: string = data.host ?? "https://tilecache.rainviewer.com";
  const tileUrl = `${host}${frame.path}/256/{z}/{x}/{y}/2/1_1.png`;

  return { host, frame, tileUrl };
}
