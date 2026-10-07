import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  RefreshCw, 
  Camera, 
  Check, 
  Leaf, 
  BrainCircuit, 
  History, 
  Trash2, 
  HelpCircle, 
  FileImage,
  Zap,
  Sliders,
  ChevronDown
} from 'lucide-react';
import { 
  analyzeCropWithHuggingFace, 
  HuggingFaceDiagnosisResult, 
  getHuggingFaceConfig
} from '../services/huggingfaceService';
import { StorageService, subscribeToStorage } from '../services/storageService';
import { CropScanResult, Field } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

export const CropHealthView: React.FC = () => {
  const { t } = useLanguage();
  const [hfConfig, setHfConfig] = useState(getHuggingFaceConfig());
  const [fields, setFields] = useState<Field[]>(StorageService.getFields());

  const [selectedFieldId, setSelectedFieldId] = useState<string>(fields[0]?.id || '');
  const [isScanning, setIsScanning] = useState(false);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [diagnosis, setDiagnosis] = useState<HuggingFaceDiagnosisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<CropScanResult[]>(StorageService.getScans());

  useEffect(() => {
    const unsub = subscribeToStorage(() => {
      const updatedFields = StorageService.getFields();
      setFields(updatedFields);
      if (!selectedFieldId && updatedFields.length > 0) {
        setSelectedFieldId(updatedFields[0].id);
      }
      setScanHistory(StorageService.getScans());
    });
    return unsub;
  }, [selectedFieldId]);

  const activeSelectedField = fields.find(f => f.id === selectedFieldId) || fields[0] || null;

  const runInferenceOnImage = async (imgSource: Blob | string) => {
    setIsScanning(true);
    setErrorMessage(null);
    try {
      const targetCrop = activeSelectedField ? activeSelectedField.crop : 'Paddy (Rice)';
      const result = await analyzeCropWithHuggingFace(imgSource, targetCrop);
      setDiagnosis(result);

      // Save real user scan into history
      StorageService.addScan({
        fieldId: activeSelectedField?.id,
        fieldName: activeSelectedField?.name || 'My Farm Parcel',
        cropName: activeSelectedField?.crop || result.cropName,
        imageUrl: typeof imgSource === 'string' ? imgSource : (uploadedImagePreview || ''),
        status: result.isHealthy ? 'Healthy Crop' : result.diseaseName,
        confidencePercent: result.confidencePercent,
        symptoms: result.symptoms,
        recommendations: result.recommendations,
        organicRemedy: result.organicRemedy,
        urgency: result.urgency,
        isSimulatedDemo: false,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Vision classification failed. Please upload a clear leaf image.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setUploadedImagePreview(url);
      runInferenceOnImage(file);
    };
    reader.readAsDataURL(file);
  };

  const handleClearHistory = () => {
    localStorage.removeItem('cropcare_scans_v1');
    setScanHistory([]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('plantDoctorTitle')}
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>High-End AI Vision</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('plantDoctorSubtitle')}
          </p>
        </div>

        {/* High-End Hugging Face AI Model Badge */}
        <div className="flex items-center gap-2">
          <div className="p-2.5 px-4 rounded-2xl bg-white border border-emerald-200 text-xs text-slate-700 flex items-center gap-2.5 shadow-sm">
            <BrainCircuit className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Hugging Face AI Model</span>
              <span className="font-extrabold text-emerald-800 text-xs sm:text-sm">
                ViT-Base Plant Disease Transformer
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
              98% Accuracy
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Upload Controls & History */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Field Linking Selector */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Target Crop & Field Parcel
            </label>
            <select
              value={selectedFieldId}
              onChange={(e) => setSelectedFieldId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold outline-none bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-200 cursor-pointer"
            >
              {fields.length === 0 ? (
                <option value="">Paddy (Rice) — General Crop</option>
              ) : (
                fields.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.crop} - {f.areaAcres} ac)
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Upload Dropzone */}
          <div 
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileUpload(e.dataTransfer.files[0]);
              }
            }}
            className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all bg-white relative overflow-hidden ${
              dragOver 
                ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]' 
                : 'border-slate-200 hover:border-emerald-400'
            }`}
          >
            <input
              type="file"
              id="crop-photo-input"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />

            <label htmlFor="crop-photo-input" className="cursor-pointer block space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                <Camera className="w-8 h-8 stroke-[2.2]" />
              </div>

              <div>
                <p className="text-base font-bold text-slate-900">
                  {t('takePhoto')}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {t('dropLeafPrompt')}
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-colors">
                <Upload className="w-4 h-4" />
                <span>{t('uploadPhoto')}</span>
              </div>
            </label>
          </div>

          {/* User's Real Scan History */}
          {scanHistory.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-4 h-4 text-emerald-600" />
                  <span>{t('recentScanHistory')} ({scanHistory.length})</span>
                </h4>
                <button
                  onClick={handleClearHistory}
                  className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{t('clearHistory')}</span>
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {scanHistory.map((scan) => (
                  <div
                    key={scan.id}
                    onClick={() => {
                      if (scan.imageUrl) setUploadedImagePreview(scan.imageUrl);
                    }}
                    className="p-2.5 rounded-2xl border border-slate-100 hover:border-emerald-300 bg-slate-50/70 hover:bg-white transition-all cursor-pointer flex items-center gap-3"
                  >
                    {scan.imageUrl ? (
                      <img
                        src={scan.imageUrl}
                        alt={scan.cropName}
                        className="w-11 h-11 rounded-xl object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-slate-200 flex items-center justify-center shrink-0">
                        <FileImage className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                    <div className="overflow-hidden flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{scan.status}</p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {scan.cropName} • {new Date(scan.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                      {scan.confidencePercent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Photography tips */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>Tips for accurate AI diagnosis:</span>
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-500">
              <li>Capture the affected leaf in good natural daylight.</li>
              <li>Keep the camera 10–20 cm away and focus clearly on spots or lesions.</li>
              <li>Ensure the correct crop parcel is selected above for tailored pathology.</li>
            </ul>
          </div>

        </div>

        {/* Right Column: Diagnostic Report & Predictions */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between min-h-[500px]">
          
          <div className="space-y-6">
            
            {/* Top Analysis Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{t('pathologyReport')}</h3>
                <p className="text-xs text-slate-500">
                  {diagnosis ? diagnosis.modelUsed : 'High-End Multimodal Vision Evaluation'}
                </p>
              </div>

              {diagnosis && (
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  diagnosis.isHealthy 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {diagnosis.isHealthy ? 'Healthy Foliage' : 'Pathogen Detected'}
                </span>
              )}
            </div>

            {/* If no image has been uploaded yet */}
            {!uploadedImagePreview && !isScanning && (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Leaf className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">No Leaf Image Uploaded Yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Upload or snap a leaf photo from the left panel to trigger the High-End Vision AI model.
                  </p>
                </div>
              </div>
            )}

            {/* Image Preview with Scanner Laser */}
            {uploadedImagePreview && (
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 h-64 sm:h-72 flex items-center justify-center border border-slate-200">
                <img
                  src={uploadedImagePreview}
                  alt="Analyzed crop sample"
                  className="w-full h-full object-contain"
                />

                {/* Scanning Laser Animation */}
                {isScanning ? (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
                    <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mb-2" />
                    <p className="text-sm font-bold tracking-wide">{t('diagnosing')}</p>
                    <p className="text-xs text-emerald-200">Evaluating foliar lesions and crop pathogen profile</p>
                  </div>
                ) : (
                  diagnosis && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5">
                      <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{diagnosis.cropName}</span>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Error banner if any */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs">
                {errorMessage}
              </div>
            )}

            {/* Diagnostic Result Card */}
            {diagnosis && !isScanning && (
              <>
                <div className={`p-5 rounded-2xl border flex items-start justify-between gap-4 ${
                  diagnosis.isHealthy 
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
                    : 'bg-amber-50/70 border-amber-200 text-amber-950'
                }`}>
                  <div className="flex items-start gap-3.5">
                    <div className={`p-3 rounded-2xl shadow-sm ${
                      diagnosis.isHealthy ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                    }`}>
                      {diagnosis.isHealthy ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                        Verified Pathology Diagnosis
                      </span>
                      <h4 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                        {diagnosis.diseaseName}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Model Confidence: <strong className="text-emerald-700">{diagnosis.confidencePercent}%</strong> • Crop: <strong>{diagnosis.cropName}</strong>
                      </p>
                    </div>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${
                    diagnosis.urgency === 'High' 
                      ? 'bg-rose-100 text-rose-800' 
                      : diagnosis.urgency === 'Medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {diagnosis.urgency} Urgency
                  </span>
                </div>

                {/* Top Model Predictions Probability Bars */}
                {diagnosis.allPredictions && diagnosis.allPredictions.length > 0 && (
                  <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      AI Model Predictions Breakdown:
                    </span>
                    <div className="space-y-2">
                      {diagnosis.allPredictions.map((pred, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-xs text-slate-700 font-semibold">
                            <span className="truncate max-w-[280px]">{pred.label}</span>
                            <span className="font-bold text-slate-900">{pred.percentage}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${i === 0 ? 'bg-emerald-600' : 'bg-slate-400'}`}
                              style={{ width: `${pred.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Treatments: Organic vs Chemical */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 space-y-1.5">
                    <p className="font-extrabold text-emerald-950 flex items-center gap-1.5 text-sm">
                      <Leaf className="w-4 h-4 text-emerald-700" />
                      {t('organicRemedy')}
                    </p>
                    <p className="text-emerald-900 leading-relaxed text-xs">
                      {diagnosis.organicRemedy}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50/90 border border-blue-200 space-y-1.5">
                    <p className="font-extrabold text-blue-950 flex items-center gap-1.5 text-sm">
                      <ShieldCheck className="w-4 h-4 text-blue-700" />
                      {t('chemicalRemedy')}
                    </p>
                    <p className="text-blue-900 leading-relaxed text-xs">
                      {diagnosis.chemicalRemedy}
                    </p>
                  </div>
                </div>

                {/* Agronomic Recommendations */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Pathologist Action Steps:
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {diagnosis.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
