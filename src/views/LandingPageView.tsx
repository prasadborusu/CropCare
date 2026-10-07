import React from 'react';
import { 
  Droplets, 
  Sprout, 
  CloudSun, 
  Waves, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Clock, 
  Sliders,
  ChevronRight
} from 'lucide-react';
import { CropCareLogo } from '../components/CropCareLogo';
import { NavTab } from '../components/Sidebar';

interface LandingPageViewProps {
  onStartApp: (tab?: NavTab) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onStartApp }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/40 text-slate-900 selection:bg-emerald-500 selection:text-white">
      
      {/* Top Navigation */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
        <CropCareLogo size="lg" showTagline={true} />

        <div className="flex items-center gap-3">
          <button
            onClick={() => onStartApp('simulator')}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-600" />
            <span>Interactive Simulator</span>
          </button>

          <button
            onClick={() => onStartApp('dashboard')}
            className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105 flex items-center gap-2"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </header>

      {/* Hero Section (Requirements #20) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 text-center space-y-6">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-sm animate-bounce">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Smart Farming Decision-Support Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 font-['Outfit'] max-w-4xl mx-auto leading-tight">
          Smarter Decisions. <br className="hidden sm:inline" />
          <span className="text-emerald-600 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
            Healthier Crops.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          CropCare combines soil, weather, crop and water information to help farmers make better irrigation and crop-care decisions.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onStartApp('dashboard')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-xl shadow-emerald-600/25 transition-all hover:scale-105 flex items-center justify-center gap-3"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          <button
            onClick={() => onStartApp('simulator')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-200 shadow-sm transition-all hover:scale-105 flex items-center justify-center gap-2.5"
          >
            <Sliders className="w-5 h-5 text-emerald-600" />
            <span>Try Interactive Demo</span>
          </button>
        </div>

        {/* Core Philosophy Banner */}
        <div className="mt-12 p-6 rounded-3xl bg-slate-900 text-white max-w-3xl mx-auto text-left sm:text-center shadow-xl border border-slate-800">
          <p className="text-xs uppercase font-bold text-emerald-400 tracking-wider mb-1">
            The Core Idea
          </p>
          <blockquote className="text-base sm:text-lg font-medium text-slate-200 italic">
            "Don't just show farming data. Convert the data into a simple action for the farmer."
          </blockquote>
        </div>

      </section>

      {/* 3 Steps: How CropCare Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900">
            How CropCare Works
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Closing the loop between sensor telemetry and practical farm actions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900">Collect Telemetry</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Monitors real-time soil moisture sensors, ambient temperatures, and local rain forecasts for your exact coordinates.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900">Explainable Decision Engine</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Evaluates multi-variable agronomic rules based on crop growth stage, soil type, and water reserves.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-600/20">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900">Action in Minutes</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Tells the farmer exactly whether to IRRIGATE (with duration in minutes) or WAIT to conserve water when rain is approaching.
            </p>
          </div>

        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-2">
            <Droplets className="w-8 h-8 text-emerald-600" />
            <h4 className="text-base font-bold text-slate-900">When to Irrigate</h4>
            <p className="text-xs text-slate-500">Calculates precise cycle durations (e.g. 18-22 min) tailored to soil type.</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-2">
            <CloudSun className="w-8 h-8 text-sky-600" />
            <h4 className="text-base font-bold text-slate-900">When NOT to Irrigate</h4>
            <p className="text-xs text-slate-500">Automatically halts unnecessary watering when rainfall is forecast.</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-2">
            <Waves className="w-8 h-8 text-blue-600" />
            <h4 className="text-base font-bold text-slate-900">Water Priority</h4>
            <p className="text-xs text-slate-500">Ranks which parcel needs water first when storage reserves are limited.</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-2">
            <Sprout className="w-8 h-8 text-green-600" />
            <h4 className="text-base font-bold text-slate-900">AI Plant Doctor</h4>
            <p className="text-xs text-slate-500">Optical camera scanning for early stress detection and organic remedies.</p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 CropCare. Prototype Built for Smart Agriculture & Farming Innovation.</p>
          <div className="flex items-center gap-3">
            <button onClick={() => onStartApp('dashboard')} className="hover:text-emerald-700 font-semibold">Dashboard</button>
            <span>•</span>
            <button onClick={() => onStartApp('simulator')} className="hover:text-emerald-700 font-semibold">Sensor Simulator</button>
            <span>•</span>
            <button onClick={() => onStartApp('settings')} className="hover:text-emerald-700 font-semibold">Settings</button>
          </div>
        </div>
      </footer>

    </div>
  );
};
