"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { WeatherResponse } from "@/lib/types";

interface TemperatureChartProps {
  weather: WeatherResponse;
}

export function TemperatureChart({ weather }: TemperatureChartProps) {
  const chartData = weather.hourly.time.slice(0, 24).map((time, index) => ({
    time: new Date(time).toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    temperature: Math.round(weather.hourly.temperature_2m[index]),
    rainChance: weather.hourly.precipitation_probability[index] ?? 0,
  }));

  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis
            dataKey="time"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            interval={3}
            tickLine={false}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          />
          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            unit="°"
          />
          <Tooltip
            contentStyle={{
              background: "rgba(15, 23, 42, 0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "#f8fafc",
            }}
            formatter={(value, name) => {
              if (name === "temperature") return [`${value}°C`, "气温"];
              return [`${value}%`, "降雨概率"];
            }}
          />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#38bdf8"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
