import { 
  Field, 
  IrrigationLog, 
  CropScanResult, 
  EngineThresholds, 
  DemoScenarioId 
} from '../types';
import { DEFAULT_THRESHOLDS, runIrrigationEngine } from '../engine/irrigationEngine';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  FIELDS: 'cropcare_fields_v1',
  LOGS: 'cropcare_logs_v1',
  SCANS: 'cropcare_scans_v1',
  THRESHOLDS: 'cropcare_thresholds_v1',
  WATER_BUDGET: 'cropcare_water_budget_v1',
  ACTIVE_FIELD_ID: 'cropcare_active_field_v1',
  LOCATION: 'cropcare_location_v1',
};

// 100% Clean User Data (Zero Demo/Mock Seed Records)
const INITIAL_FIELDS: Field[] = [];
const INITIAL_LOGS: IrrigationLog[] = [];
const INITIAL_SCANS: CropScanResult[] = [];

export interface WaterBudgetState {
  availableLitres: number;
  usedLitres: number;
  estimatedSavedLitres: number;
  avoidedIrrigationsCount: number;
}

const INITIAL_WATER_BUDGET: WaterBudgetState = {
  availableLitres: 5000,
  usedLitres: 0,
  estimatedSavedLitres: 0,
  avoidedIrrigationsCount: 0,
};

type StorageListener = () => void;
const listeners: Set<StorageListener> = new Set();

export const subscribeToStorage = (listener: StorageListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = () => {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error(e);
    }
  });
};

export const StorageService = {
  // Sync from Supabase if connected
  async syncFromSupabase(): Promise<{ success: boolean; count: number; message: string }> {
    const client = getSupabaseClient();
    if (!client) {
      return { success: false, count: 0, message: 'Supabase is not configured' };
    }

    try {
      const { data, error } = await client.from('fields').select('*');
      if (error) throw error;

      if (data && data.length > 0) {
        const mappedFields: Field[] = data.map((row: any) => ({
          id: row.id,
          name: row.name,
          crop: row.crop,
          areaAcres: Number(row.area_acres) || 1.0,
          soilType: row.soil_type,
          cropStage: row.crop_stage,
          location: row.location || 'Tadikalapudi, Andhra Pradesh',
          soilMoisture: Number(row.soil_moisture) || 30,
          temperature: Number(row.temperature) || 32,
          humidity: Number(row.humidity) || 45,
          rainProbability: Number(row.rain_probability) || 10,
          waterAvailableLitres: Number(row.water_available_litres) || 5000,
          status: row.status || 'Healthy',
          lastIrrigatedAt: row.last_irrigated_at,
          sensorStatus: 'Online',
          sensorLastUpdated: 'Live from Supabase',
        }));

        this.saveFields(mappedFields);
        return { success: true, count: mappedFields.length, message: `Loaded ${mappedFields.length} fields from Supabase database!` };
      } else {
        return { success: true, count: 0, message: 'Connected to Supabase. No fields in table yet — add your first field!' };
      }
    } catch (err: any) {
      return { success: false, count: 0, message: `Failed to fetch from Supabase: ${err.message}` };
    }
  },

  // Push local fields into Supabase
  async pushLocalFieldsToSupabase(): Promise<{ success: boolean; message: string }> {
    const client = getSupabaseClient();
    if (!client) return { success: false, message: 'Supabase is not configured' };

    const fields = this.getFields();
    if (fields.length === 0) {
      return { success: false, message: 'No fields to export yet. Add a field first.' };
    }

    try {
      const rows = fields.map(f => ({
        name: f.name,
        crop: f.crop,
        area_acres: f.areaAcres,
        soil_type: f.soilType,
        crop_stage: f.cropStage,
        location: f.location,
        soil_moisture: f.soilMoisture,
        temperature: f.temperature,
        humidity: f.humidity,
        rain_probability: f.rainProbability,
        water_available_litres: f.waterAvailableLitres,
        status: f.status,
      }));

      const { error } = await client.from('fields').insert(rows);
      if (error) throw error;
      return { success: true, message: `Exported ${rows.length} fields to Supabase database!` };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  },

  // Fields
  getFields(): Field[] {
    const raw = localStorage.getItem(STORAGE_KEYS.FIELDS);
    if (!raw) {
      return INITIAL_FIELDS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_FIELDS;
    }
  },

  getFieldById(id: string): Field | undefined {
    return this.getFields().find(f => f.id === id);
  },

  saveFields(fields: Field[]) {
    localStorage.setItem(STORAGE_KEYS.FIELDS, JSON.stringify(fields));
    notifyListeners();
  },

  addField(newField: Omit<Field, 'id' | 'sensorStatus' | 'sensorLastUpdated' | 'status'> & { id?: string }): Field {
    const fields = this.getFields();
    
    const engineRes = runIrrigationEngine({
      soilMoisture: newField.soilMoisture,
      temperature: newField.temperature,
      humidity: newField.humidity,
      rainProbability: newField.rainProbability,
      crop: newField.crop,
      cropStage: newField.cropStage,
      soilType: newField.soilType,
      fieldArea: newField.areaAcres,
      waterAvailable: newField.waterAvailableLitres,
    });

    let statusText: Field['status'] = 'Healthy';
    if (engineRes.decision === 'IRRIGATE' || engineRes.decision === 'PRIORITIZE') {
      statusText = 'Needs Irrigation';
    } else if (engineRes.decision === 'MONITOR') {
      statusText = 'Monitor';
    } else if (engineRes.decision === 'WAIT') {
      statusText = 'Action Postponed';
    }

    const field: Field = {
      ...newField,
      id: newField.id || `f-${Date.now()}`,
      status: statusText,
      sensorStatus: isSupabaseConfigured() ? 'Online' : 'Online',
      sensorLastUpdated: 'Just now',
    };

    const updated = [field, ...fields];
    this.saveFields(updated);

    // Asynchronously insert into Supabase if configured
    const client = getSupabaseClient();
    if (client) {
      client.from('fields').insert([{
        name: field.name,
        crop: field.crop,
        area_acres: field.areaAcres,
        soil_type: field.soilType,
        crop_stage: field.cropStage,
        location: field.location,
        soil_moisture: field.soilMoisture,
        temperature: field.temperature,
        humidity: field.humidity,
        rain_probability: field.rainProbability,
        water_available_litres: field.waterAvailableLitres,
        status: field.status,
      }]).then(({ error }) => {
        if (error) console.warn('Failed to sync new field to Supabase:', error.message);
      });
    }

    return field;
  },

  updateField(id: string, updates: Partial<Field>): Field | undefined {
    const fields = this.getFields();
    let updatedField: Field | undefined;

    const newFields = fields.map(f => {
      if (f.id === id) {
        const merged = { ...f, ...updates, sensorLastUpdated: 'Just now' };
        
        if (updates.soilMoisture !== undefined || updates.rainProbability !== undefined || updates.temperature !== undefined) {
          const res = runIrrigationEngine({
            soilMoisture: merged.soilMoisture,
            temperature: merged.temperature,
            humidity: merged.humidity,
            rainProbability: merged.rainProbability,
            crop: merged.crop,
            cropStage: merged.cropStage,
            soilType: merged.soilType,
            fieldArea: merged.areaAcres,
            waterAvailable: merged.waterAvailableLitres,
          });
          if (res.decision === 'IRRIGATE' || res.decision === 'PRIORITIZE') {
            merged.status = 'Needs Irrigation';
          } else if (res.decision === 'MONITOR') {
            merged.status = 'Monitor';
          } else {
            merged.status = 'Healthy';
          }
        }

        updatedField = merged;
        return merged;
      }
      return f;
    });

    this.saveFields(newFields);

    const client = getSupabaseClient();
    if (client && updatedField) {
      client.from('fields').update({
        soil_moisture: updatedField.soilMoisture,
        temperature: updatedField.temperature,
        humidity: updatedField.humidity,
        rain_probability: updatedField.rainProbability,
        water_available_litres: updatedField.waterAvailableLitres,
        status: updatedField.status,
        last_irrigated_at: updatedField.lastIrrigatedAt,
      }).eq('id', id).then(() => {});
    }

    return updatedField;
  },

  deleteField(id: string) {
    const fields = this.getFields().filter(f => f.id !== id);
    this.saveFields(fields);

    const client = getSupabaseClient();
    if (client) {
      client.from('fields').delete().eq('id', id).then(() => {});
    }
  },

  getActiveFieldId(): string {
    const id = localStorage.getItem(STORAGE_KEYS.ACTIVE_FIELD_ID);
    const fields = this.getFields();
    if (id && fields.some(f => f.id === id)) return id;
    return fields[0]?.id || '';
  },

  setActiveFieldId(id: string) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_FIELD_ID, id);
    notifyListeners();
  },

  // Irrigation Logs
  getLogs(): IrrigationLog[] {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!raw) {
      return INITIAL_LOGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_LOGS;
    }
  },

  addLog(log: Omit<IrrigationLog, 'id'>): IrrigationLog {
    const logs = this.getLogs();
    const newLog: IrrigationLog = {
      ...log,
      id: `log-${Date.now()}`,
    };
    const updated = [newLog, ...logs];
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));

    const budget = this.getWaterBudget();
    if (log.decision === 'IRRIGATE' || log.decision === 'PRIORITIZE') {
      budget.usedLitres += log.waterAppliedLitres;
      budget.availableLitres = Math.max(0, budget.availableLitres - log.waterAppliedLitres);
      budget.estimatedSavedLitres += Math.round(log.waterAppliedLitres * 0.35);
    } else if (log.decision === 'WAIT') {
      budget.avoidedIrrigationsCount += 1;
      budget.estimatedSavedLitres += 450;
    }
    this.saveWaterBudget(budget);

    if (log.fieldId) {
      const field = this.getFieldById(log.fieldId);
      if (field) {
        this.updateField(log.fieldId, {
          lastIrrigatedAt: new Date().toISOString(),
          soilMoisture: log.decision === 'IRRIGATE' ? Math.min(85, field.soilMoisture + 40) : field.soilMoisture,
        });
      }
    }

    const client = getSupabaseClient();
    if (client) {
      client.from('irrigation_history').insert([{
        field_name: log.fieldName,
        crop: log.crop,
        decision: log.decision,
        duration_minutes: log.durationMinutes,
        water_applied_litres: log.waterAppliedLitres,
        trigger_type: log.triggerType,
      }]).then(() => {});
    }

    notifyListeners();
    return newLog;
  },

  // Crop Health Scans
  getScans(): CropScanResult[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SCANS);
    if (!raw) {
      return INITIAL_SCANS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SCANS;
    }
  },

  addScan(scan: Omit<CropScanResult, 'id' | 'timestamp'>): CropScanResult {
    const scans = this.getScans();
    const newScan: CropScanResult = {
      ...scan,
      id: `scan-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    const updated = [newScan, ...scans];
    localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(updated));
    notifyListeners();
    return newScan;
  },

  // Thresholds
  getThresholds(): EngineThresholds {
    const raw = localStorage.getItem(STORAGE_KEYS.THRESHOLDS);
    if (!raw) return DEFAULT_THRESHOLDS;
    try {
      return { ...DEFAULT_THRESHOLDS, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_THRESHOLDS;
    }
  },

  saveThresholds(thresholds: EngineThresholds) {
    localStorage.setItem(STORAGE_KEYS.THRESHOLDS, JSON.stringify(thresholds));
    notifyListeners();
  },

  // Water Budget
  getWaterBudget(): WaterBudgetState {
    const raw = localStorage.getItem(STORAGE_KEYS.WATER_BUDGET);
    if (!raw) {
      return INITIAL_WATER_BUDGET;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_WATER_BUDGET;
    }
  },

  saveWaterBudget(budget: WaterBudgetState) {
    localStorage.setItem(STORAGE_KEYS.WATER_BUDGET, JSON.stringify(budget));
    notifyListeners();
  },

  // Location
  getLocation(): string {
    return localStorage.getItem(STORAGE_KEYS.LOCATION) || 'Live Farm Location';
  },

  setLocation(loc: string) {
    localStorage.setItem(STORAGE_KEYS.LOCATION, loc);
    notifyListeners();
  },

  // Clear all local cache
  resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.FIELDS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    localStorage.removeItem(STORAGE_KEYS.SCANS);
    localStorage.removeItem(STORAGE_KEYS.THRESHOLDS);
    localStorage.removeItem(STORAGE_KEYS.WATER_BUDGET);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_FIELD_ID);
    localStorage.removeItem(STORAGE_KEYS.LOCATION);
    notifyListeners();
  }
};
