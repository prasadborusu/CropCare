import React from 'react';
import { Sparkles, CloudRain, Droplets, ShieldCheck, Waves, Camera, CalendarCheck } from 'lucide-react';
import { NavTab } from './Sidebar';
import { useLanguage } from '../i18n/LanguageContext';

interface DailyActionBarProps {
  onNavigate: (tab: NavTab) => void;
  onOpenAdvisor?: () => void;
}

export const DailyActionBar: React.FC<DailyActionBarProps> = ({
  onNavigate,
  onOpenAdvisor,
}) => {
  const { t } = useLanguage();

  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 text-white p-3.5 sm:p-4 shadow-lg border border-emerald-800/40">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CalendarCheck className="h-4 w-4 text-emerald-400" />
          </span>
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-white">
              {t('dailyActionsTitle')}
            </h4>
            <p className="text-xs text-slate-300 hidden sm:block">
              {t('dailyActionsSubtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <button
          onClick={() => onNavigate('mapping')}
          className="text-left p-2.5 sm:p-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 hover:border-emerald-500 text-slate-100 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between w-full mb-1">
            <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm">
              <span className="p-1 rounded bg-emerald-500/20 text-emerald-400">
                📍
              </span>
              <span>{t('landMappingAction')}</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              {t('gps')}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 line-clamp-1">
            {t('landMappingDesc')}
          </p>
        </button>

        <button
          onClick={() => onNavigate('irrigation')}
          className="text-left p-2.5 sm:p-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 hover:border-emerald-500 text-slate-100 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between w-full mb-1">
            <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm">
              <Droplets className="w-4 h-4 text-emerald-400" />
              <span>{t('advisorAction')}</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              {t('active')}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 line-clamp-1">
            {t('advisorDesc')}
          </p>
        </button>

        <button
          onClick={() => onNavigate('crop-health')}
          className="text-left p-2.5 sm:p-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 hover:border-emerald-500 text-slate-100 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between w-full mb-1">
            <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm">
              <Camera className="w-4 h-4 text-sky-400" />
              <span>{t('cropDoctorAction')}</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
              {t('visionAi')}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 line-clamp-1">
            {t('cropDoctorDesc')}
          </p>
        </button>

        <button
          onClick={() => onNavigate('weather')}
          className="text-left p-2.5 sm:p-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 hover:border-emerald-500 text-slate-100 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between w-full mb-1">
            <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm">
              <CloudRain className="w-4 h-4 text-amber-400" />
              <span>{t('weatherAction')}</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
              {t('live')}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 line-clamp-1">
            {t('weatherDesc')}
          </p>
        </button>
      </div>
    </div>
  );
};
