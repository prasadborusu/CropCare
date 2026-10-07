import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  CloudRain, 
  Sun, 
  Wind, 
  Droplets, 
  Thermometer, 
  AlertCircle, 
  Sparkles, 
  RefreshCw, 
  MapPin, 
  Calendar, 
  LocateFixed,
  Search,
  CheckCircle2,
  Activity,
  Waves,
  SunMedium
} from 'lucide-react';
import { 
  fetchWeatherData, 
  searchGeocodingLocations, 
  WeatherData, 
  GeocodingResult 
} from '../services/weatherService';
import { StorageService } from '../services/storageService';
import { LocationService } from '../services/locationService';

export const WeatherView: React.FC = () => {
  const initialLoc = StorageService.getLocation();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Geocoding Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lon: number; name: string }>({
    lat: 16.9600,
    lon: 81.1200,
    name: initialLoc || 'Live Farm Location',
  });

  const loadWeather = async (lat = currentCoords.lat, lon = currentCoords.lon, name = currentCoords.name) => {
    setLoading(true);
    const data = await fetchWeatherData(lat, lon, name);
    setWeather(data);
    setLoading(false);
  };

  useEffect(() => {
    // Initial weather load using fast LocationService if needed
    if (initialLoc === 'Live Farm Location' && currentCoords.lat === 16.96 && currentCoords.lon === 81.12) {
      LocationService.getCurrentLocation({ timeoutMs: 3000, fallbackToNetwork: true }).then((loc) => {
        setCurrentCoords({
          lat: loc.lat,
          lon: loc.lng,
          name: loc.placeName || StorageService.getLocation() || 'My Farm Location',
        });
      });
    } else {
      loadWeather();
    }
  }, [currentCoords]);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const results = await searchGeocodingLocations(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSelectLocation = (loc: GeocodingResult) => {
    const locName = `${loc.name}${loc.admin1 ? `, ${loc.admin1}` : ''}, ${loc.country}`;
    setCurrentCoords({
      lat: loc.latitude,
      lon: loc.longitude,
      name: locName,
    });
    StorageService.setLocation(locName);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleGPSDetect = async () => {
    setLoading(true);
    try {
      const loc = await LocationService.getCurrentLocation({
        enableHighAccuracy: true,
        timeoutMs: 5000,
        fallbackToNetwork: true,
      });
      const locName = loc.placeName || `GPS (${loc.lat.toFixed(2)}°N, ${loc.lng.toFixed(2)}°E)`;
      setCurrentCoords({ lat: loc.lat, lon: loc.lng, name: locName });
      StorageService.setLocation(locName);
    } catch {
      alert('Could not retrieve GPS coordinates. You can search by town or district name.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header & Free Weather API Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Agricultural Weather & Radar
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Live Open-Meteo API (Free & Accurate)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{currentCoords.name} ({currentCoords.lat.toFixed(2)}°N, {currentCoords.lon.toFixed(2)}°E)</span>
          </p>
        </div>

        {/* Location Search Bar with Geocoding */}
        <div className="relative flex items-center gap-2 w-full lg:w-auto">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 lg:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search village, city, district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 bg-white shadow-sm outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </form>

          <button
            type="button"
            onClick={handleGPSDetect}
            title="Auto-detect via GPS"
            className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm transition-colors"
          >
            <LocateFixed className="w-4 h-4 text-emerald-600" />
          </button>

          <button
            onClick={() => loadWeather()}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-colors"
            title="Refresh live data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-12 left-0 right-0 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in space-y-1">
              {searchResults.map((r, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectLocation(r)}
                  className="w-full text-left p-2 rounded-xl hover:bg-emerald-50 text-xs font-semibold text-slate-800 flex items-center justify-between"
                >
                  <span>{r.name}{r.admin1 ? `, ${r.admin1}` : ''}, {r.country}</span>
                  <span className="text-[10px] text-slate-400">{r.latitude.toFixed(2)}°, {r.longitude.toFixed(2)}°</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading || !weather ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Retrieving high-accuracy satellite radar data for your coordinates...</p>
        </div>
      ) : (
        <>
          {/* Top 2 Agricultural Advisory Banners */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Spraying Window Advisory */}
            <div className={`p-5 rounded-3xl border flex items-start gap-3.5 ${
              weather.sprayAdvisory.safeToSpray 
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
                : 'bg-amber-50/70 border-amber-200 text-amber-950'
            }`}>
              <div className={`p-2.5 rounded-2xl ${
                weather.sprayAdvisory.safeToSpray ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
              }`}>
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Foliar & Pesticide Spray Window
                </span>
                <h4 className="font-extrabold text-base text-slate-900 mt-0.5">
                  {weather.sprayAdvisory.safeToSpray ? '✅ Safe to Spray Today' : '⚠️ Unfavorable Spray Window'}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {weather.sprayAdvisory.reason} (Wind: {weather.windSpeedKmH} km/h, Rain: {weather.rainProbability}%)
                </p>
              </div>
            </div>

            {/* Evapotranspiration & Irrigation Advisory */}
            <div className="p-5 rounded-3xl border border-sky-200 bg-sky-50/70 text-sky-950 flex items-start gap-3.5">
              <div className="p-2.5 rounded-2xl bg-sky-600 text-white">
                <SunMedium className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  FAO-56 Evapotranspiration Rate
                </span>
                <h4 className="font-extrabold text-base text-slate-900 mt-0.5">
                  ET₀ Index: {weather.evapotranspirationET0} mm/day
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {weather.irrigationAdvisory.reason}
                </p>
              </div>
            </div>

          </div>

          {/* Current Conditions Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Live Meteorological Telemetry</h3>
                <p className="text-xs text-slate-500">Directly measured via Open-Meteo satellite feed</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {weather.condition}
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-center gap-3">
                <div className="p-3 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
                  <Thermometer className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Temperature</p>
                  <p className="text-3xl font-extrabold text-slate-900">{weather.temperature}°C</p>
                  <p className="text-[11px] font-medium text-amber-700">2m ambient</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-center gap-3">
                <div className="p-3 rounded-xl bg-sky-500 text-white shadow-md shadow-sky-500/20">
                  <Droplets className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Humidity</p>
                  <p className="text-3xl font-extrabold text-slate-900">{weather.humidity}%</p>
                  <p className="text-[11px] font-medium text-sky-700">Relative humidity</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-500 text-white shadow-md shadow-blue-500/20">
                  <CloudRain className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Rain Probability</p>
                  <p className="text-3xl font-extrabold text-slate-900">{weather.rainProbability}%</p>
                  <p className="text-[11px] font-medium text-blue-700">Precipitation radar</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100 flex items-center gap-3">
                <div className="p-3 rounded-xl bg-teal-500 text-white shadow-md shadow-teal-500/20">
                  <Wind className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Wind Speed</p>
                  <p className="text-3xl font-extrabold text-slate-900">{weather.windSpeedKmH} km/h</p>
                  <p className="text-[11px] font-medium text-teal-700">10m surface level</p>
                </div>
              </div>

            </div>
          </div>

          {/* 7-Day Forecast Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span>7-Day Agricultural Forecast</span>
              </h3>
              <span className="text-xs text-slate-400">Rain Probabilities & Daily Soil Advisories</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
              {weather.forecast.map((day, idx) => {
                const isRainy = day.rainProbability >= 60;
                return (
                  <div 
                    key={idx}
                    className={`p-4 rounded-3xl border flex flex-col justify-between transition-all ${
                      isRainy 
                        ? 'bg-sky-50/80 border-sky-300 shadow-sm' 
                        : idx === 0 
                        ? 'bg-emerald-50/50 border-emerald-300 ring-2 ring-emerald-400/20'
                        : 'bg-white border-slate-200/80'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{day.dayName}</span>
                        <span className="text-[10px] text-slate-400">{day.dateStr}</span>
                      </div>

                      <div className="my-3 flex items-center justify-between">
                        {isRainy ? (
                          <CloudRain className="w-8 h-8 text-sky-600" />
                        ) : day.rainProbability > 25 ? (
                          <CloudSun className="w-8 h-8 text-amber-500" />
                        ) : (
                          <Sun className="w-8 h-8 text-amber-500" />
                        )}
                        <div className="text-right">
                          <span className="text-lg font-extrabold text-slate-900">{day.tempMax}°</span>
                          <span className="text-xs text-slate-400 ml-1">/ {day.tempMin}°</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500 flex items-center gap-1">
                            <CloudRain className="w-3 h-3 text-sky-500" /> Rain:
                          </span>
                          <strong className={`font-bold ${isRainy ? 'text-sky-700' : 'text-slate-700'}`}>
                            {day.rainProbability}%
                          </strong>
                        </div>

                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${isRainy ? 'bg-sky-500' : 'bg-emerald-500'}`}
                            style={{ width: `${day.rainProbability}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 text-[11px] text-slate-600 line-clamp-2 font-medium">
                      {day.advisory}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

    </div>
  );
};
