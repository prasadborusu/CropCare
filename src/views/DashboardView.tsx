import React, { useState, useEffect } from 'react';
import { 
  Droplets, 
  Thermometer, 
  CloudRain, 
  Sprout, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  Waves, 
  ChevronRight,
  TrendingDown,
  Info,
  Sliders,
  Plus,
  DownloadCloud,
  Database
} from 'lucide-react';
import { Field, IrrigationEngineOutput } from '../types';
import { StorageService, subscribeToStorage } from '../services/storageService';
import { isSupabaseConfigured } from '../services/supabase';
import { runIrrigationEngine } from '../engine/irrigationEngine';
import { RecommendationModal } from '../components/RecommendationModal';
import { DailyActionBar } from '../components/DailyActionBar';
import { FieldDetailsModal } from '../components/FieldDetailsModal';
import { AddFieldModal } from '../components/AddFieldModal';
import { NavTab } from '../components/Sidebar';
import { useLanguage } from '../i18n/LanguageContext';

interface DashboardViewProps {
  onNavigate: (tab: NavTab) => void;
  onOpenAdvisorWithField?: (field: Field) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenAdvisorWithField,
}) => {
  const { t } = useLanguage();
  const [fields, setFields] = useState<Field[]>(StorageService.getFields());
  const [activeFieldId, setActiveFieldId] = useState<string>(StorageService.getActiveFieldId());
  const [selectedFieldForModal, setSelectedFieldForModal] = useState<Field | null>(null);
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Attempt auto-sync from Supabase if configured and local fields are empty
    if (isSupabaseConfigured() && fields.length === 0) {
      setIsSyncing(true);
      StorageService.syncFromSupabase().finally(() => setIsSyncing(false));
    }

    const unsubscribe = subscribeToStorage(() => {
      setFields(StorageService.getFields());
      setActiveFieldId(StorageService.getActiveFieldId());
    });
    return unsubscribe;
  }, []);

  const activeField = fields.find(f => f.id === activeFieldId) || fields[0] || null;

  // Run explainable recommendation engine on current active field if available
  const recommendation: IrrigationEngineOutput | null = activeField ? runIrrigationEngine({
    soilMoisture: activeField.soilMoisture,
    temperature: activeField.temperature,
    humidity: activeField.humidity,
    rainProbability: activeField.rainProbability,
    crop: activeField.crop,
    cropStage: activeField.cropStage,
    soilType: activeField.soilType,
    fieldArea: activeField.areaAcres,
    waterAvailable: activeField.waterAvailableLitres,
  }) : null;

  const handleFieldSelect = (id: string) => {
    StorageService.setActiveFieldId(id);
    setActiveFieldId(id);
  };

  const handlePullFromSupabase = async () => {
    setIsSyncing(true);
    await StorageService.syncFromSupabase();
    setIsSyncing(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* 1. Daily Action Bar */}
      <DailyActionBar
        onNavigate={onNavigate}
        onOpenAdvisor={() => onNavigate('irrigation')}
      />

      {/* If 0 Fields registered yet: Onboarding State */}
      {fields.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-sm text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
            <Sprout className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              CropCare
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t('noFieldsFoundDesc')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{t('addNewField')}</span>
            </button>

            {isSupabaseConfigured() && (
              <button
                onClick={handlePullFromSupabase}
                disabled={isSyncing}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <DownloadCloud className="w-4 h-4 text-emerald-400" />
                <span>{isSyncing ? t('syncing') : t('pullFields')}</span>
              </button>
            )}
          </div>
        </div>
      ) : activeField && recommendation ? (
        <>
          {/* 2. Top Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            
            {/* Soil Moisture */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('soilMoisture')}</span>
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                  <Droplets className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">{activeField.soilMoisture}%</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                  {activeField.soilMoisture < 30 ? t('lowLevel') : t('adequate')}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                <span>{t('target')}: 45–60% for {activeField.crop.split(' ')[0]}</span>
              </p>
            </div>

            {/* Temperature */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('temperature')}</span>
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <Thermometer className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">{activeField.temperature}°C</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  {activeField.temperature >= 32 ? t('highHeat') : t('optimal')}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {t('evapoIndex')}
              </p>
            </div>

            {/* Rain Probability */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('rainProbability')}</span>
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                  <CloudRain className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">{activeField.rainProbability}%</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
                  {activeField.rainProbability < 20 ? t('clearSky') : t('rainExpected')}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {t('liveRadar')}
              </p>
            </div>

            {/* Crop Health */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('cropHealth')}</span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <Sprout className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">{activeField.status}</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {t('monitored')}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {activeField.crop} • {activeField.cropStage.split('/')[0]}
              </p>
            </div>

          </div>

          {/* 3. MAIN FEATURE — CROPCARE RECOMMENDATION (Hero Card) */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white p-6 sm:p-8 shadow-xl shadow-emerald-700/15 border border-emerald-500/30">
            
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md border border-white/20">
                    ⭐ {t('todaysDecision')}
                  </span>
                  <span className="text-xs font-medium text-emerald-100">
                    for {activeField.name} ({activeField.crop})
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-white/15 backdrop-blur-md text-emerald-200">
                    <Droplets className="w-8 h-8 fill-white/20" />
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                    {recommendation.decision === 'IRRIGATE' && `💧 ${t('irrigateNow')}`}
                    {recommendation.decision === 'WAIT' && `🌧️ ${t('wait')}`}
                    {recommendation.decision === 'MONITOR' && `🌱 ${t('monitor')}`}
                    {recommendation.decision === 'PRIORITIZE' && `⚠️ ${t('needsIrrigation')}`}
                  </h2>
                </div>

                <p className="text-emerald-50 text-base sm:text-lg leading-relaxed">
                  "{activeField.name}: {t('soilMoisture')} {activeField.soilMoisture}%, {t('rainProbability')} {activeField.rainProbability}%."
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md text-sm border border-white/10">
                    <Clock className="w-4 h-4 text-emerald-200" />
                    <span>{t('heroDuration')}: <strong>{recommendation.durationMinutes.formatted}</strong></span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md text-sm border border-white/10">
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>Confidence: <strong>{recommendation.confidence}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action CTA Button */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                <button
                  onClick={() => setIsExplainModalOpen(true)}
                  className="px-6 py-4 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-900 font-extrabold text-base shadow-lg shadow-black/10 transition-all hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-2.5"
                >
                  <span>{t('viewRecDetails')}</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </button>

                <button
                  onClick={() => onNavigate('irrigation')}
                  className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs backdrop-blur-md transition-colors flex items-center justify-center gap-2"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{t('customizeParameters')}</span>
                </button>
              </div>

            </div>
          </div>

          {/* 4. Active Field Selector & Field Cards Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{t('monitoredFields')}</h3>
                <p className="text-xs text-slate-500">{t('monitoredFieldsDesc')}</p>
              </div>
              <button
                onClick={() => onNavigate('fields')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>{t('viewAllFields')} ({fields.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fields.map((field) => {
                const isSelected = field.id === activeFieldId;
                return (
                  <div
                    key={field.id}
                    onClick={() => handleFieldSelect(field.id)}
                    className={`p-5 rounded-3xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-emerald-50/40 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-base">{field.name}</h4>
                          {isSelected && (
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                              {t('active')}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{field.crop} • {field.areaAcres} {t('acres')}</p>
                      </div>
                      
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        field.status === 'Needs Irrigation'
                          ? 'bg-rose-100 text-rose-700'
                          : field.status === 'Healthy'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {field.status}
                      </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400">{t('soilMoisture')}: </span>
                        <strong className="text-slate-800">{field.soilMoisture}%</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">{t('temperature')}: </span>
                        <strong className="text-slate-800">{field.temperature}°C</strong>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFieldForModal(field);
                        }}
                        className="text-emerald-700 font-bold hover:underline"
                      >
                        {t('details')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : null}

      {/* 5. Field Health & Weather Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Farm & Crop Health Overview card */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-slate-900">{t('farmSummaryTitle')}</h4>
              <p className="text-xs text-slate-500">{t('farmSummarySubtitle')}</p>
            </div>
            <button
              onClick={() => onNavigate('fields')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>{t('manageFields')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <span className="text-xs text-emerald-800 font-semibold">{t('totalFarmArea')}</span>
              <p className="text-xl sm:text-2xl font-extrabold text-emerald-950 mt-1">
                {fields.reduce((acc, f) => acc + (f.areaAcres || 0), 0).toFixed(1)} <span className="text-sm">{t('acres')}</span>
              </p>
              <span className="text-[11px] text-emerald-700">{fields.length} {t('activeParcels')}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-600 font-semibold">{t('healthyFields')}</span>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                {fields.filter(f => f.status === 'Healthy').length} / {fields.length || 1}
              </p>
              <span className="text-[11px] text-slate-500">{t('healthy')}</span>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
              <span className="text-xs text-amber-800 font-semibold">{t('actionRequired')}</span>
              <p className="text-xl sm:text-2xl font-extrabold text-amber-950 mt-1">
                {fields.filter(f => f.status === 'Needs Irrigation').length}
              </p>
              <span className="text-[11px] font-semibold text-amber-700">{t('needsIrrigation')}</span>
            </div>
          </div>
        </div>

        {/* Quick Weather Forecast Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-sky-800 uppercase tracking-wider">{t('localWeatherTitle')}</span>
              <CloudRain className="w-5 h-5 text-sky-600" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">34°C • {t('clearSky')}</h4>
            <p className="text-xs text-slate-600 mt-1">
              {t('humidity')}: 42% • {t('rainProbability')}: 8% • Open-Meteo
            </p>
          </div>

          <div className="pt-4 border-t border-sky-100/80 mt-4 flex items-center justify-between">
            <span className="text-xs font-medium text-sky-900">{t('live')}</span>
            <button
              onClick={() => onNavigate('weather')}
              className="text-xs font-bold text-sky-700 hover:text-sky-900"
            >
              {t('forecast7Day')}
            </button>
          </div>
        </div>

      </div>

      {/* Deep-Dive Explain Decision Modal */}
      {activeField && recommendation && (
        <RecommendationModal
          isOpen={isExplainModalOpen}
          onClose={() => setIsExplainModalOpen(false)}
          field={activeField}
          recommendation={recommendation}
        />
      )}

      {/* Add Field Modal */}
      <AddFieldModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Field Details Modal */}
      {selectedFieldForModal && (
        <FieldDetailsModal
          isOpen={!!selectedFieldForModal}
          onClose={() => setSelectedFieldForModal(null)}
          field={selectedFieldForModal}
          onOpenAdvisor={(f) => {
            if (onOpenAdvisorWithField) onOpenAdvisorWithField(f);
            onNavigate('irrigation');
          }}
        />
      )}

    </div>
  );
};
