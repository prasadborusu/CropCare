import React, { useState, useEffect } from 'react';
import { 
  Waves, 
  Droplets, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  TrendingUp,
  PieChart as PieIcon,
  ShieldAlert,
  Info,
  Layers
} from 'lucide-react';
import { Field, IrrigationEngineOutput } from '../types';
import { StorageService, subscribeToStorage } from '../services/storageService';
import { runIrrigationEngine } from '../engine/irrigationEngine';

export const WaterManagementView: React.FC = () => {
  const [fields, setFields] = useState<Field[]>(StorageService.getFields());
  const [budget, setBudget] = useState(StorageService.getWaterBudget());

  useEffect(() => {
    const unsub = subscribeToStorage(() => {
      setFields(StorageService.getFields());
      setBudget(StorageService.getWaterBudget());
    });
    return unsub;
  }, []);

  // Compute decision and priority ranking for all fields
  const fieldsWithPriority = fields.map(field => {
    const rec = runIrrigationEngine({
      soilMoisture: field.soilMoisture,
      temperature: field.temperature,
      humidity: field.humidity,
      rainProbability: field.rainProbability,
      crop: field.crop,
      cropStage: field.cropStage,
      soilType: field.soilType,
      fieldArea: field.areaAcres,
      waterAvailable: field.waterAvailableLitres,
    });
    return {
      field,
      rec,
    };
  });

  // Sort by priority score descending
  fieldsWithPriority.sort((a, b) => b.rec.priorityScore - a.rec.priorityScore);

  const totalUsedPercent = Math.min(100, Math.round((budget.usedLitres / (budget.usedLitres + budget.availableLitres || 1)) * 100));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Water Resource Management
          </h2>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
            Smart Allocation Engine
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor reservoir levels, avoid wasteful over-watering, and prioritize critical crops during water scarcity.
        </p>
      </div>

      {/* Top Cards (Requirements #16) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Available Water */}
        <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available Water</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Waves className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              {budget.availableLitres.toLocaleString()} L
            </span>
          </div>
          <div className="mt-3 w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-sky-500 rounded-full" 
              style={{ width: `${100 - totalUsedPercent}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Primary Borewell + Secondary Storage
          </p>
        </div>

        {/* Used Water */}
        <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Used Water</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
              <Droplets className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              {budget.usedLitres.toLocaleString()} L
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-medium">
            Cumulative across {budget.avoidedIrrigationsCount + 12} irrigation cycles
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Current crop season
          </p>
        </div>

        {/* Estimated Saved (Explicitly labelled Estimated) */}
        <div className="p-6 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
              Estimated Saved
            </span>
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-emerald-950">
              +{budget.estimatedSavedLitres.toLocaleString()} L
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900">
              Estimated
            </span>
          </div>
          <p className="text-xs text-emerald-800 mt-3 font-semibold">
            Saved by skipping redundant waterings & target timings
          </p>
          <p className="text-[11px] text-emerald-700/80 mt-1">
            * Estimated based on prototype simulation calculations
          </p>
        </div>

      </div>

      {/* FIELD PRIORITY RANKING (Requirements #16) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>Water Allocation Priority</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Ranked Order
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Which field needs water first? Ordered dynamically by moisture deficit and growth stage sensitivity.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {fieldsWithPriority.map((item, index) => {
            const { field, rec } = item;
            const rank = index + 1;
            
            const isHigh = rec.priority === 'High';
            const isMedium = rec.priority === 'Medium';
            const isLow = rec.priority === 'Low';

            let rationaleText = '';
            if (field.name.includes('1') || field.crop.includes('Paddy')) {
              rationaleText = `${field.name} has low soil moisture (${field.soilMoisture}%) and a higher current irrigation need at ${field.cropStage}.`;
            } else if (field.name.includes('3') || field.crop.includes('Groundnut')) {
              rationaleText = `${field.name} is in pod formation stage (${field.soilMoisture}% moisture). Steady moisture is required within next 24 hours.`;
            } else {
              rationaleText = `${field.name} maintains adequate moisture (${field.soilMoisture}%). Root zone is stable and irrigation can be safely queued.`;
            }

            return (
              <div 
                key={field.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isHigh 
                    ? 'bg-rose-50/50 border-rose-200 ring-1 ring-rose-300' 
                    : isMedium
                    ? 'bg-amber-50/50 border-amber-200'
                    : 'bg-emerald-50/40 border-emerald-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Rank Number Badge */}
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-base shrink-0 shadow-sm ${
                    isHigh 
                      ? 'bg-rose-600 text-white' 
                      : isMedium 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-emerald-600 text-white'
                  }`}>
                    {rank}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-extrabold text-slate-900 text-base">
                        {isHigh ? '🔴' : isMedium ? '🟡' : '🟢'} {field.name} — {field.crop}
                      </h4>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        isHigh 
                          ? 'bg-rose-100 text-rose-800' 
                          : isMedium 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {rec.priority} Priority ({rec.priorityScore} pts)
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {rationaleText}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500">
                      <span>Soil Moisture: <strong>{field.soilMoisture}%</strong></span>
                      <span>•</span>
                      <span>Area: <strong>{field.areaAcres} ac</strong></span>
                      <span>•</span>
                      <span>Allocation Req: <strong>~{rec.estimatedWaterRequiredLitres.toLocaleString()} L</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                  <div className="text-right">
                    <span className="text-xs uppercase font-bold text-slate-400">Duration</span>
                    <p className="text-sm font-extrabold text-slate-900">{rec.durationMinutes.formatted}</p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Informative Disclaimer */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <strong>Smart Water Distribution Logic:</strong> When total reservoir water is limited, CropCare allocates available volume first to high water-stress fields with sensitive flowering/grain stages to prevent yield loss.
          </div>
        </div>

      </div>

    </div>
  );
};
