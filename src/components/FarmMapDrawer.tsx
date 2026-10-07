import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  LocateFixed, 
  Layers, 
  Undo2, 
  Trash2, 
  Check, 
  Search, 
  Maximize2, 
  Info,
  Ruler,
  Compass,
  Navigation,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { calculatePolygonArea, LatLngPoint, FarmAreaCalculation } from '../utils/geoAreaCalculator';
import { searchGeocodingLocations, GeocodingResult } from '../services/weatherService';
import { LocationService } from '../services/locationService';

interface FarmMapDrawerProps {
  initialCenter?: { lat: number; lng: number };
  initialPoints?: LatLngPoint[];
  onAreaCalculated?: (calc: FarmAreaCalculation, points: LatLngPoint[]) => void;
  className?: string;
}

export const FarmMapDrawer: React.FC<FarmMapDrawerProps> = ({
  initialCenter = { lat: 16.96, lng: 81.12 }, // Default Tadikalapudi AP
  initialPoints = [],
  onAreaCalculated,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonLayerRef = useRef<L.Polygon | null>(null);
  const polylineLayerRef = useRef<L.Polyline | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const userLocationMarkerRef = useRef<L.Marker | null>(null);

  const [points, setPoints] = useState<LatLngPoint[]>(initialPoints);
  const [mapType, setMapType] = useState<'hybrid' | 'street' | 'esri'>('hybrid');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [userGpsPos, setUserGpsPos] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [areaCalc, setAreaCalc] = useState<FarmAreaCalculation>(calculatePolygonArea(initialPoints));

  // Layer groups for different map types
  const hybridLayerGroupRef = useRef<L.TileLayer | null>(null);
  const streetLayerRef = useRef<L.TileLayer | null>(null);
  const esriSatLayerRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize Leaflet Map
      const map = L.map(mapContainerRef.current, {
        center: [initialCenter.lat, initialCenter.lng],
        zoom: 16,
        zoomControl: true,
      });

      // 1. GOOGLE HYBRID SATELLITE (Satellite + village names, roads, landmarks - NO WATERMARK)
      const googleHybrid = L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        maxZoom: 21,
        maxNativeZoom: 20,
        attribution: 'Google Satellite & Labels',
      });
      hybridLayerGroupRef.current = googleHybrid;

      // 2. OPENSTREETMAP (Village names, panchayats, roads - 100% Free - NO WATERMARK)
      const osmStreet = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        maxNativeZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      });
      streetLayerRef.current = osmStreet;

      // 3. ESRI HIGH-RES FIELD SATELLITE
      const esriSat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 20,
        maxNativeZoom: 18,
        attribution: 'Esri Satellite',
      });
      esriSatLayerRef.current = esriSat;

      // Add default Google Hybrid Satellite with village labels
      googleHybrid.addTo(map);

      // Force recalculate dimensions inside modal
      setTimeout(() => {
        map.invalidateSize();
      }, 300);

      // Marker layers
      const markersGroup = L.layerGroup().addTo(map);
      markersLayerGroupRef.current = markersGroup;

      // Click event to drop boundary pin
      map.on('click', (e: L.LeafletMouseEvent) => {
        const newPoint: LatLngPoint = {
          lat: parseFloat(e.latlng.lat.toFixed(6)),
          lng: parseFloat(e.latlng.lng.toFixed(6)),
        };

        setPoints((prev) => [...prev, newPoint]);
      });

      mapInstanceRef.current = map;

      // Auto-trigger live location detection
      triggerLiveLocation(map);
    }

    // Set up ResizeObserver to handle modal transitions & responsive layouts
    let resizeObserver: ResizeObserver | null = null;
    if (mapContainerRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Polygon and Markers whenever points change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    if (polygonLayerRef.current) {
      map.removeLayer(polygonLayerRef.current);
      polygonLayerRef.current = null;
    }
    if (polylineLayerRef.current) {
      map.removeLayer(polylineLayerRef.current);
      polylineLayerRef.current = null;
    }

    // Render vertex markers
    points.forEach((pt, index) => {
      const customIcon = L.divIcon({
        className: 'custom-pin-marker',
        html: `
          <div style="
            background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
            color: #ffffff; 
            width: 28px; 
            height: 28px; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-weight: 800; 
            font-size: 12px; 
            border: 2.5px solid #ffffff; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            cursor: grab;
          ">
            ${index + 1}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([pt.lat, pt.lng], {
        icon: customIcon,
        draggable: true,
      });

      marker.on('dragend', (e) => {
        const target = e.target;
        const newPos = target.getLatLng();
        setPoints((prev) => {
          const updated = [...prev];
          updated[index] = {
            lat: parseFloat(newPos.lat.toFixed(6)),
            lng: parseFloat(newPos.lng.toFixed(6)),
          };
          return updated;
        });
      });

      markersGroup.addLayer(marker);
    });

    // If >= 3 points, draw closed polygon
    if (points.length >= 3) {
      const latLngs = points.map((p) => [p.lat, p.lng] as [number, number]);
      const polygon = L.polygon(latLngs, {
        color: '#10b981',
        weight: 3.5,
        fillColor: '#34d399',
        fillOpacity: 0.38,
        dashArray: '6, 6',
      }).addTo(map);

      polygonLayerRef.current = polygon;
    } else if (points.length === 2) {
      const polyline = L.polyline(
        points.map((p) => [p.lat, p.lng] as [number, number]),
        { color: '#10b981', weight: 3.5, dashArray: '4, 4' }
      ).addTo(map);
      polylineLayerRef.current = polyline;
    }

    // Calculate Geodesic Area
    const calculation = calculatePolygonArea(points);
    setAreaCalc(calculation);
    if (onAreaCalculated) {
      onAreaCalculated(calculation, points);
    }
  }, [points]);

  // Handle Layer switch
  const handleToggleMapType = (type: 'hybrid' | 'street' | 'esri') => {
    const map = mapInstanceRef.current;
    if (!map) return;
    setMapType(type);

    if (hybridLayerGroupRef.current) map.removeLayer(hybridLayerGroupRef.current);
    if (streetLayerRef.current) map.removeLayer(streetLayerRef.current);
    if (esriSatLayerRef.current) map.removeLayer(esriSatLayerRef.current);

    if (type === 'hybrid' && hybridLayerGroupRef.current) {
      hybridLayerGroupRef.current.addTo(map);
    } else if (type === 'street' && streetLayerRef.current) {
      streetLayerRef.current.addTo(map);
    } else if (type === 'esri' && esriSatLayerRef.current) {
      esriSatLayerRef.current.addTo(map);
    }
  };

  // Live Location Detection Function
  const triggerLiveLocation = async (mapInstance?: L.Map, isManual = false) => {
    const map = mapInstance || mapInstanceRef.current;
    setIsLocatingGPS(true);
    setGpsError(null);

    try {
      const loc = await LocationService.getCurrentLocation({
        enableHighAccuracy: isManual,
        timeoutMs: isManual ? 5000 : 3000,
        fallbackToNetwork: true,
      });

      setIsLocatingGPS(false);
      setUserGpsPos({ lat: loc.lat, lng: loc.lng });

      if (loc.permissionStatus === 'denied') {
        setGpsError('Browser location permission is blocked. Loaded approximate farm area via network. Click 🔒 in address bar to allow high-accuracy GPS.');
      }

      if (map) {
        map.flyTo([loc.lat, loc.lng], loc.source === 'gps' ? 17 : 14, { duration: 1.2 });

        // Show pulsing user location pin
        if (userLocationMarkerRef.current) {
          map.removeLayer(userLocationMarkerRef.current);
        }

        const isGps = loc.source === 'gps';
        const userIcon = L.divIcon({
          className: 'live-user-marker',
          html: `
            <div style="position: relative; width: 22px; height: 22px;">
              <div style="
                position: absolute;
                width: 22px;
                height: 22px;
                border-radius: 50%;
                background: ${isGps ? '#3b82f6' : '#10b981'};
                border: 3px solid #ffffff;
                box-shadow: 0 0 12px ${isGps ? 'rgba(59,130,246,0.9)' : 'rgba(16,185,129,0.9)'};
              "></div>
              <div style="
                position: absolute;
                top: -6px;
                left: -6px;
                width: 34px;
                height: 34px;
                border-radius: 50%;
                background: ${isGps ? 'rgba(59,130,246,0.3)' : 'rgba(16,185,129,0.3)'};
                animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
              "></div>
            </div>
          `,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });

        const label = isGps
          ? `📍 Live GPS (±${Math.round(loc.accuracy)}m)`
          : `📍 Farm Area (${loc.placeName || 'Network Detected'})`;

        const uMarker = L.marker([loc.lat, loc.lng], {
          icon: userIcon,
          title: label,
        }).addTo(map);

        uMarker.bindPopup(`<b>${label}</b><br>Lat: ${loc.lat.toFixed(5)}, Lng: ${loc.lng.toFixed(5)}`);
        userLocationMarkerRef.current = uMarker;
      }
    } catch (err) {
      setIsLocatingGPS(false);
      setGpsError('Could not auto-detect location. Please search your village or click on the map.');
    }
  };

  // Add Current User Position as a pin
  const handlePinCurrentLocation = () => {
    if (!userGpsPos) {
      triggerLiveLocation();
      return;
    }
    const newPoint: LatLngPoint = {
      lat: parseFloat(userGpsPos.lat.toFixed(6)),
      lng: parseFloat(userGpsPos.lng.toFixed(6)),
    };
    setPoints((prev) => [...prev, newPoint]);
  };

  // Village/City Search with fallback to OpenStreetMap Nominatim
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);

    try {
      // 1. Try Open-Meteo Geocoding
      let results = await searchGeocodingLocations(searchQuery);

      // 2. Fallback to OpenStreetMap Nominatim for local Indian villages & mandals
      if (results.length === 0) {
        const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.trim())}&limit=5&countrycodes=in`;
        const nomRes = await fetch(nomUrl, {
          headers: { 'Accept-Language': 'en' },
          signal: AbortSignal.timeout(4000),
        });
        if (nomRes.ok) {
          const nomData = await nomRes.json();
          if (Array.isArray(nomData)) {
            results = nomData.map((item: any) => ({
              name: item.display_name.split(',')[0],
              latitude: parseFloat(item.lat),
              longitude: parseFloat(item.lon),
              country: 'India',
              admin1: item.display_name.split(',').slice(1, 3).join(','),
            }));
          }
        }
      }

      setSearchResults(results);
    } catch (err) {
      console.warn('Geocoding search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (loc: GeocodingResult) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([loc.latitude, loc.longitude], 16, { duration: 1.5 });
    }
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleUndo = () => {
    setPoints((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPoints([]);
  };

  return (
    <div className={`flex flex-col bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden ${className}`}>
      
      {/* Top Map Control Bar */}
      <div className="p-3 sm:p-4 border-b border-slate-200/80 bg-slate-50/90 flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Search village / location */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search village, mandal, or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-16 py-2 rounded-xl text-xs font-semibold border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 shadow-sm placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-colors"
            >
              {isSearching ? '...' : 'Find'}
            </button>
          </form>

          {searchResults.length > 0 && (
            <div className="absolute top-11 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-[1000] space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">Matching Locations</div>
              {searchResults.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectLocation(r)}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 text-xs font-bold text-slate-800 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{r.name}{r.admin1 ? `, ${r.admin1}` : ''}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 ml-2 shrink-0">{r.country}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Controls & GPS Button */}
        <div className="flex items-center flex-wrap gap-2">
          
          {/* Layer switcher with Satellite + Village Labels */}
          <div className="flex rounded-xl bg-slate-200/90 p-0.5 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => handleToggleMapType('hybrid')}
              title="Satellite View with Village, Road & City Labels"
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                mapType === 'hybrid' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              🛰️ Satellite + Labels
            </button>
            <button
              type="button"
              onClick={() => handleToggleMapType('street')}
              title="OpenStreetMap with all village panchayats and roads"
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                mapType === 'street' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              🗺️ Open Village Map
            </button>
            <button
              type="button"
              onClick={() => handleToggleMapType('esri')}
              title="ESRI Agricultural Field Satellite"
              className={`hidden sm:inline-block px-2.5 py-1.5 rounded-lg transition-all ${
                mapType === 'esri' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              🌾 ESRI
            </button>
          </div>

          {/* GPS Auto-Detect Button */}
          <button
            type="button"
            onClick={() => triggerLiveLocation(undefined, true)}
            disabled={isLocatingGPS}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all hover:scale-105"
          >
            <LocateFixed className={`w-4 h-4 ${isLocatingGPS ? 'animate-spin' : ''}`} />
            <span>{isLocatingGPS ? 'Detecting GPS...' : '📍 My Live GPS'}</span>
          </button>

          {/* Pin Current Standing Location */}
          {userGpsPos && (
            <button
              type="button"
              onClick={handlePinCurrentLocation}
              className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1 transition-all"
              title="Drop a boundary pin where you are currently standing"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pin My Spot</span>
            </button>
          )}

          {/* Undo */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={points.length === 0}
            title="Undo last boundary pin"
            className="p-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          {/* Clear */}
          <button
            type="button"
            onClick={handleClear}
            disabled={points.length === 0}
            title="Clear all boundary pins"
            className="p-2 rounded-xl bg-white border border-slate-300 text-rose-600 hover:bg-rose-50 disabled:opacity-40 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* GPS Warning if permission blocked */}
      {gpsError && (
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{gpsError}</span>
          </div>
          <button 
            type="button" 
            onClick={() => triggerLiveLocation(undefined, true)}
            className="text-xs font-bold underline text-amber-800 hover:text-amber-950"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Map Container */}
      <div className="relative w-full h-[360px] sm:h-[420px] bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Top Floating Instruction Badge */}
        <div className="absolute top-3 left-3 z-[400] pointer-events-none">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-lg border border-slate-700">
            <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              {points.length === 0
                ? '👉 Click corners of your field on the map to drop pins'
                : points.length < 3
                ? `Click ${3 - points.length} more corner to close boundary polygon`
                : '✅ Polygon Closed • Drag numbered pins to adjust fence line'}
            </span>
          </div>
        </div>

        {/* Live Floating Acreage Calculation Card */}
        {points.length >= 3 && (
          <div className="absolute bottom-3 right-3 z-[400] pointer-events-none">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 backdrop-blur-md text-white shadow-2xl border border-emerald-500/50 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Calculated Land Area</span>
              </span>
              <p className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
                {areaCalc.acres} <span className="text-sm font-bold text-emerald-400">Acres</span>
              </p>
              <div className="flex items-center gap-2 text-[10px] text-slate-300 font-medium">
                <span>{areaCalc.hectares} Ha</span>
                <span>•</span>
                <span>{areaCalc.cents} Cents</span>
                <span>•</span>
                <span>{areaCalc.perimeterMeters}m fence</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Area Calculation Summary Cards */}
      <div className="p-3.5 bg-slate-50 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Farm Acres</span>
          <p className="text-base font-extrabold text-emerald-700 mt-0.5 font-['Outfit']">
            {areaCalc.acres > 0 ? `${areaCalc.acres} Acres` : '0.00 Acres'}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Hectares / Cents</span>
          <p className="text-base font-extrabold text-slate-800 mt-0.5 font-['Outfit']">
            {areaCalc.hectares} Ha / {areaCalc.cents} Cents
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Square Meters</span>
          <p className="text-base font-extrabold text-slate-800 mt-0.5 font-['Outfit']">
            {areaCalc.sqMeters.toLocaleString()} m²
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Boundary Perimeter</span>
          <p className="text-base font-extrabold text-slate-800 mt-0.5 font-['Outfit']">
            {areaCalc.perimeterMeters} m ({areaCalc.perimeterFeet} ft)
          </p>
        </div>
      </div>

    </div>
  );
};

