import React, { useState } from 'react';
import { 
  X, 
  Droplets, 
  CloudRain, 
  Thermometer, 
  Sprout, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Sparkles, 
  Info, 
  Check 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Field, IrrigationEngineOutput } from '../types';
import { StorageService } from '../services/storageService';

interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: Field;
  recommendation: IrrigationEngineOutput;
  onSuccessExecute?: () => void;
}

export const RecommendationModal: React.FC<RecommendationModalProps> = ({
  isOpen,
  onClose,
  field,
  recommendation,
  onSuccessExecute,
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executedSuccess, setExecutedSuccess] = useState(false);

  if (!isOpen) return null;

  const isIrrigate = recommendation.decision === 'IRRIGATE';
  const isWait = recommendation.decision === 'WAIT';
  const isMonitor = recommendation.decision === 'MONITOR';
  const isPrioritize = recommendation.decision === 'PRIORITIZE';

  const handleExecuteIrrigation = () => {
    setIsExecuting(true);
    setTimeout(() => {
      const duration = recommendation.durationMinutes.min || 20;
      const waterVol = Math.round(duration * 30 * field.areaAcres);

      StorageService.addLog({
        fieldId: field.id,
        fieldName: field.name,
        crop: field.crop,
        timestamp: new Date().toISOString(),
        decision: recommendation.decision,
        durationMinutes: duration,
        waterAppliedLitres: waterVol,
        triggerType: 'Decision Engine Recommendation',
        notes: `Executed based on engine advice: ${recommendation.durationMinutes.formatted}.`,
      });

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#059669', '#38bdf8', '#34d399'],
        });
      } catch (e) {
        console.log(e);
      }

      setIsExecuting(false);
      setExecutedSuccess(true);
      if (onSuccessExecute) onSuccessExecute();

      setTimeout(() => {
        setExecutedSuccess(false);
        onClose();
      }, 1800);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className={`p-6 text-white relative overflow-hidden ${
          isIrrigate 
            ? 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700' 
            : isWait 
            ? 'bg-gradient-to-r from-sky-600 to-blue-700' 
            : isPrioritize
            ? 'bg-gradient-to-r from-amber-600 to-orange-700'
            : 'bg-gradient-to-r from-slate-700 to-slate-800'
        }`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase bg-white/20 backdrop-blur-md">
              CropCare Decision Engine
            </span>
            <span className="text-xs text-white/80">
              • {field.name} ({field.crop})
            </span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2.5">
                {isIrrigate && <Droplets className="w-8 h-8 text-emerald-200 fill-emerald-200/30" />}
                {isWait && <CloudRain className="w-8 h-8 text-sky-200 fill-sky-200/30" />}
                {isMonitor && <CheckCircle2 className="w-8 h-8 text-teal-200" />}
                {isPrioritize && <AlertCircle className="w-8 h-8 text-amber-200" />}
                
                {isIrrigate && 'Irrigation Recommended'}
                {isWait && 'Wait — Irrigation Not Needed'}
                {isMonitor && 'Monitor Conditions'}
                {isPrioritize && 'Prioritized Irrigation'}
              </h2>
              <p className="text-white/90 text-sm mt-1 max-w-lg">
                {recommendation.actionSummary}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Main Decision & Duration Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Suggested Duration</p>
                <p className="text-xl font-bold text-slate-900">{recommendation.durationMinutes.formatted}</p>
                <p className="text-xs text-slate-500">Method: {recommendation.recommendedMethod}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-700">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Decision Confidence</p>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-bold text-slate-900">{recommendation.confidence}</p>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {recommendation.confidenceScorePercent}% score
                  </span>
                </div>
                <p className="text-xs text-slate-500">Evaluated on multi-variable agronomic matrix</p>
              </div>
            </div>
          </div>

          {/* Section: Explain The Decision (Why?) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Why this decision?</span>
                <span className="text-xs font-normal text-slate-500">Factor-by-factor breakdown</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Soil Moisture */}
              <div className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-rose-500" />
                    Soil Moisture
                  </span>
                  <span className="font-bold text-slate-900">{field.soilMoisture}%</span>
                </div>
                <p className="text-xs text-slate-600">
                  {recommendation.detailedWhy.soilMoistureFactor}
                </p>
              </div>

              {/* Rain Probability */}
              <div className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span className="flex items-center gap-1.5">
                    <CloudRain className="w-3.5 h-3.5 text-sky-500" />
                    Rain Probability
                  </span>
                  <span className="font-bold text-slate-900">{field.rainProbability}%</span>
                </div>
                <p className="text-xs text-slate-600">
                  {recommendation.detailedWhy.rainFactor}
                </p>
              </div>

              {/* Temperature */}
              <div className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                    Temperature
                  </span>
                  <span className="font-bold text-slate-900">{field.temperature}°C</span>
                </div>
                <p className="text-xs text-slate-600">
                  {recommendation.detailedWhy.tempFactor}
                </p>
              </div>

              {/* Crop & Stage */}
              <div className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Sprout className="w-3.5 h-3.5 text-emerald-500" />
                    Crop & Stage
                  </span>
                  <span className="font-bold text-slate-900">{field.crop}</span>
                </div>
                <p className="text-xs text-slate-600">
                  {recommendation.detailedWhy.stageFactor}
                </p>
              </div>
            </div>
          </div>

          {/* Engine Reasons list */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">
              Rule Matched Rationale:
            </h4>
            <ul className="space-y-1.5">
              {recommendation.reasons.map((r, i) => (
                <li key={i} className="text-xs text-emerald-950 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            Estimated water requirement: <strong>~{recommendation.estimatedWaterRequiredLitres.toLocaleString()} Litres</strong>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-colors"
            >
              Close
            </button>

            {(isIrrigate || isPrioritize) && (
              <button
                onClick={handleExecuteIrrigation}
                disabled={isExecuting || executedSuccess}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                  executedSuccess
                    ? 'bg-emerald-600 shadow-emerald-500/20'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30 hover:scale-[1.02]'
                }`}
              >
                {executedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Irrigation Logged!</span>
                  </>
                ) : isExecuting ? (
                  <span>Logging Cycle...</span>
                ) : (
                  <>
                    <Droplets className="w-4 h-4" />
                    <span>Log / Run Irrigation</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
