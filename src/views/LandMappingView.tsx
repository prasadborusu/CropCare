import React, { useState } from 'react';
import { 
  MapPin, 
  LocateFixed, 
  Map as MapIcon, 
  Plus, 
  Check, 
  Ruler, 
  Sparkles, 
  Layers, 
  Compass, 
  Sprout 
} from 'lucide-react';
import { FarmMapDrawer } from '../components/FarmMapDrawer';
import { FarmAreaCalculation, LatLngPoint } from '../utils/geoAreaCalculator';
import { StorageService } from '../services/storageService';
import { AddFieldModal } from '../components/AddFieldModal';
import { useLanguage } from '../i18n/LanguageContext';

export const LandMappingView: React.FC = () => {
  const { t } = useLanguage();
  const [calculation, setCalculation] = useState<FarmAreaCalculation>({
    acres: 0,
    hectares: 0,
    sqMeters: 0,
    sqFeet: 0,
    cents: 0,
    gunthas: 0,
    perimeterMeters: 0,
    perimeterFeet: 0,
    center: { lat: 16.96, lng: 81.12 },
  });

  const [boundaryPoints, setBoundaryPoints] = useState<LatLngPoint[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAreaCalculated = (calc: FarmAreaCalculation, points: LatLngPoint[]) => {
    setCalculation(calc);
    setBoundaryPoints(points);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('landMappingTitle')}
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <Ruler className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t('gpsGeodesy')}</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('landMappingSubtitle')}
          </p>
        </div>

        {calculation.acres > 0 && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t('saveAsNewParcel')} ({calculation.acres} {t('acres')})</span>
          </button>
        )}
      </div>

      {/* Main Interactive Map Canvas */}
      <FarmMapDrawer
        onAreaCalculated={handleAreaCalculated}
        className="w-full shadow-md"
      />

      {/* Measurement Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('totalAcreage')}</span>
          <p className="text-3xl font-black text-slate-900 mt-2 font-['Outfit']">
            {calculation.acres > 0 ? `${calculation.acres}` : '0.00'} <span className="text-base font-bold text-emerald-600">{t('acres')}</span>
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">1 {t('acres')} = 4,046.86 m²</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('hectaresAndCents')}</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-['Outfit']">
            {calculation.hectares} <span className="text-sm font-semibold text-slate-500">{t('hectares')}</span> / {calculation.cents} <span className="text-sm font-semibold text-slate-500">{t('cents')}</span>
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">{calculation.gunthas} Gunthas</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('squareFootage')}</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-['Outfit']">
            {calculation.sqFeet.toLocaleString()} <span className="text-sm font-semibold text-slate-500">sq ft</span>
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">{calculation.sqMeters.toLocaleString()} m²</span>
        </div>

        <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200 shadow-sm">
          <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">{t('boundaryPerimeter')}</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-950 mt-2 font-['Outfit']">
            {calculation.perimeterMeters} <span className="text-base font-bold text-emerald-700">{t('meters')}</span>
          </p>
          <span className="text-[11px] font-semibold text-emerald-700 mt-1 block">{calculation.perimeterFeet} {t('feetAroundFence')}</span>
        </div>

      </div>

      {/* Instructions Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-600" />
          <span>{t('howToMapLand')}</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="font-bold text-slate-800">{t('step1Locate')}</span>
            <p>{t('step1Desc')}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="font-bold text-slate-800">{t('step2Pins')}</span>
            <p>{t('step2Desc')}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="font-bold text-slate-800">{t('step3Save')}</span>
            <p>{t('step3Desc')}</p>
          </div>
        </div>
      </div>

      {/* Add Field Modal */}
      <AddFieldModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

    </div>
  );
};
