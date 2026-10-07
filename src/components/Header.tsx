import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Bell, 
  Sparkles, 
  Globe, 
  Database, 
  CheckCircle2, 
  AlertTriangle,
  Menu,
  X,
  Sliders,
  RefreshCw,
  LocateFixed,
  Check
} from 'lucide-react';
import { StorageService, subscribeToStorage } from '../services/storageService';
import { isSupabaseConfigured } from '../services/supabase';
import { reverseGeocodeLocation } from '../services/weatherService';
import { LocationService } from '../services/locationService';
import { useLanguage } from '../i18n/LanguageContext';
import { Field } from '../types';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
  onOpenSimulator?: () => void;
  currentPageTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenMobileMenu,
  onOpenSimulator,
  currentPageTitle
}) => {
  const { t } = useLanguage();
  const [location, setLocation] = useState(StorageService.getLocation());
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [newLocationInput, setNewLocationInput] = useState(location);
  const [hasSupabase, setHasSupabase] = useState(isSupabaseConfigured());
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isLiveGPS, setIsLiveGPS] = useState(false);
  const [fields, setFields] = useState<Field[]>(StorageService.getFields());
  const [clearedAlerts, setClearedAlerts] = useState(false);

  useEffect(() => {
    const unsub = subscribeToStorage(() => {
      setLocation(StorageService.getLocation());
      setFields(StorageService.getFields());
    });

    // Auto-detect real live location on startup
    detectLiveLocation();

    return unsub;
  }, []);

  const detectLiveLocation = async (isManual = false) => {
    setIsLocating(true);
    try {
      const loc = await LocationService.getCurrentLocation({
        enableHighAccuracy: isManual,
        timeoutMs: isManual ? 5000 : 3000,
        fallbackToNetwork: true,
      });
      setIsLocating(false);

      let placeStr = loc.placeName;
      if (!placeStr || placeStr === 'Farm Location') {
        try {
          placeStr = await reverseGeocodeLocation(loc.lat, loc.lng);
        } catch {
          placeStr = `Lat ${loc.lat.toFixed(2)}, Lon ${loc.lng.toFixed(2)}`;
        }
      }

      StorageService.setLocation(placeStr);
      setLocation(placeStr);
      setIsLiveGPS(loc.source === 'gps');
    } catch {
      setIsLocating(false);
    }
  };

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLocationInput.trim()) {
      StorageService.setLocation(newLocationInput.trim());
      setLocation(newLocationInput.trim());
      setIsEditingLocation(false);
    }
  };

  const handleDetectGPS = () => {
    detectLiveLocation(true);
  };

  // Compute real alerts from actual user fields
  const realAlerts: { id: string; title: string; message: string; type: 'danger' | 'warning' }[] = [];
  
  if (!clearedAlerts) {
    fields.forEach((f) => {
      if (f.soilMoisture < 30) {
        realAlerts.push({
          id: `moisture-${f.id}`,
          title: `${f.name} - Moisture Alert`,
          message: `Soil moisture is at ${f.soilMoisture}%. Irrigation recommended to prevent crop stress.`,
          type: 'danger',
        });
      } else if (f.temperature >= 34) {
        realAlerts.push({
          id: `temp-${f.id}`,
          title: `${f.name} - High Heat Warning`,
          message: `Ambient temperature is ${f.temperature}°C. Increased evapotranspiration rate.`,
          type: 'warning',
        });
      }
    });
  }

  const hasActiveAlerts = realAlerts.length > 0;

  return (
    <header className="sticky top-0 z-30 w-full glass-header px-4 sm:px-6 py-3.5 flex items-center justify-between transition-all">
      {/* Left: Mobile Menu Trigger & Greeting/Title */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>{t('greeting')}</span>
              <span className="inline-block text-base">👋</span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium hidden sm:block">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Right Action Bar */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Location Badge with GPS option */}
        <div className="relative">
          {isEditingLocation ? (
            <form onSubmit={handleSaveLocation} className="flex items-center gap-1 bg-white border border-emerald-300 rounded-full px-2 py-0.5 shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <input
                type="text"
                value={newLocationInput}
                onChange={(e) => setNewLocationInput(e.target.value)}
                className="text-xs font-semibold text-slate-800 focus:outline-none w-36 sm:w-48"
                placeholder="Village, District, State"
                autoFocus
              />
              <button type="submit" className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                Save
              </button>
              <button 
                type="button" 
                onClick={() => setIsEditingLocation(false)}
                className="text-slate-400 hover:text-slate-600 text-xs px-1"
              >
                ✕
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsEditingLocation(true)}
                title="Click to edit or search farm village"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-semibold transition-all group"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span className="truncate max-w-[140px] sm:max-w-none">{location}</span>
                <span className="text-[10px] text-emerald-600 opacity-60 group-hover:opacity-100">✎</span>
              </button>

              <button
                type="button"
                onClick={handleDetectGPS}
                disabled={isLocating}
                title="Detect live GPS location from device"
                className="p-1.5 rounded-full bg-emerald-100/70 hover:bg-emerald-200 text-emerald-800 transition-colors"
              >
                <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-emerald-700' : ''}`} />
              </button>
            </div>
          )}
        </div>

        {/* Database Sync Status Badge */}
        <div 
          title={hasSupabase ? "Supabase Cloud Database Connected" : "Local Database Storage Active"} 
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
            hasSupabase 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-slate-100 text-slate-700 border-slate-200'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${hasSupabase ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-500'}`} />
          <span className="hidden sm:inline">{hasSupabase ? 'Cloud Synced' : 'Ready'}</span>
        </div>

        {/* Real Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {hasActiveAlerts && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Field Alerts</h4>
                {hasActiveAlerts && (
                  <button 
                    onClick={() => {
                      setClearedAlerts(true);
                      setShowNotifications(false);
                    }}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-600"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {realAlerts.length === 0 ? (
                <div className="py-6 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">All Fields Normal</p>
                  <p className="text-[11px] text-slate-400">No active moisture or temperature alerts.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {realAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-2.5 rounded-xl border text-xs ${
                        alert.type === 'danger'
                          ? 'bg-rose-50/80 border-rose-100 text-rose-950'
                          : 'bg-amber-50/80 border-amber-100 text-amber-950'
                      }`}
                    >
                      <p className="font-bold">{alert.title}</p>
                      <p className="text-slate-600 mt-0.5 text-[11px] leading-relaxed">{alert.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
