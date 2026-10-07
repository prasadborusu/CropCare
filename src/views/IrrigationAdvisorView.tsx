import React, { useState, useEffect } from 'react';
import { 
  Droplets, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  CloudRain, 
  Thermometer, 
  Sprout, 
  Waves, 
  HelpCircle,
  Play,
  RotateCcw,
  Check,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CropType, CropStage, SoilType, Field, IrrigationEngineOutput } from '../types';
import { StorageService } from '../services/storageService';
import { runIrrigationEngine } from '../engine/irrigationEngine';
import { useLanguage } from '../i18n/LanguageContext';

interface IrrigationAdvisorViewProps {
  initialField?: Field | null;
}

export const IrrigationAdvisorView: React.FC<IrrigationAdvisorViewProps> = ({ initialField }) => {
  const { t } = useLanguage();
  const fields = StorageService.getFields();
  const defaultField = initialField || fields[0];

  const [selectedFieldId, setSelectedFieldId] = useState(defaultField?.id || '');
  const [crop, setCrop] = useState<CropType>(defaultField?.crop || 'Paddy (Rice)');
  const [cropStage, setCropStage] = useState<CropStage>(defaultField?.cropStage || 'Flowering / Tillering');
  const [soilType, setSoilType] = useState<SoilType>(defaultField?.soilType || 'Clay');
  const [areaAcres, setAreaAcres] = useState(defaultField?.areaAcres ? defaultField.areaAcres.toString() : '2.0');
  
  // Interactive condition inputs
  const [soilMoisture, setSoilMoisture] = useState<number>(defaultField?.soilMoisture ?? 25);
  const [temperature, setTemperature] = useState<number>(defaultField?.temperature ?? 34);
  const [rainProbability, setRainProbability] = useState<number>(defaultField?.rainProbability ?? 8);
  const [humidity, setHumidity] = useState<number>(defaultField?.humidity ?? 42);
  const [waterAvailable, setWaterAvailable] = useState<number>(defaultField?.waterAvailableLitres ?? 5000);

  // Auto-calculate recommendation in real time
  const [result, setResult] = useState<IrrigationEngineOutput>(() => {
    return runIrrigationEngine({
      soilMoisture: defaultField?.soilMoisture ?? 25,
      temperature: defaultField?.temperature ?? 34,
      humidity: defaultField?.humidity ?? 42,
      rainProbability: defaultField?.rainProbability ?? 8,
      crop: defaultField?.crop ?? 'Paddy (Rice)',
      cropStage: defaultField?.cropStage ?? 'Flowering / Tillering',
      soilType: defaultField?.soilType ?? 'Clay',
      fieldArea: defaultField?.areaAcres ?? 2.0,
      waterAvailable: defaultField?.waterAvailableLitres ?? 5000,
    });
  });

  const [isExecuting, setIsExecuting] = useState(false);
  const [loggedSuccess, setLoggedSuccess] = useState(false);

  // Recalculate whenever inputs change
  useEffect(() => {
    const validTemp = Math.min(60, Math.max(0, temperature));
    const validRain = Math.min(100, Math.max(0, rainProbability));
    const validMoisture = Math.min(100, Math.max(0, soilMoisture));
    const validArea = Math.max(0.1, parseFloat(areaAcres) || 1.0);

    const output = runIrrigationEngine({
      soilMoisture: validMoisture,
      temperature: validTemp,
      humidity,
      rainProbability: validRain,
      crop,
      cropStage,
      soilType,
      fieldArea: validArea,
      waterAvailable,
    });
    setResult(output);
  }, [soilMoisture, temperature, rainProbability, humidity, crop, cropStage, soilType, areaAcres, waterAvailable]);

  // When changing field from dropdown, sync values & compute
  const handleFieldChange = (id: string) => {
    setSelectedFieldId(id);
    const f = fields.find(item => item.id === id);
    if (f) {
      setCrop(f.crop);
      setCropStage(f.cropStage);
      setSoilType(f.soilType);
      setAreaAcres(f.areaAcres.toString());
      setSoilMoisture(f.soilMoisture);
      setTemperature(f.temperature);
      setRainProbability(f.rainProbability);
      setHumidity(f.humidity);
      setWaterAvailable(f.waterAvailableLitres || 5000);
    }
  };

  const handleManualRecalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const validTemp = Math.min(60, Math.max(0, temperature));
    const validRain = Math.min(100, Math.max(0, rainProbability));
    const validMoisture = Math.min(100, Math.max(0, soilMoisture));
    const validArea = Math.max(0.1, parseFloat(areaAcres) || 1.0);

    const output = runIrrigationEngine({
      soilMoisture: validMoisture,
      temperature: validTemp,
      humidity,
      rainProbability: validRain,
      crop,
      cropStage,
      soilType,
      fieldArea: validArea,
      waterAvailable,
    });
    setResult(output);
  };

  const handleExecuteCycle = () => {
    setIsExecuting(true);
    setTimeout(() => {
      const f = fields.find(item => item.id === selectedFieldId);
      const duration = result.durationMinutes.min || 20;
      const vol = Math.round(duration * 30 * (parseFloat(areaAcres) || 1));

      StorageService.addLog({
        fieldId: selectedFieldId || 'adviser-run',
        fieldName: f?.name || 'Smart Irrigation Run',
        crop,
        timestamp: new Date().toISOString(),
        decision: result.decision,
        durationMinutes: duration,
        waterAppliedLitres: vol,
        triggerType: 'Decision Engine Recommendation',
        notes: `Executed via Irrigation Advisor: ${result.durationMinutes.formatted}`,
      });

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10b981', '#38bdf8', '#059669'],
        });
      } catch (e) {
        console.log(e);
      }

      setIsExecuting(false);
      setLoggedSuccess(true);
      setTimeout(() => setLoggedSuccess(false), 3000);
    }, 500);
  };

  const isIrrigate = result.decision === 'IRRIGATE';
  const isWait = result.decision === 'WAIT';
  const isMonitor = result.decision === 'MONITOR';
  const isPrioritize = result.decision === 'PRIORITIZE';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Irrigation Advisor</span>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-500" />
            <span>Live Instant Engine</span>
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Adjust environmental parameters to calculate precise irrigation durations and water-saving advice in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Form Controls */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Configure Field Parameters</h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Live Auto-Calculate
            </span>
          </div>

          <form onSubmit={handleManualRecalculate} className="space-y-4">
            
            {/* Field Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Select Field
              </label>
              <select
                value={selectedFieldId}
                onChange={(e) => handleFieldChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-200 bg-slate-50 focus:bg-white cursor-pointer"
              >
                {fields.length === 0 ? (
                  <option value="">Manual Simulator Parcel</option>
                ) : (
                  fields.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.crop} - {f.areaAcres} ac)
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Crop & Growth Stage */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Crop Type
                </label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value as CropType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none bg-slate-50 cursor-pointer"
                >
                  {['Paddy (Rice)', 'Maize (Corn)', 'Groundnut (Peanut)', 'Cotton', 'Chilli', 'Sugarcane', 'Tomato', 'Wheat'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Growth Stage
                </label>
                <select
                  value={cropStage}
                  onChange={(e) => setCropStage(e.target.value as CropStage)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none bg-slate-50 cursor-pointer"
                >
                  {[
                    'Germination / Seedling',
                    'Vegetative Growth',
                    'Flowering / Tillering',
                    'Grain / Pod Formation',
                    'Ripening / Maturity'
                  ].map((s) => (
                    <option key={s} value={s}>{s.split(' / ')[0]}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Soil Moisture Slider */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-rose-500" />
                  Soil Moisture (%)
                </span>
                <span className={`text-sm font-extrabold px-2 py-0.5 rounded-lg ${
                  soilMoisture < 30 ? 'bg-rose-100 text-rose-800' : soilMoisture <= 55 ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                }`}>
                  {soilMoisture}% ({soilMoisture < 30 ? 'Dry' : soilMoisture <= 55 ? 'Optimal' : 'Wet'})
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={soilMoisture}
                onChange={(e) => setSoilMoisture(parseInt(e.target.value, 10) || 0)}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0% (Parched)</span>
                <span>30% (Critical)</span>
                <span>55% (Adequate)</span>
                <span>100% (Saturated)</span>
              </div>
            </div>

            {/* Temperature & Rain Probability */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                  Temp (°C)
                </label>
                <input
                  type="number"
                  min="5"
                  max="55"
                  value={temperature}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setTemperature(isNaN(val) ? 30 : Math.min(55, Math.max(0, val)));
                  }}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-sm font-bold bg-white"
                />
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <CloudRain className="w-3.5 h-3.5 text-sky-500" />
                  Rain Prob (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={rainProbability}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setRainProbability(isNaN(val) ? 0 : Math.min(100, Math.max(0, val)));
                  }}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-sm font-bold bg-white"
                />
              </div>
            </div>

            {/* Available Water Supply */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Waves className="w-3.5 h-3.5 text-blue-500" />
                Available Water Reserve (Litres)
              </label>
              <input
                type="number"
                step="500"
                min="0"
                max="50000"
                value={waterAvailable}
                onChange={(e) => setWaterAvailable(parseFloat(e.target.value) || 5000)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-sm font-bold bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Recommendation</span>
            </button>
          </form>
        </div>

        {/* Right Column: Large Result Card */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all duration-300 ${
            isIrrigate
              ? 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white border-emerald-500/30 shadow-emerald-700/20'
              : isWait
              ? 'bg-gradient-to-br from-sky-600 to-blue-700 text-white border-sky-500/30 shadow-sky-700/20'
              : isPrioritize
              ? 'bg-gradient-to-br from-amber-600 to-orange-700 text-white border-amber-500/30 shadow-amber-700/20'
              : 'bg-gradient-to-br from-slate-700 to-slate-800 text-white border-slate-600/30'
          }`}>
            
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/20 backdrop-blur-md">
                Recommendation Output
              </span>
              <span className="text-xs text-white/90 font-semibold">
                Confidence: <strong>{result.confidence} ({result.confidenceScorePercent}%)</strong>
              </span>
            </div>

            <div className="flex items-center gap-4 my-2">
              <div className="p-3.5 rounded-2xl bg-white/15 backdrop-blur-md">
                {isIrrigate && <Droplets className="w-10 h-10 fill-white/20" />}
                {isWait && <CloudRain className="w-10 h-10 fill-white/20" />}
                {isMonitor && <CheckCircle2 className="w-10 h-10" />}
                {isPrioritize && <AlertCircle className="w-10 h-10" />}
              </div>

              <div>
                <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                  {isIrrigate && '💧 IRRIGATE'}
                  {isWait && '🌧️ WAIT'}
                  {isMonitor && '🌱 MONITOR'}
                  {isPrioritize && '⚠️ PRIORITIZE'}
                </h3>
                <p className="text-white/90 text-sm sm:text-base mt-1">
                  {result.actionSummary}
                </p>
              </div>
            </div>

            {/* Duration Display */}
            <div className="my-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-semibold text-white/70">Recommended Duration</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">{result.durationMinutes.formatted}</p>
              </div>
              <div className="text-right">
                <span className="text-xs uppercase font-semibold text-white/70">Preferred System</span>
                <p className="text-sm font-bold text-white">{result.recommendedMethod}</p>
              </div>
            </div>

            {/* Why Section */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/80">
                Why this recommendation was reached:
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-white/95">
                {result.reasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-300 mt-1.5 shrink-0" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 mt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[11px] text-white/70 text-center sm:text-left">
                Estimated water: ~{result.estimatedWaterRequiredLitres.toLocaleString()} L
              </p>

              {(isIrrigate || isPrioritize) && (
                <button
                  onClick={handleExecuteCycle}
                  disabled={isExecuting || loggedSuccess}
                  className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 ${
                    loggedSuccess
                      ? 'bg-white text-emerald-900 shadow-md'
                      : 'bg-white text-emerald-900 hover:bg-emerald-50 hover:scale-[1.03]'
                  }`}
                >
                  {loggedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Action Logged in History!</span>
                    </>
                  ) : isExecuting ? (
                    <span>Logging...</span>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-emerald-900" />
                      <span>Execute & Log This Cycle</span>
                    </>
                  )}
                </button>
              )}
            </div>

          </div>

          {/* Prototype Disclaimer */}
          <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Smart Decision Rules:</strong> Soil moisture below 30% triggers <strong>IRRIGATE</strong>. If rain probability is ≥60% or soil moisture is above 55% (saturated), it recommends <strong>WAIT</strong> to save water and prevent root rot.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
