import React, { useState } from 'react';
import { 
  X, 
  Droplets, 
  Thermometer, 
  CloudRain, 
  Wind, 
  Sprout, 
  Clock, 
  Layers, 
  Activity, 
  History, 
  Info,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Play
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from 'recharts';
import { Field, IrrigationLog } from '../types';
import { runIrrigationEngine } from '../engine/irrigationEngine';
import { StorageService } from '../services/storageService';

interface FieldDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: Field;
  onOpenAdvisor?: (field: Field) => void;
}

export const FieldDetailsModal: React.FC<FieldDetailsModalProps> = ({
  isOpen,
  onClose,
  field,
  onOpenAdvisor,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sensors' | 'history'>('overview');

  if (!isOpen) return null;

  const logs = StorageService.getLogs().filter(l => l.fieldId === field.id || l.fieldName === field.name);
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

  // Simulated 24-hour Telemetry data points for Recharts
  const telemetryData = [
    { time: '06:00', moisture: Math.min(100, field.soilMoisture + 8), temp: 24, humidity: 68 },
    { time: '09:00', moisture: Math.min(100, field.soilMoisture + 5), temp: 28, humidity: 55 },
    { time: '12:00', moisture: Math.min(100, field.soilMoisture + 2), temp: 33, humidity: 45 },
    { time: '15:00', moisture: field.soilMoisture, temp: field.temperature, humidity: field.humidity },
    { time: '18:00 (est)', moisture: Math.max(10, field.soilMoisture - 3), temp: 31, humidity: 50 },
    { time: '21:00 (est)', moisture: Math.max(10, field.soilMoisture - 5), temp: 27, humidity: 62 },
  ];

  const isIrrigate = rec.decision === 'IRRIGATE' || rec.decision === 'PRIORITIZE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{field.name}</h2>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  field.status === 'Needs Irrigation' 
                    ? 'bg-rose-100 text-rose-700' 
                    : field.status === 'Healthy'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {field.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {field.crop} • {field.areaAcres} Acres • {field.soilType} • {field.location}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-100 bg-white">
          {[
            { id: 'overview' as const, label: 'Overview & Status', icon: Layers },
            { id: 'sensors' as const, label: 'Sensor Data & History', icon: Activity },
            { id: 'history' as const, label: 'Irrigation History', icon: History, count: logs.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-semibold text-xs sm:text-sm transition-all ${
                  isActive
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded-full text-slate-600">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Body Tabs */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Top Sensor Condition Grid */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Current Field Conditions (Live Telemetry)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  
                  <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100">
                    <span className="text-xs text-rose-700 font-semibold flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5" /> Soil Moisture
                    </span>
                    <p className="text-2xl font-bold text-rose-950 mt-1">{field.soilMoisture}%</p>
                    <span className="text-[11px] font-semibold text-rose-600">
                      {field.soilMoisture < 30 ? '🔴 Low Level' : 'Adequate'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100">
                    <span className="text-xs text-amber-700 font-semibold flex items-center gap-1.5">
                      <Thermometer className="w-3.5 h-3.5" /> Temperature
                    </span>
                    <p className="text-2xl font-bold text-amber-950 mt-1">{field.temperature}°C</p>
                    <span className="text-[11px] font-semibold text-amber-600">
                      {field.temperature >= 32 ? '🟡 High Heat' : 'Normal'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100">
                    <span className="text-xs text-sky-700 font-semibold flex items-center gap-1.5">
                      <CloudRain className="w-3.5 h-3.5" /> Rain Probability
                    </span>
                    <p className="text-2xl font-bold text-sky-950 mt-1">{field.rainProbability}%</p>
                    <span className="text-[11px] font-semibold text-sky-600">
                      {field.rainProbability < 20 ? 'Low chance' : 'High chance'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                      <Sprout className="w-3.5 h-3.5" /> Crop Stage
                    </span>
                    <p className="text-sm font-bold text-emerald-950 mt-1 line-clamp-1">{field.cropStage}</p>
                    <span className="text-[11px] font-semibold text-emerald-600">
                      Active Stage
                    </span>
                  </div>

                </div>
              </div>

              {/* CropCare Recommendation Highlight */}
              <div className={`p-5 rounded-2xl border ${
                isIrrigate ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-200 text-emerald-900">
                        Engine Decision
                      </span>
                      <span className="text-xs font-semibold text-slate-600">
                        Confidence: {rec.confidence} ({rec.confidenceScorePercent}%)
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      {rec.decision === 'IRRIGATE' && '💧 Irrigation Recommended'}
                      {rec.decision === 'WAIT' && '🌧️ Wait — Postpone Irrigation'}
                      {rec.decision === 'MONITOR' && '🌱 Safe — Monitor Soil Moisture'}
                      {rec.decision === 'PRIORITIZE' && '⚠️ High Priority Water Allocation'}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 max-w-lg">
                      {rec.actionSummary} Recommended duration: <strong>{rec.durationMinutes.formatted}</strong> via {rec.recommendedMethod}.
                    </p>
                  </div>

                  {onOpenAdvisor && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenAdvisor(field);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Open Advisor</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Field Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                  <p className="text-slate-500 font-medium">Telemetry Source:</p>
                  <p className="font-bold text-slate-800">Demo / Simulated IoT Mesh ({field.sensorStatus})</p>
                  <p className="text-slate-500 font-medium">Last Irrigated:</p>
                  <p className="font-bold text-slate-800">
                    {field.lastIrrigatedAt ? new Date(field.lastIrrigatedAt).toLocaleString() : 'No recent record'}
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                  <p className="text-slate-500 font-medium">Soil Retention Profile:</p>
                  <p className="font-bold text-slate-800">{field.soilType} (High moisture holding)</p>
                  <p className="text-slate-500 font-medium">Water Reservoir Allocation:</p>
                  <p className="font-bold text-slate-800">{field.waterAvailableLitres.toLocaleString()} Litres Available</p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: SENSORS & CHART */}
          {activeTab === 'sensors' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Soil Moisture History (24-Hour Telemetry)</h4>
                    <p className="text-xs text-slate-500">Hourly trend showing daytime decline and target hydration threshold</p>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Live Simulated Stream
                  </span>
                </div>

                <div className="h-64 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={telemetryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} unit="%" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="moisture" 
                        name="Soil Moisture"
                        stroke="#10b981" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#moistureGradient)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Secondary Sensor Cards */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-500">Ambient Temp</p>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">{field.temperature}°C</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-500">Relative Humidity</p>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">{field.humidity}%</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-500">Rain Prob.</p>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">{field.rainProbability}%</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">Irrigation Event History</h4>
                <span className="text-xs text-slate-500">Total {logs.length} logged sessions</span>
              </div>

              {logs.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <History className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No recorded irrigation cycles for this field yet.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {logs.map((log) => (
                    <div 
                      key={log.id} 
                      className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${
                          log.decision === 'IRRIGATE' ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700'
                        }`}>
                          <Droplets className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{log.decision}</span>
                            <span className="text-[11px] font-semibold text-slate-500">
                              • {log.durationMinutes > 0 ? `${log.durationMinutes} mins` : 'Avoided'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-900">
                          {log.waterAppliedLitres > 0 ? `${log.waterAppliedLitres.toLocaleString()} L` : '0 L (Saved)'}
                        </span>
                        <p className="text-[10px] text-slate-400">{log.triggerType}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Field ID: <code className="font-mono text-slate-700">{field.id}</code>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
