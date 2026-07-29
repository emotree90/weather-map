export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  timezone: string;
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    precipitation: number[];
    weathercode: number[];
  };
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
  current?: {
    time: string;
    temperature_2m: number;
    weathercode: number;
  };
}

export interface FavoriteLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

export interface MapSelection {
  latitude: number;
  longitude: number;
  name?: string;
}
