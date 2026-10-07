import { WeatherDay } from '../types';

export interface HourlyForecast {
  time: string;
  temperature: number;
  rainProbability: number;
  humidity: number;
  evapotranspiration: number;
}

export interface WeatherData {
  locationName: string;
  latitude: number;
  longitude: number;
  temperature: number;
  humidity: number;
  rainProbability: number;
  windSpeedKmH: number;
  evapotranspirationET0: number; // mm/day (FAO-56 Penman-Monteith)
  soilMoistureSatellitePercent: number; // 0-100%
  solarRadiationWm2: number;
  condition: string;
  isLive: boolean;
  forecast: WeatherDay[];
  hourly: HourlyForecast[];
  sprayAdvisory: {
    safeToSpray: boolean;
    reason: string;
  };
  irrigationAdvisory: {
    recommendedAction: 'IRRIGATE' | 'WAIT' | 'NORMAL';
    reason: string;
  };
}

export interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; // State / Province
}

// Free Open-Meteo Geocoding API
export async function searchGeocodingLocations(query: string): Promise<GeocodingResult[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=5&language=en&format=json`;
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) return [];
    
    return data.results.map((r: any) => ({
      name: r.name,
      latitude: r.latitude,
      longitude: r.longitude,
      country: r.country || '',
      admin1: r.admin1 || '',
    }));
  } catch {
    return [];
  }
}

// Free Reverse Geocoding to get real village/town and state from GPS coords
export async function reverseGeocodeLocation(latitude: number, longitude: number): Promise<string> {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      const place = data.locality || data.city || data.principalSubdivision || data.localityInfo?.administrative?.[3]?.name;
      const state = data.principalSubdivision || data.countryName;
      if (place && state) {
        return `${place}, ${state}`;
      } else if (place) {
        return place;
      }
    }
  } catch (e) {
    console.warn('BigDataCloud reverse geocode failed, trying fallback...', e);
  }

  try {
    const osmUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14`;
    const osmRes = await fetch(osmUrl, {
      headers: { 'Accept-Language': 'en' },
      signal: AbortSignal.timeout(4000),
    });
    if (osmRes.ok) {
      const osmData = await osmRes.json();
      const addr = osmData.address || {};
      const village = addr.village || addr.town || addr.city || addr.suburb || addr.county;
      const state = addr.state || addr.country;
      if (village && state) {
        return `${village}, ${state}`;
      }
    }
  } catch (err) {
    console.warn('OSM reverse geocode failed:', err);
  }

  return `Lat ${latitude.toFixed(2)}, Lon ${longitude.toFixed(2)}`;
}

/**
 * Weather code interpreter (WMO standard)
 */
function interpretWmoCode(code: number): { condition: string; weatherType: WeatherDay['condition'] } {
  if (code === 0) return { condition: 'Clear Sky', weatherType: 'Sunny' };
  if (code === 1 || code === 2) return { condition: 'Mainly Clear', weatherType: 'Sunny' };
  if (code === 3) return { condition: 'Overcast', weatherType: 'Cloudy' };
  if (code >= 45 && code <= 48) return { condition: 'Foggy / Hazy', weatherType: 'Partly Cloudy' };
  if (code >= 51 && code <= 55) return { condition: 'Light Drizzle', weatherType: 'Light Rain' };
  if (code >= 61 && code <= 65) return { condition: 'Rain Showers', weatherType: 'Light Rain' };
  if (code >= 80 && code <= 82) return { condition: 'Heavy Rain Showers', weatherType: 'Heavy Rain' };
  if (code >= 95) return { condition: 'Thunderstorm', weatherType: 'Thunderstorm' };
  return { condition: 'Partly Cloudy', weatherType: 'Partly Cloudy' };
}

/**
 * Fetch 100% Free & Accurate Agricultural Weather from Open-Meteo
 * Defaults to Tadikalapudi, Andhra Pradesh (16.96°N, 81.12°E)
 */
export async function fetchWeatherData(
  latitude = 16.9600, 
  longitude = 81.1200, 
  locationName = 'Tadikalapudi, Andhra Pradesh'
): Promise<WeatherData> {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'precipitation',
        'precipitation_probability',
        'weather_code',
        'wind_speed_10m',
        'direct_radiation',
      ].join(','),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'precipitation_probability',
        'et0_fao_evapotranspiration',
        'soil_moisture_0_to_1cm',
      ].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_probability_max',
        'precipitation_sum',
        'et0_fao_evapotranspiration',
      ].join(','),
      timezone: 'auto',
      forecast_days: '7',
    });

    const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
    
    const data = await res.json();

    const currentTemp = Math.round(data.current?.temperature_2m ?? 33);
    const currentHumidity = Math.round(data.current?.relative_humidity_2m ?? 45);
    const currentRainProb = Math.round(data.current?.precipitation_probability ?? 10);
    const currentWind = Math.round(data.current?.wind_speed_10m ?? 12);
    const currentSolar = Math.round(data.current?.direct_radiation ?? 650);
    const wmo = interpretWmoCode(data.current?.weather_code ?? 0);

    // Evapotranspiration ET0
    const todayEt0 = data.daily?.et0_fao_evapotranspiration?.[0] ?? 4.8;
    const soilMoistureRaw = data.hourly?.soil_moisture_0_to_1cm?.[0] ?? 0.28;
    const soilMoisturePercent = Math.min(100, Math.round(soilMoistureRaw * 100 * 2.2)); // scaled to root %

    // Parse 7-day daily forecast
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const forecastDays: WeatherDay[] = [];

    if (data.daily && data.daily.time) {
      for (let i = 0; i < Math.min(7, data.daily.time.length); i++) {
        const d = new Date(data.daily.time[i]);
        const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : days[d.getDay()];
        const rainProb = data.daily.precipitation_probability_max?.[i] ?? 10;
        const maxT = Math.round(data.daily.temperature_2m_max?.[i] ?? 33);
        const minT = Math.round(data.daily.temperature_2m_min?.[i] ?? 23);
        const codeInfo = interpretWmoCode(data.daily.weather_code?.[i] ?? 0);
        const rainSum = data.daily.precipitation_sum?.[i] ?? 0;

        let advisory = 'Normal farming window.';
        if (rainProb >= 60 || rainSum >= 5) {
          advisory = '🌧️ Rain expected. Postpone irrigation to avoid waterlogging and fertilizer runoff.';
        } else if (maxT >= 35) {
          advisory = 'High temperature alert. Early morning irrigation is best to minimize evaporation.';
        } else if (rainProb < 20 && maxT >= 30) {
          advisory = 'Clear and dry. Check soil moisture probe and irrigate thirsty crops.';
        }

        forecastDays.push({
          dayName,
          dateStr: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          tempMax: maxT,
          tempMin: minT,
          rainProbability: rainProb,
          condition: codeInfo.weatherType,
          humidity: currentHumidity,
          windSpeedKmH: currentWind,
          advisory,
        });
      }
    }

    // Parse next 12 hours
    const hourlyForecasts: HourlyForecast[] = [];
    if (data.hourly && data.hourly.time) {
      const nowIdx = new Date().getHours();
      for (let i = nowIdx; i < Math.min(nowIdx + 12, data.hourly.time.length); i++) {
        const tStr = new Date(data.hourly.time[i]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        hourlyForecasts.push({
          time: tStr,
          temperature: Math.round(data.hourly.temperature_2m[i]),
          rainProbability: Math.round(data.hourly.precipitation_probability[i] || 0),
          humidity: Math.round(data.hourly.relative_humidity_2m[i]),
          evapotranspiration: parseFloat((data.hourly.et0_fao_evapotranspiration?.[i] || 0.3).toFixed(2)),
        });
      }
    }

    // Agricultural Spraying Advisory
    const safeToSpray = currentWind <= 15 && currentRainProb <= 25 && currentTemp <= 35;
    const sprayReason = !safeToSpray 
      ? (currentWind > 15 ? 'Wind velocity > 15 km/h causes spray drift.' : currentRainProb > 25 ? 'Rain probability elevated. Spray may wash off.' : 'High midday heat.')
      : 'Optimal weather window for foliar sprays & pesticide application.';

    // Agricultural Irrigation Advisory
    const recommendedAction = currentRainProb >= 60 ? 'WAIT' : currentTemp >= 34 ? 'IRRIGATE' : 'NORMAL';
    const irrigationReason = currentRainProb >= 60 
      ? 'Rain expected in forecast. Postpone irrigation to save water.' 
      : `Reference Evapotranspiration (ET0) is ${todayEt0} mm/day. Apply water to maintain active root zone hydration.`;

    return {
      locationName,
      latitude,
      longitude,
      temperature: currentTemp,
      humidity: currentHumidity,
      rainProbability: currentRainProb,
      windSpeedKmH: currentWind,
      evapotranspirationET0: parseFloat(todayEt0.toFixed(1)),
      soilMoistureSatellitePercent: soilMoisturePercent,
      solarRadiationWm2: currentSolar,
      condition: wmo.condition,
      isLive: true,
      forecast: forecastDays,
      hourly: hourlyForecasts,
      sprayAdvisory: {
        safeToSpray,
        reason: sprayReason,
      },
      irrigationAdvisory: {
        recommendedAction,
        reason: irrigationReason,
      },
    };
  } catch (err) {
    console.warn('Open-Meteo fetch failed, using fallback agricultural forecast:', err);
    return {
      locationName,
      latitude,
      longitude,
      temperature: 34,
      humidity: 42,
      rainProbability: 8,
      windSpeedKmH: 12,
      evapotranspirationET0: 4.8,
      soilMoistureSatellitePercent: 28,
      solarRadiationWm2: 700,
      condition: 'Sunny & Clear',
      isLive: false,
      forecast: [
        { dayName: 'Today', dateStr: 'Oct 7', tempMax: 34, tempMin: 24, rainProbability: 8, condition: 'Sunny', humidity: 42, windSpeedKmH: 12, advisory: 'High evaporation rates expected.' },
        { dayName: 'Tomorrow', dateStr: 'Oct 8', tempMax: 35, tempMin: 25, rainProbability: 12, condition: 'Sunny', humidity: 45, windSpeedKmH: 14, advisory: 'Optimal morning spray window.' },
        { dayName: 'Wednesday', dateStr: 'Oct 9', tempMax: 32, tempMin: 23, rainProbability: 40, condition: 'Partly Cloudy', humidity: 60, windSpeedKmH: 15, advisory: 'Cloud cover increasing.' },
        { dayName: 'Thursday', dateStr: 'Oct 10', tempMax: 30, tempMin: 22, rainProbability: 70, condition: 'Light Rain', humidity: 78, windSpeedKmH: 18, advisory: 'Rain expected. Postpone irrigation.' },
        { dayName: 'Friday', dateStr: 'Oct 11', tempMax: 29, tempMin: 22, rainProbability: 65, condition: 'Light Rain', humidity: 80, windSpeedKmH: 16, advisory: 'Inspect field drainage channels.' },
        { dayName: 'Saturday', dateStr: 'Oct 12', tempMax: 31, tempMin: 23, rainProbability: 25, condition: 'Partly Cloudy', humidity: 65, windSpeedKmH: 11, advisory: 'Post-rain drying phase.' },
        { dayName: 'Sunday', dateStr: 'Oct 13', tempMax: 33, tempMin: 24, rainProbability: 15, condition: 'Sunny', humidity: 50, windSpeedKmH: 10, advisory: 'Normal conditions return.' },
      ],
      hourly: [],
      sprayAdvisory: {
        safeToSpray: true,
        reason: 'Optimal weather window for foliar sprays & pesticide application.',
      },
      irrigationAdvisory: {
        recommendedAction: 'IRRIGATE',
        reason: 'Dry conditions prevailing under 34°C ambient heat.',
      },
    };
  }
}
