import React, { useState } from 'react';
import { X, Sprout, Plus, MapPin, Layers, Droplets, Map, Check } from 'lucide-react';
import { CropType, CropStage, SoilType } from '../types';
import { StorageService } from '../services/storageService';
import { FarmMapDrawer } from './FarmMapDrawer';
import { FarmAreaCalculation, LatLngPoint } from '../utils/geoAreaCalculator';

interface AddFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFieldAdded?: () => void;
}

export const AddFieldModal: React.FC<AddFieldModalProps> = ({
  isOpen,
  onClose,
  onFieldAdded,
}) => {
  const [name, setName] = useState('');
  const [crop, setCrop] = useState<CropType>('Paddy (Rice)');
  const [areaAcres, setAreaAcres] = useState('2.0');
  const [soilType, setSoilType] = useState<SoilType>('Clay');
  const [cropStage, setCropStage] = useState<CropStage>('Vegetative Growth');
  const [location, setLocation] = useState(StorageService.getLocation());
  const [waterAvailableLitres, setWaterAvailableLitres] = useState('5000');
  const [initialMoisture, setInitialMoisture] = useState('35');

  // Map Drawing Toggle
  const [showMapDrawer, setShowMapDrawer] = useState(true);
  const [boundaryPoints, setBoundaryPoints] = useState<LatLngPoint[]>([]);

  if (!isOpen) return null;

  const handleAreaCalculated = (calc: FarmAreaCalculation, points: LatLngPoint[]) => {
    setBoundaryPoints(points);
    if (calc.acres > 0) {
      setAreaAcres(calc.acres.toString());
      if (calc.center) {
        setLocation(`Lat ${calc.center.lat.toFixed(4)}, Lon ${calc.center.lng.toFixed(4)}`);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    StorageService.addField({
      name: name.trim(),
      crop,
      areaAcres: parseFloat(areaAcres) || 1.0,
      soilType,
      cropStage,
      location: location.trim() || StorageService.getLocation(),
      soilMoisture: parseInt(initialMoisture, 10) || 35,
      temperature: 34,
      humidity: 45,
      rainProbability: 10,
      waterAvailableLitres: parseFloat(waterAvailableLitres) || 5000,
    });

    if (onFieldAdded) onFieldAdded();
    onClose();
  };

  const cropOptions: CropType[] = [
    'Paddy (Rice)',
    'Maize (Corn)',
    'Groundnut (Peanut)',
    'Cotton',
    'Chilli',
    'Sugarcane',
    'Tomato',
    'Wheat',
  ];

  const stageOptions: CropStage[] = [
    'Germination / Seedling',
    'Vegetative Growth',
    'Flowering / Tillering',
    'Grain / Pod Formation',
    'Ripening / Maturity',
  ];

  const soilOptions: SoilType[] = [
    'Clay',
    'Sandy Loam',
    'Black Cotton Soil',
    'Red Sandy Loam',
    'Alluvial Soil',
    'Loamy',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Add New Farm Parcel</h2>
              <p className="text-xs text-slate-500">Pin boundaries on map to auto-calculate land acreage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Interactive Satellite Boundary Map Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Map className="w-4 h-4 text-emerald-600" />
                <span>Map Farm Boundaries & Auto-Calculate Acres</span>
              </label>

              <button
                type="button"
                onClick={() => setShowMapDrawer(!showMapDrawer)}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                {showMapDrawer ? 'Hide Map' : 'Show Satellite Map'}
              </button>
            </div>

            {showMapDrawer && (
              <FarmMapDrawer
                onAreaCalculated={handleAreaCalculated}
                className="w-full"
              />
            )}
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Field / Parcel Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., North Borewell Parcel - Field 1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-xs sm:text-sm font-semibold outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Calculated Land Area (Acres) *</span>
                {parseFloat(areaAcres) > 0 && (
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Auto-Calculated from Map
                  </span>
                )}
              </label>
              <input
                type="number"
                step="0.01"
                min="0.05"
                max="500"
                required
                value={areaAcres}
                onChange={(e) => setAreaAcres(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-xs sm:text-sm font-bold outline-none transition-all bg-emerald-50/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Crop Type *
              </label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value as CropType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-xs sm:text-sm font-semibold outline-none transition-all bg-white"
              >
                {cropOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Crop Growth Stage *
              </label>
              <select
                value={cropStage}
                onChange={(e) => setCropStage(e.target.value as CropStage)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-xs sm:text-sm font-semibold outline-none transition-all bg-white"
              >
                {stageOptions.map((stage) => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Soil Profile & Retention *
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value as SoilType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-xs sm:text-sm font-semibold outline-none transition-all bg-white"
              >
                {soilOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Location / Coordinates
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-xs sm:text-sm font-medium outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs sm:text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
            >
              Save Field Parcel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
