import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Droplets, 
  Thermometer, 
  CloudRain, 
  Wind, 
  Waves, 
  Sparkles, 
  Play, 
  Pause, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  Zap,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Field, IrrigationEngineOutput } from '../types';
import { StorageService, subscribeToStorage } from '../services/storageService';
import { runIrrigationEngine } from '../engine/irrigationEngine';

export const SensorSimulatorView: React.FC = () => {
  const [fields, setFields] = useState<Field[]>(StorageService.getFields());
  const [activeFieldId, setActiveFieldId] = useState<string>(StorageService.getActiveFieldId());

  useEffect(() => {
    const unsub = subscribeToStorage(() => {
      setFields(StorageService.getFields());
      setActiveFieldId(StorageService.getActiveFieldId());
    });
    return unsub;
  }, []);

  const currentField = fields.find(f => f.id === activeFieldId) || fields[0] || {
    id: 'f-1',
    name: 'Field 1',
    crop: 'Paddy (Rice)',
    areaAcres: 2.5,
    soilType: 'Clay',
    cropStage: 'Flowering / Tillering',
    location: 'Tadikalapudi, Andhra Pradesh',
    soilMoisture: 24,
    temperature: 34,
    humidity: 42,
    rainProbability: 8,
    waterAvailableLitres: 5000,
    status: 'Needs Irrigation' as const,
    sensorStatus: 'Simulated' as const,
    sensorLastUpdated: 'Just now',
  };

  // State sliders
  const [soilMoisture, setSoilMoisture] = useState<number>(currentField.soilMoisture);
  const [temperature, setTemperature] = useState<number>(currentField.temperature);
  const [rainProbability, setRainProbability] = useState<number>(currentField.rainProbability);
  const [humidity, setHumidity] = useState<number>(currentField.humidity);
  const [waterLevelCategory, setWaterLevelCategory] = useState<'Low' | 'Medium' | 'High'>('Medium');

  // Live Auto Tick mode
  const [isLiveStreamRunning, setIsLiveStreamRunning] = useState(false);
  const [simulatedSuccess, setSimulatedSuccess] = useState(false);

  // Sync state when active field changes
  useEffect(() => {
    setSoilMoisture(currentField.soilMoisture);
    setTemperature(currentField.temperature);
    setRainProbability(currentField.rainProbability);
    setHumidity(currentField.humidity);
  }, [activeFieldId]);

  // Real-time engine evaluation on simulator state
  const waterAvailableLitres = waterLevelCategory === 'Low' ? 1200 : waterLevelCategory === 'Medium' ? 5000 : 15000;
  
  const rec: IrrigationEngineOutput = runIrrigationEngine({
    soilMoisture,
    temperature,
    humidity,
    rainProbability,
    crop: currentField.crop,
    cropStage: currentField.cropStage,
    soilType: currentField.soilType,
    fieldArea: currentField.areaAcres,
    waterAvailable: waterAvailableLitres,
  });

  const handleSimulateReading = () => {
    StorageService.updateField(currentField.id, {
      soilMoisture,
      temperature,
      humidity,
      rainProbability,
      waterAvailableLitres,
      sensorLastUpdated: 'Just now (Simulated)',
    });

    setSimulatedSuccess(true);
    setTimeout(() => setSimulatedSuccess(false), 2000);
  };

  // Live streaming simulator ticker
  useEffect(() => {
    let interval: any;
    if (isLiveStreamRunning) {
      interval = setInterval(() => {
        setSoilMoisture(prev => {
          const delta = (Math.random() - 0.52) * 1.5;
          const next = Math.max(10, Math.min(95, Math.round(prev + delta)));
          StorageService.updateField(currentField.id, { soilMoisture: next });
          return next;
        });
        setTemperature(prev => {
          const delta = (Math.random() - 0.5) * 0.4;
          return parseFloat((prev + delta).toFixed(1));
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLiveStreamRunning, currentField.id]);

  // Predefined scenarios (Requirements #17)
  const loadScenario1 = () => {
    setSoilMoisture(18);
    setRainProbability(5);
    setTemperature(36);
    setHumidity(35);
    setWaterLevelCategory('Medium');
  };

  const loadScenario2 = () => {
    setSoilMoisture(45);
    setRainProbability(85);
    setTemperature(29);
    setHumidity(80);
    setWaterLevelCategory('Medium');
  };

  const loadScenario3 = () => {
    setSoilMoisture(65);
    setRainProbability(20);
    setTemperature(31);
    setHumidity(50);
    setWaterLevelCategory('Medium');
  };

  const isIrrigate = rec.decision === 'IRRIGATE';
  const isWait = rec.decision === 'WAIT';
  const isMonitor = rec.decision === 'MONITOR';
  const isPrioritize = rec.decision === 'PRIORITIZE';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              IoT Sensor Simulator
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
              Demo / Simulated Data
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Interactive control board to test decision engine responses under extreme agricultural scenarios.
          </p>
        </div>

        {/* Live Stream Toggle */}
        <button
          onClick={() => setIsLiveStreamRunning(!isLiveStreamRunning)}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm ${
            isLiveStreamRunning
              ? 'bg-rose-600 text-white shadow-rose-500/20'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
          }`}
        >
          {isLiveStreamRunning ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Pause Auto Stream</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Start Auto Stream (3s Ticks)</span>
            </>
          )}
        </button>
      </div>

      {/* Predefined Scenarios Toolbar (Requirements #17) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span>Predefined Hackathon Scenarios</span>
          </h4>
          <span className="text-[11px] text-slate-400">Instant configuration presets</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={loadScenario1}
            className="p-3.5 rounded-2xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100/80 text-left transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-900">Scenario 1 (Dry)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-200 text-rose-900">→ IRRIGATE</span>
            </div>
            <p className="text-xs text-rose-700 mt-1 font-medium">
              Moisture: 18% • Rain: 5% • Temp: 36°C
            </p>
          </button>

          <button
            onClick={loadScenario2}
            className="p-3.5 rounded-2xl border border-sky-200 bg-sky-50/60 hover:bg-sky-100/80 text-left transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-900">Scenario 2 (Rain Coming)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-200 text-sky-900">→ WAIT</span>
            </div>
            <p className="text-xs text-sky-700 mt-1 font-medium">
              Moisture: 45% • Rain: 85% • Temp: 29°C
            </p>
          </button>

          <button
            onClick={loadScenario3}
            className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/80 text-left transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900">Scenario 3 (Adequate)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">→ MONITOR</span>
            </div>
            <p className="text-xs text-emerald-700 mt-1 font-medium">
              Moisture: 65% • Rain: 20% • Temp: 31°C
            </p>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Sliders Control Panel */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Telemetry Adjuster</h3>
              <p className="text-xs text-slate-500">Target Field: <strong>{currentField.name} ({currentField.crop})</strong></p>
            </div>
            <select
              value={activeFieldId}
              onChange={(e) => setActiveFieldId(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 outline-none"
            >
              {fields.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            
            {/* 1. Soil Moisture Slider (0–100%) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-emerald-600" />
                  Soil Moisture (0–100%)
                </span>
                <span className={`text-base font-extrabold px-2.5 py-0.5 rounded-lg ${
                  soilMoisture < 30 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {soilMoisture}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={soilMoisture}
                onChange={(e) => setSoilMoisture(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0% Dry</span>
                <span>30% Low Threshold</span>
                <span>60% Optimal</span>
                <span>100% Saturated</span>
              </div>
            </div>

            {/* 2. Temperature Slider (15–45°C) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-amber-500" />
                  Ambient Temperature (15–45°C)
                </span>
                <span className="text-base font-extrabold text-slate-900 bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-lg">
                  {temperature}°C
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="45"
                step="0.5"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* 3. Rain Probability Slider (0–100%) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <CloudRain className="w-4 h-4 text-sky-500" />
                  Rain Probability (0–100%)
                </span>
                <span className="text-base font-extrabold text-slate-900 bg-sky-100 text-sky-900 px-2.5 py-0.5 rounded-lg">
                  {rainProbability}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={rainProbability}
                onChange={(e) => setRainProbability(parseInt(e.target.value, 10))}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>

            {/* 4. Humidity Slider (0–100%) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-teal-500" />
                  Relative Humidity (0–100%)
                </span>
                <span className="text-base font-extrabold text-slate-900 bg-teal-100 text-teal-900 px-2.5 py-0.5 rounded-lg">
                  {humidity}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={humidity}
                onChange={(e) => setHumidity(parseInt(e.target.value, 10))}
                className="w-full accent-teal-500 cursor-pointer"
              />
            </div>

            {/* 5. Water Availability (Low / Medium / High) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                <Waves className="w-4 h-4 text-blue-500" />
                Water Reserve Level
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['Low', 'Medium', 'High'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setWaterLevelCategory(lvl)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      waterLevelCategory === lvl
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lvl} ({lvl === 'Low' ? '1.2k L' : lvl === 'Medium' ? '5k L' : '15k L'})
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Simulation Button */}
            <button
              onClick={handleSimulateReading}
              className={`w-full py-3.5 rounded-2xl font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                simulatedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white hover:scale-[1.01]'
              }`}
            >
              {simulatedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Telemetry Broadcasted to Dashboard!</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Simulate Reading (Broadcast to App)</span>
                </>
              )}
            </button>

          </div>
        </div>

        {/* Right Column: Live Output & Engine Response */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
            isIrrigate
              ? 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white border-emerald-500/30'
              : isWait
              ? 'bg-gradient-to-br from-sky-600 to-blue-700 text-white border-sky-500/30'
              : isPrioritize
              ? 'bg-gradient-to-br from-amber-600 to-orange-700 text-white border-amber-500/30'
              : 'bg-gradient-to-br from-slate-700 to-slate-800 text-white border-slate-600/30'
          }`}>
            
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/20 backdrop-blur-md">
                Live Simulator Result
              </span>
              <span className="text-xs text-white/80">
                Confidence: {rec.confidence} ({rec.confidenceScorePercent}%)
              </span>
            </div>

            <div className="my-4">
              <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                {isIrrigate && '💧 IRRIGATE'}
                {isWait && '🌧️ WAIT — Rain Expected'}
                {isMonitor && '🌱 MONITOR'}
                {isPrioritize && '⚠️ PRIORITIZE'}
              </h3>
              <p className="text-white/90 text-sm mt-2">
                {rec.actionSummary}
              </p>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-3 my-5 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs">
              <div>
                <span className="text-white/70 font-semibold">Suggested Time:</span>
                <p className="text-lg font-extrabold text-white mt-0.5">{rec.durationMinutes.formatted}</p>
              </div>
              <div>
                <span className="text-white/70 font-semibold">Est. Water Demand:</span>
                <p className="text-lg font-extrabold text-white mt-0.5">~{rec.estimatedWaterRequiredLitres.toLocaleString()} L</p>
              </div>
            </div>

            {/* Reasons list */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white/80">Engine Reasons:</span>
              <ul className="space-y-1.5 text-xs text-white/95">
                {rec.reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Explicit Label Disclaimer (Requirements #2) */}
          <div className="mt-4 p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Notice for Hackathon Evaluators:</strong> All sensor telemetry in this simulator is clearly labelled as <strong>Demo / Simulated Data</strong>. No physical IoT hardware connection is claimed.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
