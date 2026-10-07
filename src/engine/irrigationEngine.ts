import { 
  IrrigationEngineInput, 
  IrrigationEngineOutput, 
  EngineThresholds, 
  IrrigationDecision, 
  PriorityLevel,
  DetailedWhy 
} from '../types';

/**
 * Default Configurable Prototype Assumptions.
 * Note: These are baseline decision thresholds designed for prototype testing
 * and demonstrative decision support, not rigid universal agricultural standards.
 */
export const DEFAULT_THRESHOLDS: EngineThresholds = {
  lowSoilMoisture: 30, // % threshold below which soil is considered dry
  highRainProbability: 60, // % threshold above which rain is expected soon
  highTemperature: 32, // °C threshold for elevated evapotranspiration stress
  moderateMoistureMin: 31,
  moderateMoistureMax: 55,
  criticalWaterAvailableLitres: 2000,
};

/**
 * Crop water demand factors (multiplier for duration and priority)
 */
const CROP_WATER_FACTORS: Record<string, { factor: number; preferredMethod: 'Drip Irrigation' | 'Sprinkler System' | 'Furrow / Basin' }> = {
  'Paddy (Rice)': { factor: 1.35, preferredMethod: 'Furrow / Basin' },
  'Sugarcane': { factor: 1.25, preferredMethod: 'Furrow / Basin' },
  'Tomato': { factor: 1.15, preferredMethod: 'Drip Irrigation' },
  'Chilli': { factor: 1.10, preferredMethod: 'Drip Irrigation' },
  'Maize (Corn)': { factor: 1.00, preferredMethod: 'Sprinkler System' },
  'Cotton': { factor: 0.95, preferredMethod: 'Drip Irrigation' },
  'Wheat': { factor: 0.90, preferredMethod: 'Sprinkler System' },
  'Groundnut (Peanut)': { factor: 0.85, preferredMethod: 'Sprinkler System' },
};

/**
 * Growth stage water sensitivity weighting
 */
const STAGE_SENSITIVITY: Record<string, { weight: number; label: string }> = {
  'Germination / Seedling': { weight: 1.1, label: 'Early delicate root establishment' },
  'Vegetative Growth': { weight: 1.0, label: 'Active foliage development' },
  'Flowering / Tillering': { weight: 1.4, label: 'Critical reproductive moisture window (high risk of flower drop if dry)' },
  'Grain / Pod Formation': { weight: 1.3, label: 'High yield formation demand' },
  'Ripening / Maturity': { weight: 0.6, label: 'Moisture dry-down stage before harvest' },
};

/**
 * Soil retention factors
 */
const SOIL_RETENTION: Record<string, { drainageFactor: number; description: string }> = {
  'Clay': { drainageFactor: 0.85, description: 'High moisture retention, slower infiltration' },
  'Black Cotton Soil': { drainageFactor: 0.90, description: 'Deep water holding capacity, prone to cracking when dry' },
  'Alluvial Soil': { drainageFactor: 1.00, description: 'Balanced loam, moderate drainage' },
  'Loamy': { drainageFactor: 1.00, description: 'Optimal moisture and aeration balance' },
  'Red Sandy Loam': { drainageFactor: 1.15, description: 'Moderate drainage, requires steady replenishment' },
  'Sandy Loam': { drainageFactor: 1.30, description: 'Fast draining, needs shorter frequent cycles' },
};

/**
 * Main Explainable Irrigation Decision Engine
 */
export function runIrrigationEngine(input: IrrigationEngineInput): IrrigationEngineOutput {
  const thresholds = input.customThresholds || DEFAULT_THRESHOLDS;
  const {
    soilMoisture,
    temperature,
    humidity,
    rainProbability,
    crop,
    cropStage,
    soilType,
    fieldArea,
    waterAvailable,
  } = input;

  const cropMeta = CROP_WATER_FACTORS[crop] || { factor: 1.0, preferredMethod: 'Drip Irrigation' };
  const stageMeta = STAGE_SENSITIVITY[cropStage] || { weight: 1.0, label: 'Normal crop growth' };
  const soilMeta = SOIL_RETENTION[soilType] || { drainageFactor: 1.0, description: 'Standard soil drainage' };

  let decision: IrrigationDecision = 'MONITOR';
  let priority: PriorityLevel = 'Medium';
  let priorityScore = 50;
  const reasons: string[] = [];

  // Determine Factors
  const isSoilLow = soilMoisture < thresholds.lowSoilMoisture;
  const isSoilModerate = soilMoisture >= thresholds.moderateMoistureMin && soilMoisture <= thresholds.moderateMoistureMax;
  const isSoilHigh = soilMoisture > thresholds.moderateMoistureMax;
  const isRainLikely = rainProbability >= thresholds.highRainProbability;
  const isTempHigh = temperature >= thresholds.highTemperature;
  const isWaterLimited = waterAvailable < thresholds.criticalWaterAvailableLitres || (waterAvailable / Math.max(1, fieldArea)) < 1200;

  // Primary Rule Evaluation
  if (isSoilLow && !isRainLikely) {
    if (isWaterLimited) {
      decision = 'PRIORITIZE';
      priority = 'High';
      priorityScore = 92;
      reasons.push(`Soil moisture (${soilMoisture}%) is below ${thresholds.lowSoilMoisture}% threshold.`);
      reasons.push(`Low rain probability (${rainProbability}%), but water reserves are constrained (${waterAvailable.toLocaleString()} L).`);
      reasons.push(`Rationed high-priority cycle recommended to prevent permanent crop wilting.`);
    } else {
      decision = 'IRRIGATE';
      priority = 'High';
      priorityScore = 88;
      reasons.push(`Soil moisture (${soilMoisture}%) is critically low (< ${thresholds.lowSoilMoisture}%).`);
      reasons.push(`Rain probability is low (${rainProbability}%), so no natural precipitation is anticipated.`);
      if (isTempHigh) {
        reasons.push(`High ambient temperature (${temperature}°C) accelerates evapotranspiration.`);
      }
      reasons.push(`${crop} at ${cropStage} requires prompt hydration.`);
    }
  } else if (isSoilLow && isRainLikely) {
    decision = 'WAIT';
    priority = 'Medium';
    priorityScore = 45;
    reasons.push(`Soil moisture is low (${soilMoisture}%), but rain probability is high (${rainProbability}%).`);
    reasons.push(`Postponing irrigation saves water and prevents root waterlogging.`);
    reasons.push(`Re-evaluate soil moisture immediately after expected rainfall window.`);
  } else if (isSoilModerate) {
    if (isRainLikely) {
      decision = 'WAIT';
      priority = 'Low';
      priorityScore = 25;
      reasons.push(`Soil moisture (${soilMoisture}%) is in the safe moderate range.`);
      reasons.push(`Impending rainfall (${rainProbability}%) will maintain adequate root moisture.`);
      reasons.push(`Irrigation is unnecessary today.`);
    } else if (isTempHigh && stageMeta.weight > 1.2) {
      decision = 'MONITOR';
      priority = 'Medium';
      priorityScore = 60;
      reasons.push(`Soil moisture (${soilMoisture}%) is currently acceptable.`);
      reasons.push(`However, high temperature (${temperature}°C) and critical stage (${cropStage}) warrant close monitoring.`);
      reasons.push(`Prepare for irrigation in 12-24 hours if moisture drops further.`);
    } else {
      decision = 'MONITOR';
      priority = 'Low';
      priorityScore = 35;
      reasons.push(`Soil moisture (${soilMoisture}%) is well within the optimal threshold (${thresholds.moderateMoistureMin}-${thresholds.moderateMoistureMax}%).`);
      reasons.push(`Current weather conditions do not pose immediate crop water stress.`);
    }
  } else if (isSoilHigh) {
    decision = 'WAIT';
    priority = 'Low';
    priorityScore = 15;
    reasons.push(`Soil moisture (${soilMoisture}%) is high (> ${thresholds.moderateMoistureMax}%).`);
    reasons.push(`Root zone is fully hydrated. Additional irrigation would cause leaching and water wastage.`);
  }

  // Calculate Duration (minutes)
  // Base 20 minutes for 1 acre with standard deficit, adjusted by area, moisture deficit, crop factor, and soil type
  let baseDuration = 20;
  if (decision === 'IRRIGATE' || decision === 'PRIORITIZE') {
    const moistureDeficit = Math.max(0, 50 - soilMoisture); // target 50%
    const areaScaled = Math.sqrt(Math.max(0.5, fieldArea));
    baseDuration = Math.round((moistureDeficit * 0.45 + 10) * areaScaled * cropMeta.factor * stageMeta.weight * (soilMeta.drainageFactor || 1));
  } else {
    baseDuration = 0;
  }

  const minDuration = decision === 'IRRIGATE' || decision === 'PRIORITIZE' ? Math.max(10, Math.round(baseDuration * 0.9)) : 0;
  const maxDuration = decision === 'IRRIGATE' || decision === 'PRIORITIZE' ? Math.max(15, Math.round(baseDuration * 1.1)) : 0;
  const formattedDuration = minDuration > 0 ? `${minDuration}–${maxDuration} minutes` : '0 minutes (Hold)';

  // Calculate Water Volume & Estimated Water Saved
  const litersPerMinute = 120 * Math.max(1, fieldArea);
  const estimatedWaterRequiredLitres = Math.round(baseDuration * litersPerMinute);
  
  // Estimated water saved calculation (avoided unneeded watering if WAIT or precision control vs flood default)
  let estimatedWaterSavedLitres = 0;
  if (decision === 'WAIT') {
    estimatedWaterSavedLitres = Math.round(20 * litersPerMinute * 1.2);
  } else if (decision === 'IRRIGATE' || decision === 'PRIORITIZE') {
    // Saved by targeted duration vs typical manual 45 min overwatering
    estimatedWaterSavedLitres = Math.max(200, Math.round((45 - baseDuration) * litersPerMinute * 0.5));
  } else {
    estimatedWaterSavedLitres = Math.round(15 * litersPerMinute * 0.8);
  }

  // Detailed Factor Breakdown for explainability
  const detailedWhy: DetailedWhy = {
    soilMoistureFactor: `${soilMoisture}% (${isSoilLow ? 'Low' : isSoilModerate ? 'Adequate' : 'Surplus'} vs ${thresholds.lowSoilMoisture}% target threshold)`,
    rainFactor: `${rainProbability}% chance (${isRainLikely ? 'High rain expected' : 'Dry forecast, negligible rain'})`,
    tempFactor: `${temperature}°C (${isTempHigh ? 'Elevated heat, increases water loss' : 'Moderate ambient temperature'})`,
    cropFactor: `${crop} (${cropMeta.factor >= 1.2 ? 'High water requirement' : 'Moderate drought tolerance'})`,
    stageFactor: `${cropStage} (${stageMeta.label})`,
    waterFactor: `${waterAvailable.toLocaleString()} L reserve (${isWaterLimited ? 'Limited reserve, prioritization applied' : 'Sufficient supply'})`,
  };

  // Confidence calculation
  let confidence: 'High' | 'Medium' | 'Moderate' = 'High';
  let confidenceScorePercent = 94;
  if (soilMoisture >= 28 && soilMoisture <= 33) {
    confidence = 'Medium';
    confidenceScorePercent = 82;
  } else if (rainProbability >= 45 && rainProbability <= 60) {
    confidence = 'Medium';
    confidenceScorePercent = 78;
  }

  const confidenceDisclaimer = 'Decision confidence is generated by the CropCare prototype decision logic and is not a scientifically validated laboratory accuracy score.';

  let actionSummary = '';
  if (decision === 'IRRIGATE') {
    actionSummary = `Field requires ${formattedDuration} of irrigation via ${cropMeta.preferredMethod}.`;
  } else if (decision === 'WAIT') {
    actionSummary = isRainLikely ? 'Postpone irrigation. Expected natural rainfall will replenish soil moisture.' : 'Soil is saturated. Hold irrigation to conserve water.';
  } else if (decision === 'MONITOR') {
    actionSummary = 'Moisture levels are stable. No irrigation required today. Recheck tomorrow.';
  } else {
    actionSummary = `High priority allocation: Run targeted ${formattedDuration} cycle to protect sensitive root zone with available water.`;
  }

  return {
    decision,
    durationMinutes: {
      min: minDuration,
      max: maxDuration,
      formatted: formattedDuration,
    },
    priority,
    priorityScore,
    reasons,
    detailedWhy,
    confidence,
    confidenceScorePercent,
    confidenceDisclaimer,
    recommendedMethod: cropMeta.preferredMethod,
    estimatedWaterRequiredLitres,
    estimatedWaterSavedLitres,
    actionSummary,
  };
}
