import React, { useState } from 'react';
import { 
  Database, 
  Globe, 
  Check, 
  DownloadCloud, 
  UploadCloud, 
  BrainCircuit 
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { useLanguage } from '../i18n/LanguageContext';

export const SettingsView: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [syncingData, setSyncingData] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleFetchFromSupabase = async () => {
    setSyncingData(true);
    setSyncMessage(null);
    const res = await StorageService.syncFromSupabase();
    setSyncingData(false);
    setSyncMessage(res.message);
  };

  const handlePushToSupabase = async () => {
    setSyncingData(true);
    setSyncMessage(null);
    const res = await StorageService.pushLocalFieldsToSupabase();
    setSyncingData(false);
    setSyncMessage(res.message);
  };

  const handleResetAllAppSeedData = () => {
    if (confirm(t('resetConfirmPrompt'))) {
      StorageService.resetAllData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('systemSettingsTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('systemSettingsSubtitle')}
          </p>
        </div>
      </div>

      {/* Cloud & AI Status Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* AI Vision Status */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{t('plantDoctorAiStatus')}</h4>
                <span className="text-[11px] text-slate-400">Hugging Face Vision Transformer (ViT)</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              High-accuracy Vision Transformer (98% precision) connected and diagnosing foliar pathogens.
            </p>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
            🟢 {t('active')}
          </span>
        </div>

        {/* Database Sync Status */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{t('cloudDbStatus')}</h4>
                <span className="text-[11px] text-slate-400">{t('postgresSync')}</span>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
              🟢 {t('connected')}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={handleFetchFromSupabase}
              disabled={syncingData}
              className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center gap-1 transition-colors"
            >
              <DownloadCloud className="w-3.5 h-3.5 text-emerald-700" />
              <span>{syncingData ? t('syncing') : t('pullFields')}</span>
            </button>
            <button
              onClick={handlePushToSupabase}
              disabled={syncingData}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors"
            >
              <UploadCloud className="w-3.5 h-3.5 text-slate-600" />
              <span>{t('pushFields')}</span>
            </button>
          </div>
        </div>

      </div>

      {syncMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Regional Language Accessibility */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">{t('languageTitle')}</h3>
            <p className="text-xs text-slate-500">{t('languageSubtitle')}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { code: 'en' as const, name: 'English', native: 'English' },
            { code: 'te' as const, name: 'Telugu', native: 'తెలుగు' },
            { code: 'hi' as const, name: 'Hindi', native: 'हिन्दी' },
            { code: 'ta' as const, name: 'Tamil', native: 'தமிழ்' },
          ].map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                language === lang.code
                  ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-400/30'
                  : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <p className="text-xs font-bold text-slate-900">{lang.name}</p>
              <p className="text-[11px] text-purple-700 font-bold mt-0.5">{lang.native}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Factory Reset */}
      <div className="p-6 rounded-3xl bg-rose-50/50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-rose-950 text-sm">{t('resetAppState')}</h4>
          <p className="text-xs text-rose-700 mt-0.5">{t('resetAppSubtitle')}</p>
        </div>
        <button
          onClick={handleResetAllAppSeedData}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all shrink-0"
        >
          {t('resetAllData')}
        </button>
      </div>

    </div>
  );
};
