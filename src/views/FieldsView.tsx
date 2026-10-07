import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Layers, 
  Droplets, 
  Thermometer, 
  CloudRain, 
  Sprout, 
  Trash2, 
  ExternalLink, 
  Filter, 
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Field } from '../types';
import { StorageService, subscribeToStorage } from '../services/storageService';
import { AddFieldModal } from '../components/AddFieldModal';
import { FieldDetailsModal } from '../components/FieldDetailsModal';
import { runIrrigationEngine } from '../engine/irrigationEngine';
import { useLanguage } from '../i18n/LanguageContext';

interface FieldsViewProps {
  onOpenAdvisorWithField?: (field: Field) => void;
}

export const FieldsView: React.FC<FieldsViewProps> = ({ onOpenAdvisorWithField }) => {
  const { t } = useLanguage();
  const [fields, setFields] = useState<Field[]>(StorageService.getFields());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedFieldForDetails, setSelectedFieldForDetails] = useState<Field | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  useEffect(() => {
    const unsubscribe = subscribeToStorage(() => {
      setFields(StorageService.getFields());
    });
    return unsubscribe;
  }, []);

  const handleDeleteField = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this field?')) {
      StorageService.deleteField(id);
    }
  };

  const filteredFields = fields.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{t('myFields')}</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {fields.length} {t('fieldsCount')}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('fieldsHeaderSubtitle')}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{t('addField')}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t('searchFieldsPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm outline-none bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-200 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500 font-semibold">{t('filter')}</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 outline-none focus:ring-2 focus:ring-emerald-200"
          >
            <option value="All">{t('allStatuses')}</option>
            <option value="Needs Irrigation">{t('needsIrrigation')}</option>
            <option value="Healthy">{t('healthy')}</option>
            <option value="Monitor">{t('monitor')}</option>
          </select>
        </div>
      </div>

      {/* Fields Grid or Empty State */}
      {filteredFields.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-slate-200/90 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
            <Sprout className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">{t('noFieldsFound')}</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery ? 'No fields matched your search filter.' : t('noFieldsFoundDesc')}
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addNewField')}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFields.map((field) => {
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

            return (
              <div
                key={field.id}
                onClick={() => setSelectedFieldForDetails(field)}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  {/* Top Title & Status */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {field.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">
                        {field.crop} • {field.areaAcres} {t('acres')}
                      </p>
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

                  {/* Soil & Conditions Gauges */}
                  <div className="grid grid-cols-2 gap-2.5 my-4">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5 text-emerald-600" />
                        {t('soilMoisture')}
                      </span>
                      <p className="text-xl font-extrabold text-slate-900 mt-1">{field.soilMoisture}%</p>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            field.soilMoisture < 30 ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${field.soilMoisture}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                        <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                        {t('temperature')}
                      </span>
                      <p className="text-xl font-extrabold text-slate-900 mt-1">{field.temperature}°C</p>
                      <span className="text-[10px] text-slate-500">{t('rainProbability')}: {field.rainProbability}%</span>
                    </div>
                  </div>

                  {/* Engine Recommendation mini banner */}
                  <div className={`p-3 rounded-2xl border text-xs ${
                    rec.decision === 'IRRIGATE' 
                      ? 'bg-rose-50/70 border-rose-100 text-rose-900' 
                      : rec.decision === 'WAIT'
                      ? 'bg-sky-50/70 border-sky-100 text-sky-900'
                      : 'bg-emerald-50/70 border-emerald-100 text-emerald-900'
                  }`}>
                    <p className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{rec.decision}: {rec.durationMinutes.formatted}</span>
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">
                      {rec.reasons[0] || rec.actionSummary}
                    </p>
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    {field.soilType} • {field.location}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDeleteField(e, field.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title={t('delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-emerald-700 flex items-center gap-0.5">
                      {t('viewDetails')}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Add Field Modal */}
      <AddFieldModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Field Details Modal */}
      {selectedFieldForDetails && (
        <FieldDetailsModal
          isOpen={!!selectedFieldForDetails}
          onClose={() => setSelectedFieldForDetails(null)}
          field={selectedFieldForDetails}
          onOpenAdvisor={onOpenAdvisorWithField}
        />
      )}

    </div>
  );
};
