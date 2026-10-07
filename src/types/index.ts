export type CropType = 
  | 'Paddy (Rice)' 
  | 'Maize (Corn)' 
  | 'Groundnut (Peanut)' 
  | 'Cotton' 
  | 'Chilli' 
  | 'Sugarcane' 
  | 'Tomato' 
  | 'Wheat';

export type CropStage = 
  | 'Germination / Seedling'
  | 'Vegetative Growth'
  | 'Flowering / Tillering'
  | 'Grain / Pod Formation'
  | 'Ripening / Maturity';

export type SoilType = 
  | 'Clay' 
  | 'Sandy Loam' 
  | 'Black Cotton Soil' 
  | 'Red Sandy Loam' 
  | 'Alluvial Soil' 
  | 'Loamy';

export type IrrigationDecision = 'IRRIGATE' | 'WAIT' | 'MONITOR' | 'PRIORITIZE';

export type PriorityLevel = 'High' | 'Medium' | 'Low';

export interface Field {
  id: string;
  name: string;
  crop: CropType;
  areaAcres: number;
  soilType: SoilType;
  cropStage: CropStage;
  location: string;
  soilMoisture: number; // 0-100%
  temperature: number; // in Celsius
  humidity: number; // 0-100%
  rainProbability: number; // 0-100%
  waterAvailableLitres: number;
  status: 'Needs Irrigation' | 'Healthy' | 'Monitor' | 'Action Postponed';
  lastIrrigatedAt?: string;
  sensorStatus: 'Online' | 'Simulated' | 'Calibrating';
  sensorLastUpdated: string;
  notes?: string;
}

export interface IrrigationEngineInput {
  soilMoisture: number;
  temperature: number;
  humidity: number;
  rainProbability: number;
  crop: CropType;
  cropStage: CropStage;
  soilType: SoilType;
  fieldArea: number;
  waterAvailable: number; // in Litres
  customThresholds?: EngineThresholds;
}

export interface EngineThresholds {
  lowSoilMoisture: number; // default 30%
  highRainProbability: number; // default 60%
  highTemperature: number; // default 32°C
  moderateMoistureMin: number; // default 31%
  moderateMoistureMax: number; // default 55%
  criticalWaterAvailableLitres: number; // default 2000L
}

export interface DetailedWhy {
  soilMoistureFactor: string;
  rainFactor: string;
  tempFactor: string;
  cropFactor: string;
  stageFactor: string;
  waterFactor: string;
}

export interface IrrigationEngineOutput {
  decision: IrrigationDecision;
  durationMinutes: {
    min: number;
    max: number;
    formatted: string;
  };
  priority: PriorityLevel;
  priorityScore: number; // 1-100 scale for multi-field ranking
  reasons: string[];
  detailedWhy: DetailedWhy;
  confidence: 'High' | 'Medium' | 'Moderate';
  confidenceScorePercent: number;
  confidenceDisclaimer: string;
  recommendedMethod: 'Drip Irrigation' | 'Sprinkler System' | 'Furrow / Basin';
  estimatedWaterRequiredLitres: number;
  estimatedWaterSavedLitres: number;
  actionSummary: string;
}

export interface IrrigationLog {
  id: string;
  fieldId: string;
  fieldName: string;
  crop: CropType;
  timestamp: string;
  decision: IrrigationDecision;
  durationMinutes: number;
  waterAppliedLitres: number;
  triggerType: 'Manual' | 'Decision Engine Recommendation' | 'Scheduled Automation';
  notes?: string;
}

export interface CropScanResult {
  id: string;
  fieldId?: string;
  fieldName?: string;
  cropName: string;
  timestamp: string;
  imageUrl: string;
  status: string;
  confidencePercent: number;
  symptoms: string[];
  recommendations: string[];
  organicRemedy: string;
  urgency: 'Low' | 'Medium' | 'High';
  isSimulatedDemo: boolean;
}

export interface WeatherDay {
  dayName: string;
  dateStr: string;
  tempMax: number;
  tempMin: number;
  rainProbability: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Cloudy' | 'Light Rain' | 'Heavy Rain' | 'Thunderstorm';
  humidity: number;
  windSpeedKmH: number;
  advisory: string;
}

export type DemoScenarioId = 
  | 'dry_field' 
  | 'rain_coming' 
  | 'healthy_field' 
  | 'limited_water' 
  | 'heatwave';

export interface AppLanguage {
  code: 'en' | 'te' | 'hi' | 'ta';
  name: string;
  nativeName: string;
}
