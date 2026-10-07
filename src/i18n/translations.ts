export type Language = 'en' | 'te' | 'hi' | 'ta';

export interface TranslationDict {
  // Navigation & Brand
  tagline: string;
  smartAgri: string;
  greeting: string;
  subtitle: string;
  dashboard: string;
  myFields: string;
  landMapping: string;
  irrigation: string;
  cropHealth: string;
  weather: string;
  reports: string;
  settings: string;
  landingPage: string;

  // Daily Action Bar
  dailyActionsTitle: string;
  dailyActionsSubtitle: string;
  landMappingAction: string;
  landMappingDesc: string;
  advisorAction: string;
  advisorDesc: string;
  cropDoctorAction: string;
  cropDoctorDesc: string;
  weatherAction: string;
  weatherDesc: string;

  // Common Status & Badges
  active: string;
  live: string;
  gps: string;
  visionAi: string;
  cloudSynced: string;
  ready: string;
  healthy: string;
  needsIrrigation: string;
  monitor: string;
  irrigateNow: string;
  wait: string;
  connected: string;
  syncing: string;
  saved: string;
  details: string;
  viewDetails: string;
  delete: string;
  cancel: string;
  search: string;
  filter: string;
  all: string;
  allStatuses: string;
  lowLevel: string;
  adequate: string;
  highHeat: string;
  optimal: string;
  clearSky: string;
  rainExpected: string;
  monitored: string;
  acres: string;
  hectares: string;
  cents: string;
  perimeter: string;
  meters: string;
  feetAroundFence: string;

  // Dashboard
  heroDecisionTitle: string;
  heroDuration: string;
  explainDecision: string;
  logIrrigation: string;
  farmSummaryTitle: string;
  farmSummarySubtitle: string;
  totalFarmArea: string;
  healthyFields: string;
  actionRequired: string;
  activeParcels: string;
  manageFields: string;
  localWeatherTitle: string;
  forecast7Day: string;
  todaysDecision: string;
  viewRecDetails: string;
  customizeParameters: string;
  monitoredFields: string;
  monitoredFieldsDesc: string;
  viewAllFields: string;
  soilMoisture: string;
  temperature: string;
  rainProbability: string;
  humidity: string;
  target: string;
  evapoIndex: string;
  liveRadar: string;

  // Fields & Land Mapping
  addField: string;
  saveField: string;
  fieldName: string;
  cropType: string;
  growthStage: string;
  soilType: string;
  landAreaAcres: string;
  myLiveGps: string;
  pinMySpot: string;
  satelliteLabels: string;
  openVillageMap: string;
  esriSatellite: string;
  calculatedLandArea: string;
  searchFieldsPlaceholder: string;
  noFieldsFound: string;
  noFieldsFoundDesc: string;
  addNewField: string;
  fieldsCount: string;
  fieldsHeaderSubtitle: string;
  landMappingTitle: string;
  landMappingSubtitle: string;
  saveAsNewParcel: string;
  gpsGeodesy: string;
  totalAcreage: string;
  hectaresAndCents: string;
  squareFootage: string;
  boundaryPerimeter: string;
  howToMapLand: string;
  step1Locate: string;
  step1Desc: string;
  step2Pins: string;
  step2Desc: string;
  step3Save: string;
  step3Desc: string;

  // Reports
  reportsTitle: string;
  reportsSubtitle: string;
  exportCsv: string;
  soilMoistureTrends: string;
  decisionDistribution: string;
  averageMoisture: string;
  decisionCycles: string;
  fieldTelemetryLog: string;

  // Plant Doctor / Crop Health
  plantDoctorTitle: string;
  plantDoctorSubtitle: string;
  uploadPhoto: string;
  takePhoto: string;
  diagnosing: string;
  pathologyReport: string;
  organicRemedy: string;
  chemicalRemedy: string;
  recentScanHistory: string;
  clearHistory: string;
  dropLeafPrompt: string;
  aiVisionStatus: string;

  // Settings
  systemSettingsTitle: string;
  systemSettingsSubtitle: string;
  developerKeys: string;
  hideCredentials: string;
  plantDoctorAiStatus: string;
  hfClassifier: string;
  neuralLeafDesc: string;
  cloudDbStatus: string;
  postgresSync: string;
  pullFields: string;
  pushFields: string;
  sensitivityThresholds: string;
  sensitivityDesc: string;
  restoreDefaults: string;
  saveConfiguration: string;
  lowMoistureThreshold: string;
  highRainProbThreshold: string;
  highTempThreshold: string;
  defaultVal: string;
  languageTitle: string;
  languageSubtitle: string;
  resetAppState: string;
  resetAppSubtitle: string;
  resetAllData: string;
  resetConfirmPrompt: string;
  hfTokenLabel: string;
  hfModelLabel: string;
  updateToken: string;
  supabaseUrlLabel: string;
  supabaseKeyLabel: string;
  saveAndVerify: string;
  testingConnection: string;

  // Weather View
  weatherTitle: string;
  weatherSubtitle: string;
  searchVillagePlaceholder: string;
}

export const TRANSLATIONS: Record<Language, TranslationDict> = {
  en: {
    tagline: 'Smarter Decisions. Healthier Crops.',
    smartAgri: 'SMART AGRI',
    greeting: 'Good Day, Farmer',
    subtitle: 'Smart Decision Support & Field Telemetry Hub',
    dashboard: 'Dashboard',
    myFields: 'My Fields',
    landMapping: 'Land Mapping',
    irrigation: 'Irrigation',
    cropHealth: 'Crop Health',
    weather: 'Weather',
    reports: 'Reports',
    settings: 'Settings',
    landingPage: 'Landing Page',

    dailyActionsTitle: 'Daily Smart Farming Actions',
    dailyActionsSubtitle: 'Quick access to daily farm management workflows',
    landMappingAction: 'Land Mapping',
    landMappingDesc: 'Pin farm boundaries & calculate acres',
    advisorAction: 'Irrigation Advisor',
    advisorDesc: 'Calculate precise run duration (minutes)',
    cropDoctorAction: 'AI Crop Doctor',
    cropDoctorDesc: 'Hugging Face optical leaf diagnosis',
    weatherAction: 'Weather Forecast',
    weatherDesc: '7-day rain probability & heat index',

    active: 'Active',
    live: 'Live',
    gps: 'GPS',
    visionAi: 'Vision AI',
    cloudSynced: 'Cloud Synced',
    ready: 'Ready',
    healthy: 'Healthy',
    needsIrrigation: 'Needs Irrigation',
    monitor: 'Monitor',
    irrigateNow: 'IRRIGATE NOW',
    wait: 'HOLD / WAIT',
    connected: 'Connected',
    syncing: 'Syncing...',
    saved: 'Saved!',
    details: 'Details',
    viewDetails: 'View Details →',
    delete: 'Delete',
    cancel: 'Cancel',
    search: 'Search',
    filter: 'Filter:',
    all: 'All',
    allStatuses: 'All Statuses',
    lowLevel: 'Low Level',
    adequate: 'Adequate',
    highHeat: 'High Heat',
    optimal: 'Optimal',
    clearSky: 'Clear Sky',
    rainExpected: 'Rain Expected',
    monitored: 'Monitored',
    acres: 'Acres',
    hectares: 'Ha',
    cents: 'Cents',
    perimeter: 'Boundary Perimeter',
    meters: 'Meters',
    feetAroundFence: 'Feet around fence',

    heroDecisionTitle: 'Smart Irrigation Advisory',
    heroDuration: 'Recommended Duration',
    explainDecision: 'Why this decision?',
    logIrrigation: 'Log Irrigation Run',
    farmSummaryTitle: 'Farm Parcels & Crop Health Summary',
    farmSummarySubtitle: 'Autonomous sensor telemetry tracking and field stress monitoring',
    totalFarmArea: 'Total Farm Area',
    healthyFields: 'Healthy Fields',
    actionRequired: 'Action Required',
    activeParcels: 'active parcels',
    manageFields: 'Manage Fields',
    localWeatherTitle: 'Local Weather',
    forecast7Day: '7-Day Forecast →',
    todaysDecision: "Today's Irrigation Decision",
    viewRecDetails: 'View Recommendation Details',
    customizeParameters: 'Customize Parameters',
    monitoredFields: 'Your Monitored Fields',
    monitoredFieldsDesc: 'Select any parcel to view live telemetry and generate instant advice',
    viewAllFields: 'View All Fields',
    soilMoisture: 'Soil Moisture',
    temperature: 'Temperature',
    rainProbability: 'Rain Probability',
    humidity: 'Humidity',
    target: 'Target',
    evapoIndex: 'Evapotranspiration index active',
    liveRadar: 'Live local weather radar',

    addField: '+ Add Field',
    saveField: 'Save Field Parcel',
    fieldName: 'Field / Parcel Name',
    cropType: 'Crop Type',
    growthStage: 'Crop Growth Stage',
    soilType: 'Soil Type',
    landAreaAcres: 'Calculated Land Area (Acres)',
    myLiveGps: '📍 My Live GPS',
    pinMySpot: 'Pin My Spot',
    satelliteLabels: '🛰️ Satellite + Labels',
    openVillageMap: '🗺️ Open Village Map',
    esriSatellite: '🌾 ESRI',
    calculatedLandArea: 'Calculated Land Area',
    searchFieldsPlaceholder: 'Search fields by name, crop, or location...',
    noFieldsFound: 'No Fields Found',
    noFieldsFoundDesc: 'You have not added any farm parcels yet. Click below to add your first parcel.',
    addNewField: '+ Add New Field',
    fieldsCount: 'Fields',
    fieldsHeaderSubtitle: 'Real-time telemetry, soil moisture profiles, and tailored crop recommendations.',
    landMappingTitle: 'Farm Land Mapping & Acreage Calculator',
    landMappingSubtitle: 'Pin farm boundary corners on high-resolution satellite imagery or use your device GPS to accurately calculate land area and perimeter.',
    saveAsNewParcel: 'Save as New Parcel',
    gpsGeodesy: 'GPS Polygon Geodesy',
    totalAcreage: 'Total Acreage',
    hectaresAndCents: 'Hectares & Cents',
    squareFootage: 'Square Footage',
    boundaryPerimeter: 'Boundary Perimeter',
    howToMapLand: 'How to Map Your Land:',
    step1Locate: '1. Locate Farm',
    step1Desc: 'Click "My Location" to auto-center via GPS, or type your village/town in the search bar.',
    step2Pins: '2. Drop Pins',
    step2Desc: 'Click on each corner/vertex of your field boundary. Drag pins anytime to adjust precise fence lines.',
    step3Save: '3. Save Field',
    step3Desc: 'The system computes acreage instantly. Click "Save as New Parcel" to assign crops and start irrigation advisory.',

    reportsTitle: 'Field Telemetry & Moisture Analytics',
    reportsSubtitle: 'Track soil moisture trajectories, sensor readings, and automated irrigation decisions.',
    exportCsv: 'Export Telemetry CSV',
    soilMoistureTrends: 'Soil Moisture Progression Trends',
    decisionDistribution: 'Decision Advisory Distribution',
    averageMoisture: 'Average Moisture',
    decisionCycles: 'Decision Cycles',
    fieldTelemetryLog: 'Field Parcels Telemetry Log',

    plantDoctorTitle: 'Crop Health & Plant Doctor',
    plantDoctorSubtitle: 'Capture or upload leaf photos from your fields for computer-vision disease diagnosis.',
    uploadPhoto: 'Upload Leaf Photo',
    takePhoto: 'Take Photo or Upload Leaf Image',
    diagnosing: 'Diagnosing Disease with Vision AI...',
    pathologyReport: 'Pathology Diagnosis Report',
    organicRemedy: 'Organic Biological Remedy',
    chemicalRemedy: 'Targeted Chemical Remedy',
    recentScanHistory: 'Recent Leaf Diagnosis History',
    clearHistory: 'Clear History',
    dropLeafPrompt: 'Drag and drop leaf image, or browse device',
    aiVisionStatus: 'Hugging Face AI Vision',

    systemSettingsTitle: 'System Settings & Status',
    systemSettingsSubtitle: 'Manage field sensitivity thresholds, language preferences, and cloud synchronization status.',
    developerKeys: '⚙️ Developer / API Keys',
    hideCredentials: 'Hide Developer Credentials',
    plantDoctorAiStatus: 'Plant Doctor AI Vision',
    hfClassifier: 'Hugging Face Optical Classifier',
    neuralLeafDesc: 'Neural network leaf diagnosis is connected and running active inferences.',
    cloudDbStatus: 'Cloud Database Storage',
    postgresSync: 'PostgreSQL Cloud Sync',
    pullFields: 'Pull DB Fields',
    pushFields: 'Push to DB',
    sensitivityThresholds: 'Decision Engine Sensitivity Thresholds',
    sensitivityDesc: 'Fine-tune the mathematical parameters that trigger IRRIGATE and WAIT decisions',
    restoreDefaults: 'Restore Defaults',
    saveConfiguration: 'Save Engine Configuration',
    lowMoistureThreshold: 'Low Moisture Threshold (%)',
    highRainProbThreshold: 'High Rain Probability (%)',
    highTempThreshold: 'High Temperature (°C)',
    defaultVal: 'Default',
    languageTitle: 'Regional Language Accessibility',
    languageSubtitle: 'Supporting local farmers with intuitive regional dialect terms',
    resetAppState: 'Reset Application State',
    resetAppSubtitle: 'Clears cached storage and reloads clean database records',
    resetAllData: 'Reset All Data',
    resetConfirmPrompt: 'Reset all fields, logs, and sensor configurations back to factory state?',
    hfTokenLabel: 'Hugging Face API Token',
    hfModelLabel: 'Target Model Repository',
    updateToken: 'Update Token',
    supabaseUrlLabel: 'Project URL',
    supabaseKeyLabel: 'Anon Public Key',
    saveAndVerify: 'Save & Verify Connection',
    testingConnection: 'Testing...',

    weatherTitle: 'Local Weather & Agro-Meteorology',
    weatherSubtitle: 'High-precision agricultural forecasting powered by Open-Meteo',
    searchVillagePlaceholder: 'Search village, town, or PIN code...',
  },

  te: {
    tagline: 'తెలివైన నిర్ణయాలు. ఆరోగ్యకరమైన పంటలు.',
    smartAgri: 'స్మార్ట్ వ్యవసాయం',
    greeting: 'నమస్కారం, రైతు సోదరా',
    subtitle: 'స్మార్ట్ నిర్ణయ మద్దతు & పోలాల పర్యవేక్షణ కేంద్రం',
    dashboard: 'డాష్‌బోర్డ్',
    myFields: 'నా పొలాలు',
    landMapping: 'భూమి మ్యాపింగ్',
    irrigation: 'నీటి పారుదల',
    cropHealth: 'పంట ఆరోగ్యం',
    weather: 'వాతావరణం',
    reports: 'నివేదికలు',
    settings: 'సెట్టింగ్‌లు',
    landingPage: 'హోమ్ పేజీ',

    dailyActionsTitle: 'రోజువారీ స్మార్ట్ వ్యవసాయ పనులు',
    dailyActionsSubtitle: 'పొలం నిర్వహణ కోసం త్వరిత సేవలు',
    landMappingAction: 'భూమి మ్యాపింగ్',
    landMappingDesc: 'పొలం సరిహద్దులు గీసి ఎకరాలను లెక్కించండి',
    advisorAction: 'నీటి సలహాదారు',
    advisorDesc: 'ఖచ్చితమైన నీటి సమయాన్ని లెక్కించండి (నిమిషాలు)',
    cropDoctorAction: 'AI పంట డాక్టర్',
    cropDoctorDesc: 'ఆకుల ఫోటోతో పంట తెగుళ్ల నిర్ధారణ',
    weatherAction: 'వాతావరణ సూచన',
    weatherDesc: '7 రోజుల వర్ష సూచన & ఎండ తీవ్రత',

    active: 'యాక్టివ్',
    live: 'లైవ్',
    gps: 'GPS',
    visionAi: 'AI విజన్',
    cloudSynced: 'క్లౌడ్ సింక్ అయింది',
    ready: 'సిద్ధం',
    healthy: 'ఆరోగ్యంగా ఉంది',
    needsIrrigation: 'నీరు అవసరం',
    monitor: 'పర్యవేక్షించండి',
    irrigateNow: 'ఇప్పుడే నీరు పెట్టండి',
    wait: 'ఆగండి / వర్ష సూచన',
    connected: 'కనెక్ట్ అయింది',
    syncing: 'సింక్ అవుతోంది...',
    saved: 'భద్రపరచబడింది!',
    details: 'వివరాలు',
    viewDetails: 'వివరాలు చూడండి →',
    delete: 'తొలగించు',
    cancel: 'రద్దు చేయి',
    search: 'వెతకండి',
    filter: 'ఫిల్టర్:',
    all: 'అన్నీ',
    allStatuses: 'అన్ని స్థితులు',
    lowLevel: 'తక్కువ స్థాయి',
    adequate: 'సరిపడా',
    highHeat: 'ఎక్కువ వేడి',
    optimal: 'అనుకూలం',
    clearSky: 'స్పష్టమైన ఆకాశం',
    rainExpected: 'వర్ష సూచన',
    monitored: 'పర్యవేక్షణలో ఉంది',
    acres: 'ఎకరాలు',
    hectares: 'హెక్టార్లు',
    cents: 'సెంట్లు',
    perimeter: 'కంచె చుట్టుకొలత',
    meters: 'మీటర్లు',
    feetAroundFence: 'అడుగుల కంచె పొడవు',

    heroDecisionTitle: 'స్మార్ట్ నీటిపారుదల సలహా',
    heroDuration: 'సిఫార్సు చేసిన సమయం',
    explainDecision: 'ఈ నిర్ణయానికి కారణం ఏమిటి?',
    logIrrigation: 'నీటి పారుదల నమోదు చేయండి',
    farmSummaryTitle: 'పొలాలు & పంట ఆరోగ్య సారాంశం',
    farmSummarySubtitle: 'భూమి తేమ మరియు వాతావరణ ఆధారిత స్మార్ట్ విశ్లేషణ',
    totalFarmArea: 'మొత్తం పొలం విస్తీర్ణం',
    healthyFields: 'ఆరోగ్యకరమైన పొలాలు',
    actionRequired: 'శ్రద్ధ అవసరం',
    activeParcels: 'పొలాలు',
    manageFields: 'పొలాల నిర్వహణ',
    localWeatherTitle: 'స్థానిక వాతావరణం',
    forecast7Day: '7 రోజుల వాతావరణం →',
    todaysDecision: 'నేటి నీటిపారుదల నిర్ణయం',
    viewRecDetails: 'సిఫార్సు వివరాలు చూడండి',
    customizeParameters: 'పారామితులను సర్దుబాటు చేయండి',
    monitoredFields: 'మీ పర్యవేక్షణలోని పొలాలు',
    monitoredFieldsDesc: 'లైవ్ సమాచారం మరియు తక్షణ సలహాల కోసం ఏదైనా పొలాన్ని ఎంచుకోండి',
    viewAllFields: 'అన్ని పొలాలు చూడండి',
    soilMoisture: 'భూమి తేమ',
    temperature: 'ఉష్ణోగ్రత',
    rainProbability: 'వర్ష సంభావ్యత',
    humidity: 'గాలి తేమ శాతం',
    target: 'లక్ష్యం',
    evapoIndex: 'బాష్పీభవన సూచిక యాక్టివ్‌గా ఉంది',
    liveRadar: 'లైవ్ స్థానిక వాతావరణ రాడార్',

    addField: '+ పొలం జోడించండి',
    saveField: 'పొలం వివరాలు భద్రపరచండి',
    fieldName: 'పొలం / మడి పేరు',
    cropType: 'పంట రకం',
    growthStage: 'పంట దశ',
    soilType: 'నేల రకం',
    landAreaAcres: 'లెక్కించిన విస్తీర్ణం (ఎకరాలు)',
    myLiveGps: '📍 నా లైవ్ GPS',
    pinMySpot: 'నా ప్రదేశం గుర్తించు',
    satelliteLabels: '🛰️ శాటిలైట్ + పేర్లు',
    openVillageMap: '🗺️ గ్రామాల మ్యాప్',
    esriSatellite: '🌾 పొలాల వీక్షణ',
    calculatedLandArea: 'లెక్కించిన భూమి వైశాల్యం',
    searchFieldsPlaceholder: 'పేరు, పంట లేదా ప్రాంతం ద్వారా వెతకండి...',
    noFieldsFound: 'పొలాలు ఏవీ కనుగొనబడలేదు',
    noFieldsFoundDesc: 'మీరు ఇంకా ఎలాంటి పొలాలను జోడించలేదు. మొదటి పొలాన్ని జోడించడానికి క్రింద క్లిక్ చేయండి.',
    addNewField: '+ కొత్త పొలం జోడించండి',
    fieldsCount: 'పొలాలు',
    fieldsHeaderSubtitle: 'లైవ్ సమాచారం, భూమి తేమ వివరాలు మరియు పంటల సిఫార్సులు.',
    landMappingTitle: 'పొలం భూమి మ్యాపింగ్ & విస్తీర్ణ కాలిక్యులేటర్',
    landMappingSubtitle: 'శాటిలైట్ మ్యాప్‌పై సరిహద్దు పాయింట్లను గుర్తించండి లేదా GPS ఉపయోగించి ఖచ్చితమైన వైశాల్యాన్ని లెక్కించండి.',
    saveAsNewParcel: 'కొత్త పొలంగా భద్రపరచండి',
    gpsGeodesy: 'GPS పాలిగాన్ గణన',
    totalAcreage: 'మొత్తం విస్తీర్ణం',
    hectaresAndCents: 'హెక్టార్లు & సెంట్లు',
    squareFootage: 'చదరపు అడుగులు',
    boundaryPerimeter: 'కంచె చుట్టుకొలత',
    howToMapLand: 'భూమిని ఎలా మ్యాప్ చేయాలి:',
    step1Locate: '1. పొలాన్ని గుర్తించండి',
    step1Desc: '"నా ప్రదేశం" క్లిక్ చేసి GPS ద్వారా లేదా మీ ఊరి పేరు సెర్చ్ చేసి గుర్తించండి.',
    step2Pins: '2. సరిహద్దు పాయింట్లు పెట్టండి',
    step2Desc: 'పొలం యొక్క నాలుగు మూలల్లో క్లిక్ చేయండి. సరిహద్దులను సర్దుబాటు చేయడానికి పాయింట్లను జరపవచ్చు.',
    step3Save: '3. పొలాన్ని భద్రపరచండి',
    step3Desc: 'వైశాల్యం తక్షణమే లెక్కించబడుతుంది. పంటను ఎంచుకుని నీటి సలహా పొందడానికి సేవ్ చేయండి.',

    reportsTitle: 'పొలం తేమ & విశ్లేషణ నివేదికలు',
    reportsSubtitle: 'పొలం తేమ మార్పులు, సెన్సార్ రీడింగ్‌లు మరియు నీటి నిర్వహణ ట్రాకింగ్.',
    exportCsv: 'CSV నివేదిక డౌన్‌లోడ్',
    soilMoistureTrends: 'భూమి తేమ మార్పుల సరళి',
    decisionDistribution: 'నిర్ణయాల విభజన',
    averageMoisture: 'సగటు తేమ శాతం',
    decisionCycles: 'నిర్ణయ చక్రాలు',
    fieldTelemetryLog: 'పొలాల తాజా సమాచారం',

    plantDoctorTitle: 'పంట ఆరోగ్యం & మొక్కల డాక్టర్',
    plantDoctorSubtitle: 'తెగుళ్లను AI ద్వారా గుర్తించడానికి పంట ఆకుల ఫోటోను అప్‌లోడ్ చేయండి.',
    uploadPhoto: 'ఆకు ఫోటో అప్‌లోడ్ చేయండి',
    takePhoto: 'ఫోటో తీయండి లేదా అప్‌లోడ్ చేయండి',
    diagnosing: 'AI తెగుళ్లను విశ్లేషిస్తోంది...',
    pathologyReport: 'పంట తెగులు నిర్ధారణ నివేదిక',
    organicRemedy: 'సేంద్రీయ / సహజ నివారణోపాయం',
    chemicalRemedy: 'రసాయన నివారణ మందులు',
    recentScanHistory: 'ఇటీవలి ఆకుల నిర్ధారణ చరిత్ర',
    clearHistory: 'చరిత్ర క్లియర్ చేయి',
    dropLeafPrompt: 'ఆకు ఫోటోను ఇక్కడ వేయండి లేదా పరికరం నుండి ఎంచుకోండి',
    aiVisionStatus: 'హగ్గింగ్ ఫేస్ AI విజన్',

    systemSettingsTitle: 'సిస్టమ్ సెట్టింగ్‌లు & స్థితి',
    systemSettingsSubtitle: 'పొలం సున్నితత్వ పరిమితులు, భాష మరియు క్లౌడ్ సింక్ నిర్వహణ.',
    developerKeys: '⚙️ డెవలపర్ / API కీలు',
    hideCredentials: 'కీల వివరాలు దాచండి',
    plantDoctorAiStatus: 'ప్లాంట్ డాక్టర్ AI విజన్',
    hfClassifier: 'హగ్గింగ్ ఫేస్ ఆప్టికల్ క్లాసిఫైయర్',
    neuralLeafDesc: 'కృత్రిమ మేధస్సు ఆకు రోగనిర్ధారణ కనెక్ట్ చేయబడింది మరియు యాక్టివ్‌గా పనిచేస్తోంది.',
    cloudDbStatus: 'క్లౌడ్ డేటాబేస్ నిల్వ',
    postgresSync: 'పోస్ట్‌గ్రే-SQL క్లౌడ్ సింక్',
    pullFields: 'క్లౌడ్ నుండి పొందండి',
    pushFields: 'క్లౌడ్‌కు పంపండి',
    sensitivityThresholds: 'నిర్ణయ ఇంజిన్ సున్నితత్వ పరిమితులు',
    sensitivityDesc: 'నీరు పెట్టాలా లేదా వేచి ఉండాలా అని నిర్ణయించే పారామితులను సర్దుబాటు చేయండి',
    restoreDefaults: 'పూర్వ స్థితికి తీసుకురండి',
    saveConfiguration: 'కాన్ఫిగరేషన్ భద్రపరచండి',
    lowMoistureThreshold: 'అల్ప తేమ పరిమితి (%)',
    highRainProbThreshold: 'అధిక వర్ష సంభావ్యత పరిమితి (%)',
    highTempThreshold: 'అధిక ఉష్ణోగ్రత పరిమితి (°C)',
    defaultVal: 'డిఫాల్ట్',
    languageTitle: 'ప్రాంతీయ భాషా ఎంపిక',
    languageSubtitle: 'రైతులకు సులభమైన ప్రాంతీయ భాషా సౌలభ్యం',
    resetAppState: 'యాప్ రీసెట్ చేయండి',
    resetAppSubtitle: 'నిల్వ చేసిన డేటాను క్లియర్ చేసి కొత్త డేటాను రీలోడ్ చేస్తుంది',
    resetAllData: 'మొత్తం డేటా క్లియర్ చేయండి',
    resetConfirmPrompt: 'అన్ని పొలాలు, లాగ్‌లు మరియు సెట్టింగ్‌లను పూర్వ స్థితికి రీసెట్ చేయాలా?',
    hfTokenLabel: 'హగ్గింగ్ ఫేస్ API టోకెన్',
    hfModelLabel: 'మోడల్ రిపోజిటరీ',
    updateToken: 'టోకెన్ నవీకరించండి',
    supabaseUrlLabel: 'ప్రాజెక్ట్ URL',
    supabaseKeyLabel: 'అనాన్ పబ్లిక్ కీ',
    saveAndVerify: 'భద్రపరిచి కనెక్షన్‌ని పరీక్షించండి',
    testingConnection: 'పరీక్షిస్తోంది...',

    weatherTitle: 'స్థానిక వాతావరణం & వ్యవసాయ సూచనలు',
    weatherSubtitle: 'ఓపెన్-మెటియో ద్వారా అధిక ఖచ్చితత్వంతో కూడిన వాతావరణ సమాచారం',
    searchVillagePlaceholder: 'గ్రామం, పట్టణం లేదా పిన్ కోడ్ వెతకండి...',
  },

  hi: {
    tagline: 'बेहतर निर्णय। स्वस्थ फसलें।',
    smartAgri: 'स्मार्ट कृषि',
    greeting: 'नमस्ते, किसान भाई',
    subtitle: 'स्मार्ट निर्णय सहायता एवं खेत टेलीमेट्री हब',
    dashboard: 'डैशबोर्ड',
    myFields: 'मेरे खेत',
    landMapping: 'भूमि मैपिंग',
    irrigation: 'सिंचाई सलाहकार',
    cropHealth: 'फसल स्वास्थ्य',
    weather: 'मौसम',
    reports: 'रिपोर्ट्स',
    settings: 'सेटिंग्स',
    landingPage: 'मुख्य पृष्ठ',

    dailyActionsTitle: 'दैनिक स्मार्ट कृषि कार्य',
    dailyActionsSubtitle: 'खेत प्रबंधन के लिए त्वरित सहायता',
    landMappingAction: 'भूमि मैपिंग',
    landMappingDesc: 'खेत की सीमाएं बनाएं और एकड़ मापें',
    advisorAction: 'सिंचाई सलाहकार',
    advisorDesc: 'सटीक सिंचाई समय (मिनट) जानें',
    cropDoctorAction: 'AI फसल डॉक्टर',
    cropDoctorDesc: 'पत्तियों की फोटो से रोग पहचान',
    weatherAction: 'मौसम पूर्वानुमान',
    weatherDesc: '7-दिवसीय वर्षा एवं तापमान सूचकांक',

    active: 'सक्रिय',
    live: 'लाइव',
    gps: 'GPS',
    visionAi: 'विज़न AI',
    cloudSynced: 'क्लाउड सिंक हुआ',
    ready: 'तैयार',
    healthy: 'स्वस्थ',
    needsIrrigation: 'सिंचाई की आवश्यकता',
    monitor: 'निगरानी रखें',
    irrigateNow: 'अभी सिंचाई करें',
    wait: 'रुकें / वर्षा की संभावना',
    connected: 'जुड़ा हुआ',
    syncing: 'सिंक हो रहा है...',
    saved: 'सहेजा गया!',
    details: 'विवरण',
    viewDetails: 'विवरण देखें →',
    delete: 'हटाएं',
    cancel: 'रद्द करें',
    search: 'खोजें',
    filter: 'फ़िल्टर:',
    all: 'सभी',
    allStatuses: 'सभी स्थितियाँ',
    lowLevel: 'कम स्तर',
    adequate: 'पर्याप्त',
    highHeat: 'अधिक गर्मी',
    optimal: 'अनुकूल',
    clearSky: 'साफ आसमान',
    rainExpected: 'वर्षा अपेक्षित',
    monitored: 'निगरानी में',
    acres: 'एकड़',
    hectares: 'हेक्टेयर',
    cents: 'सेंट',
    perimeter: 'चारदीवारी परिधि',
    meters: 'मीटर',
    feetAroundFence: 'फीट बाड़ परिधि',

    heroDecisionTitle: 'स्मार्ट सिंचाई सलाह',
    heroDuration: 'अनुशंसित समय',
    explainDecision: 'इस निर्णय का कारण?',
    logIrrigation: 'सिंचाई दर्ज करें',
    farmSummaryTitle: 'खेत एवं फसल स्वास्थ्य सारांश',
    farmSummarySubtitle: 'मृदा नमी एवं मौसम आधारित स्मार्ट विश्लेषण',
    totalFarmArea: 'कुल खेत क्षेत्रफल',
    healthyFields: 'स्वस्थ खेत',
    actionRequired: 'ध्यान आवश्यक',
    activeParcels: 'सक्रिय खेत',
    manageFields: 'खेत प्रबंधित करें',
    localWeatherTitle: 'स्थानीय मौसम',
    forecast7Day: '7-दिवसीय पूर्वानुमान →',
    todaysDecision: 'आज का सिंचाई निर्णय',
    viewRecDetails: 'सिफारिश विवरण देखें',
    customizeParameters: 'मापदंड अनुकूलित करें',
    monitoredFields: 'आपके निगरानी वाले खेत',
    monitoredFieldsDesc: 'लाइव जानकारी और त्वरित सलाह के लिए कोई भी खेत चुनें',
    viewAllFields: 'सभी खेत देखें',
    soilMoisture: 'मृदा नमी',
    temperature: 'तापमान',
    rainProbability: 'वर्षा की संभावना',
    humidity: 'हवा में नमी',
    target: 'लक्ष्य',
    evapoIndex: 'वाष्पीकरण सूचकांक सक्रिय',
    liveRadar: 'लाइव स्थानीय मौसम रडार',

    addField: '+ नया खेत जोड़ें',
    saveField: 'खेत विवरण सहेजें',
    fieldName: 'खेत का नाम',
    cropType: 'फसल का प्रकार',
    growthStage: 'फसल वृद्धि चरण',
    soilType: 'मिट्टी का प्रकार',
    landAreaAcres: 'मापा गया क्षेत्रफल (एकड़)',
    myLiveGps: '📍 मेरा लाइव GPS',
    pinMySpot: 'मेरा स्थान चुनें',
    satelliteLabels: '🛰️ सैटेलाइट + नाम',
    openVillageMap: '🗺️ ग्रामीण सड़क नक्शा',
    esriSatellite: '🌾 कृषि सैटेलाइट',
    calculatedLandArea: 'मापा गया भूमि क्षेत्रफल',
    searchFieldsPlaceholder: 'नाम, फसल या स्थान से खोजें...',
    noFieldsFound: 'कोई खेत नहीं मिला',
    noFieldsFoundDesc: 'आपने अभी तक कोई खेत नहीं जोड़ा है। पहला खेत जोड़ने के लिए नीचे क्लिक करें।',
    addNewField: '+ नया खेत जोड़ें',
    fieldsCount: 'खेत',
    fieldsHeaderSubtitle: 'लाइव टेलीमेट्री, मृदा नमी और फसल अनुशंसाएँ।',
    landMappingTitle: 'खेत भूमि मैपिंग एवं एकड़ कैलकुलेटर',
    landMappingSubtitle: 'सैटेलाइट मैप पर सीमाओं को चिह्नित करें या GPS का उपयोग करके सटीक क्षेत्रफल मापें।',
    saveAsNewParcel: 'नए खेत के रूप में सहेजें',
    gpsGeodesy: 'GPS बहुभुज गणना',
    totalAcreage: 'कुल एकड़',
    hectaresAndCents: 'हेक्टेयर और सेंट',
    squareFootage: 'वर्ग फुट',
    boundaryPerimeter: 'सीमा परिधि',
    howToMapLand: 'खेत का नक्शा कैसे बनाएं:',
    step1Locate: '1. खेत का पता लगाएं',
    step1Desc: '"मेरा स्थान" पर क्लिक करके GPS से या अपने गांव का नाम खोजें।',
    step2Pins: '2. सीमा बिंदु लगाएं',
    step2Desc: 'खेत के प्रत्येक कोने पर क्लिक करें। सटीक बाड़ रेखाओं के लिए पिन को खींचें।',
    step3Save: '3. खेत सहेजें',
    step3Desc: 'क्षेत्रफल की तुरंत गणना होती है। फसल चुनकर सिंचाई सलाह पाने के लिए सहेजें।',

    reportsTitle: 'खेत टेलीमेट्री एवं नमी विश्लेषण',
    reportsSubtitle: 'मृदा नमी, सेंसर रीडिंग एवं स्वचालित सिंचाई निर्णय की प्रगति।',
    exportCsv: 'CSV रिपोर्ट निर्यात करें',
    soilMoistureTrends: 'मृदा नमी प्रगति रुझान',
    decisionDistribution: 'निर्णय वितरण',
    averageMoisture: 'औसत नमी',
    decisionCycles: 'मूल्यांकन चक्र',
    fieldTelemetryLog: 'खेत टेलीमेट्री लॉग',

    plantDoctorTitle: 'फसल स्वास्थ्य एवं पादप डॉक्टर',
    plantDoctorSubtitle: 'रोग निदान के लिए खेत से पत्तियों की फोटो अपलोड करें।',
    uploadPhoto: 'पत्ती की फोटो अपलोड करें',
    takePhoto: 'फोटो खींचें या अपलोड करें',
    diagnosing: 'AI द्वारा रोग का विश्लेषण...',
    pathologyReport: 'रोग निदान रिपोर्ट',
    organicRemedy: 'जैविक / प्राकृतिक उपचार',
    chemicalRemedy: 'रासायनिक उपचार',
    recentScanHistory: 'हालिया पत्ती निदान इतिहास',
    clearHistory: 'इतिहास मिटाएं',
    dropLeafPrompt: 'पत्ती की तस्वीर यहाँ खींचें या डिवाइस से चुनें',
    aiVisionStatus: 'हगिंग फेस AI विज़न',

    systemSettingsTitle: 'सिस्टम सेटिंग्स एवं स्थिति',
    systemSettingsSubtitle: 'संवेदनशीलता सीमाएं, भाषा वरीयताएं और क्लाउड सिंक प्रबंधित करें।',
    developerKeys: '⚙️ डेवलपर / API कुंजियाँ',
    hideCredentials: 'कुंजी विवरण छुपाएं',
    plantDoctorAiStatus: 'प्लांट डॉक्टर AI विज़न',
    hfClassifier: 'हगिंग फेस ऑप्टिकल क्लासिफायर',
    neuralLeafDesc: 'न्यूरल नेटवर्क पत्ती निदान कनेक्टेड है और सक्रिय है।',
    cloudDbStatus: 'क्लाउड डेटाबेस स्टोरेज',
    postgresSync: 'पोस्टग्रे-SQL क्लाउड सिंक',
    pullFields: 'क्लाउड से डेटा लाएं',
    pushFields: 'क्लाउड में भेजें',
    sensitivityThresholds: 'सिंचाई निर्णय संवेदनशीलता सीमाएं',
    sensitivityDesc: 'सिंचाई या प्रतीक्षा निर्णय को ट्रिगर करने वाले मापदंडों को समायोजित करें',
    restoreDefaults: 'डिफ़ॉल्ट पुनर्स्थापित करें',
    saveConfiguration: 'कॉन्फ़िगरेशन सहेजें',
    lowMoistureThreshold: 'निम्न नमी सीमा (%)',
    highRainProbThreshold: 'उच्च वर्षा संभावना सीमा (%)',
    highTempThreshold: 'उच्च तापमान सीमा (°C)',
    defaultVal: 'डिफ़ॉल्ट',
    languageTitle: 'क्षेत्रीय भाषा चयन',
    languageSubtitle: 'भारतीय किसानों के लिए स्थानीय भाषा सहायता',
    resetAppState: 'एप्लिकेशन रीसेट करें',
    resetAppSubtitle: 'कैश किया गया डेटा मिटाकर नया डेटा लोड करता है',
    resetAllData: 'सभी डेटा मिटाएं',
    resetConfirmPrompt: 'क्या आप सभी खेत, लॉग और सेटिंग्स रीसेट करना चाहते हैं?',
    hfTokenLabel: 'हगिंग फेस API टोकन',
    hfModelLabel: 'टारगेट मॉडल रिपॉजिटरी',
    updateToken: 'टोकन अपडेट करें',
    supabaseUrlLabel: 'प्रोजेक्ट URL',
    supabaseKeyLabel: 'एनॉन पब्लिक की',
    saveAndVerify: 'सहेजें और कनेक्शन जांचें',
    testingConnection: 'जांच हो रही है...',

    weatherTitle: 'स्थानीय मौसम एवं कृषि मौसम विज्ञान',
    weatherSubtitle: 'ओपन-मेटियो द्वारा संचालित सटीक मौसम पूर्वानुमान',
    searchVillagePlaceholder: 'गांव, कस्बा या पिन कोड खोजें...',
  },

  ta: {
    tagline: 'புத்திசாலித்தனமான முடிவுகள். ஆரோக்கியமான பயிர்கள்.',
    smartAgri: 'ஸ்மார்ட் விவசாயம்',
    greeting: 'வணக்கம், விவசாய பெருமக்களே',
    subtitle: 'ஸ்மார்ட் முடிவுகள் மற்றும் வயல் கண்காணிப்பு மையம்',
    dashboard: 'டாஷ்போர்டு',
    myFields: 'என் வயல்கள்',
    landMapping: 'நில வரைபடம்',
    irrigation: 'நீர்ப்பாசனம்',
    cropHealth: 'பயிர் நலம்',
    weather: 'வானிலை',
    reports: 'அறிக்கைகள்',
    settings: 'அமைப்புகள்',
    landingPage: 'முகப்பு பக்கம்',

    dailyActionsTitle: 'தினசரி ஸ்மார்ட் விவசாய பணிகள்',
    dailyActionsSubtitle: 'பண்ணை நிர்வாகத்திற்கான விரைவான அணுகல்',
    landMappingAction: 'நில வரைபடம்',
    landMappingDesc: 'எல்லைகளைக் குறித்து ஏக்கர்களைக் கணக்கிடுங்கள்',
    advisorAction: 'பாசன ஆலோசகர்',
    advisorDesc: 'துல்லியமான பாசன நேரம் (நிமிடங்கள்)',
    cropDoctorAction: 'AI பயிர் மருத்துவர்',
    cropDoctorDesc: 'இலை புகைப்படத்தின் மூலம் நோய் கண்டறிதல்',
    weatherAction: 'வானிலை முன்னறிவிப்பு',
    weatherDesc: '7 நாள் மழை மற்றும் வெப்பநிலை அறிக்கை',

    active: 'செயலில்',
    live: 'நேரலை',
    gps: 'GPS',
    visionAi: 'விஷன் AI',
    cloudSynced: 'கிளவுட் இணைக்கப்பட்டது',
    ready: 'தயார்',
    healthy: 'ஆரோக்கியமானது',
    needsIrrigation: 'பாசனம் தேவை',
    monitor: 'கண்காணிக்கவும்',
    irrigateNow: 'இப்போதே பாசனம் செய்யவும்',
    wait: 'பொறுத்திருங்கள் / மழை வாய்ப்பு',
    connected: 'இணைக்கப்பட்டது',
    syncing: 'ஒத்திசைக்கிறது...',
    saved: 'சேமிக்கப்பட்டது!',
    details: 'விவரங்கள்',
    viewDetails: 'விவரங்களைக் காண்க →',
    delete: 'நீக்கு',
    cancel: 'ரத்து',
    search: 'தேடு',
    filter: 'வடிகட்டு:',
    all: 'அனைத்தும்',
    allStatuses: 'அனைத்து நிலைகளும்',
    lowLevel: 'குறைந்த அளவு',
    adequate: 'போதுமானது',
    highHeat: 'அதிக வெப்பம்',
    optimal: 'உகந்தது',
    clearSky: 'தெளிவான வானம்',
    rainExpected: 'மழை வாய்ப்பு',
    monitored: 'கண்காணிக்கப்படுகிறது',
    acres: 'ஏக்கர்',
    hectares: 'ஹெக்டேர்',
    cents: 'சென்ட்',
    perimeter: 'வேலி சுற்றளவு',
    meters: 'மீட்டர்கள்',
    feetAroundFence: 'அடி வேலி சுற்றளவு',

    heroDecisionTitle: 'ஸ்மார்ட் பாசன ஆலோசனை',
    heroDuration: 'பரிந்துரைக்கப்பட்ட நேரம்',
    explainDecision: 'இந்த முடிவின் காரணம்?',
    logIrrigation: 'பாசனத்தைப் பதிவுசெய்',
    farmSummaryTitle: 'பண்ணை மற்றும் பயிர் நல சுருக்கம்',
    farmSummarySubtitle: 'மண் ஈரப்பதம் மற்றும் வானிலை சார்ந்த ஸ்மார்ட் பகுப்பாய்வு',
    totalFarmArea: 'மொத்த பண்ணை பரப்பளவு',
    healthyFields: 'ஆரோக்கியமான வயல்கள்',
    actionRequired: 'கவனம் தேவை',
    activeParcels: 'செயலில் உள்ள வயல்கள்',
    manageFields: 'வயல்களை நிர்வகிக்கவும்',
    localWeatherTitle: 'உள்ளூர் வானிலை',
    forecast7Day: '7 நாள் முன்னறிவிப்பு →',
    todaysDecision: 'இன்றைய பாசன முடிவு',
    viewRecDetails: 'பரிந்துரை விவரங்களைக் காண்க',
    customizeParameters: 'அளவுருக்களை மாற்று',
    monitoredFields: 'உங்கள் கண்காணிக்கப்படும் வயல்கள்',
    monitoredFieldsDesc: 'நேரலை தகவல் மற்றும் உடனடி ஆலோசனையைப் பெற ஏதேனும் ஒரு வயலைத் தேர்ந்தெடுக்கவும்',
    viewAllFields: 'அனைத்து வயல்களையும் காண்க',
    soilMoisture: 'மண் ஈரப்பதம்',
    temperature: 'வெப்பநிலை',
    rainProbability: 'மழை வாய்ப்பு',
    humidity: 'ஈரப்பதம்',
    target: 'இலக்கு',
    evapoIndex: 'ஆவியாதல் குறியீடு செயலில் உள்ளது',
    liveRadar: 'நேரலை வானிலை ரேடார்',

    addField: '+ வயலைச் சேர்க்கவும்',
    saveField: 'வயல் விவரங்களைச் சேமி',
    fieldName: 'வயலின் பெயர்',
    cropType: 'பயிர் வகை',
    growthStage: 'பயிர் வளர்ச்சி நிலை',
    soilType: 'மண் வகை',
    landAreaAcres: 'கணக்கிடப்பட்ட பரப்பளவு (ஏக்கர்)',
    myLiveGps: '📍 என் நேரலை GPS',
    pinMySpot: 'என் இடத்தை குறிக்கவும்',
    satelliteLabels: '🛰️ செயற்கைக்கோள் + பெயர்கள்',
    openVillageMap: '🗺️ கிராம வரைபடம்',
    esriSatellite: '🌾 வயல் செயற்கைக்கோள்',
    calculatedLandArea: 'கணக்கிடப்பட்ட நிலப்பரப்பு',
    searchFieldsPlaceholder: 'பெயர், பயிர் அல்லது இருப்பிடம் மூலம் தேடுங்கள்...',
    noFieldsFound: 'வயல்கள் எதுவும் கிடைக்கவில்லை',
    noFieldsFoundDesc: 'நீங்கள் இதுவரை எந்த வயலையும் சேர்க்கவில்லை. உங்கள் முதல் வயலைச் சேர்க்க கீழே கிளிக் செய்யவும்.',
    addNewField: '+ புதிய வயலைச் சேர்க்கவும்',
    fieldsCount: 'வயல்கள்',
    fieldsHeaderSubtitle: 'நேரலை தகவல், மண் ஈரப்பதம் மற்றும் பயிர் பரிந்துரைகள்.',
    landMappingTitle: 'பண்ணை நில வரைபடம் & பரப்பளவு கால்குலேட்டர்',
    landMappingSubtitle: 'செயற்கைக்கோள் வரைபடத்தில் எல்லைகளைக் குறிக்கவும் அல்லது GPS ஐப் பயன்படுத்தி பரப்பளவைக் கணக்கிடவும்.',
    saveAsNewParcel: 'புதிய வயலாகச் சேமிக்கவும்',
    gpsGeodesy: 'GPS பலகோண கணக்கீடு',
    totalAcreage: 'மொத்த ஏக்கர்',
    hectaresAndCents: 'ஹெக்டேர் மற்றும் சென்ட்',
    squareFootage: 'சதுர அடி',
    boundaryPerimeter: 'வேலி சுற்றளவு',
    howToMapLand: 'நிலத்தை எவ்வாறு வரைபடமாக்குவது:',
    step1Locate: '1. பண்ணையைக் கண்டறியவும்',
    step1Desc: '"என் இருப்பிடம்" என்பதைக் கிளிக் செய்து GPS மூலம் அல்லது உங்கள் கிராமப் பெயரைத் தேடவும்.',
    step2Pins: '2. எல்லைப் புள்ளிகளைக் குறிக்கவும்',
    step2Desc: 'வயலின் ஒவ்வொரு மூலையிலும் கிளிக் செய்யவும். எல்லைகளை மாற்ற புள்ளிகளை நகர்த்தலாம்.',
    step3Save: '3. வயலைச் சேமிக்கவும்',
    step3Desc: 'பரப்பளவு உடனடியாகக் கணக்கிடப்படுகிறது. பயிரைத் தேர்வுசெய்து பாசன ஆலோசனை பெற சேமிக்கவும்.',

    reportsTitle: 'வயல் ஈரப்பதம் மற்றும் பகுப்பாய்வு',
    reportsSubtitle: 'மண் ஈரப்பதம், சென்சார் அளவீடுகள் மற்றும் பாசன முடிவுகளைக் கண்காணிக்கவும்.',
    exportCsv: 'CSV பதிவிறக்கம்',
    soilMoistureTrends: 'மண் ஈரப்பதப் போக்குகள்',
    decisionDistribution: 'முடிவுகள் பகிர்வு',
    averageMoisture: 'சராசரி ஈரப்பதம்',
    decisionCycles: 'மதிப்பீட்டு சுழற்சிகள்',
    fieldTelemetryLog: 'வயல் நேரடி தகவல்',

    plantDoctorTitle: 'பயிர் நலம் & தாவர மருத்துவர்',
    plantDoctorSubtitle: 'நோய் கண்டறிய பயிர் இலைகளின் புகைப்படத்தைப் பதிவேற்றவும்.',
    uploadPhoto: 'இலை புகைப்படத்தைப் பதிவேற்றவும்',
    takePhoto: 'புகைப்படம் எடுக்கவும் / பதிவேற்றவும்',
    diagnosing: 'AI நோயை ஆராய்கிறது...',
    pathologyReport: 'நோய் கண்டறிதல் அறிக்கை',
    organicRemedy: 'இயற்கை / உயிரியல் தீர்வு',
    chemicalRemedy: 'இரசாயன தீர்வு',
    recentScanHistory: 'சமீபத்திய இலை நோய் வரலாறு',
    clearHistory: 'வரலாற்றை அழி',
    dropLeafPrompt: 'இலை புகைப்படத்தை இங்கே பதிவேற்றவும் அல்லது தேர்ந்தெடுக்கவும்',
    aiVisionStatus: 'ஹக்கிங் ஃபேஸ் AI விஷன்',

    systemSettingsTitle: 'அமைப்பு அமைப்புகள் & நிலை',
    systemSettingsSubtitle: 'உணர்திறன் வரம்புகள், மொழி மற்றும் கிளவுட் ஒத்திசைவை நிர்வகிக்கவும்.',
    developerKeys: '⚙️ டெவலப்பர் / API விசைகள்',
    hideCredentials: 'விசை விவரங்களை மறைக்கவும்',
    plantDoctorAiStatus: 'தாவர மருத்துவர் AI விஷன்',
    hfClassifier: 'ஹக்கிங் ஃபேஸ் ஆப்டிகல் வகைப்படுத்தி',
    neuralLeafDesc: 'நியூரல் நெட்வொர்க் இலை நோய் கண்டறிதல் இணைக்கப்பட்டு செயலில் உள்ளது.',
    cloudDbStatus: 'கிளவுட் தரவுத்தளம்',
    postgresSync: 'PostgreSQL கிளவுட் ஒத்திசைவு',
    pullFields: 'கிளவுடில் இருந்து பெறவும்',
    pushFields: 'கிளவுடில் சேமிக்கவும்',
    sensitivityThresholds: 'பாசன முடிவெடுக்கும் உணர்திறன் வரம்புகள்',
    sensitivityDesc: 'பாசனம் செய்ய வேண்டுமா அல்லது காத்திருக்க வேண்டுமா என்பதைத் தீர்மானிக்கும் அளவுருக்களை மாற்றவும்',
    restoreDefaults: 'இயல்புநிலையை மீட்டமைக்கவும்',
    saveConfiguration: 'அமைப்புகளைச் சேமிக்கவும்',
    lowMoistureThreshold: 'குறைந்த ஈரப்பத வரம்பு (%)',
    highRainProbThreshold: 'அதிக மழை வாய்ப்பு வரம்பு (%)',
    highTempThreshold: 'அதிக வெப்பநிலை வரம்பு (°C)',
    defaultVal: 'இயல்புநிலை',
    languageTitle: 'பிராந்திய மொழி தேர்வு',
    languageSubtitle: 'விவசாயிகளுக்கான உள்ளூர் மொழி ஆதரவு',
    resetAppState: 'பயன்பாட்டை மீட்டமைக்கவும்',
    resetAppSubtitle: 'சேமிக்கப்பட்ட தரவை அழித்து புதிய தரவை ஏற்றுகிறது',
    resetAllData: 'அனைத்து தரவையும் அழிக்கவும்',
    resetConfirmPrompt: 'அனைத்து வயல்கள், பதிவுகள் மற்றும் அமைப்புகளை மீட்டமைக்க வேண்டுமா?',
    hfTokenLabel: 'ஹக்கிங் ஃபேஸ் API டோக்கன்',
    hfModelLabel: 'மாதிரி களஞ்சியம்',
    updateToken: 'டோக்கனைப் புதுப்பிக்கவும்',
    supabaseUrlLabel: 'திட்ட URL',
    supabaseKeyLabel: 'பொது விசை',
    saveAndVerify: 'சேமித்து இணைப்பைச் சரிபார்க்கவும்',
    testingConnection: 'சோதிக்கிறது...',

    weatherTitle: 'உள்ளூர் வானிலை & வேளாண் வானிலை',
    weatherSubtitle: 'துல்லியமான வேளாண் வானிலை முன்னறிவிப்பு',
    searchVillagePlaceholder: 'கிராமம், நகரம் அல்லது அஞ்சல் குறியீட்டைத் தேடுங்கள்...',
  }
};
