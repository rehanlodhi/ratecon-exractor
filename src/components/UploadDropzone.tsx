import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { SAMPLE_RATE_CONFIRMATIONS, SampleDocument } from '../data/sampleRateCons';

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  onSelectSample: (sample: SampleDocument) => void;
  isLoading: boolean;
  errorMessage: string | null;
  selectedFileName?: string | null;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  onFileSelect,
  onSelectSample,
  isLoading,
  errorMessage,
  selectedFileName,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndProcess(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndProcess(file);
    }
  };

  const validateAndProcess = (file: File) => {
    onFileSelect(file);
  };

  return (
    <div className="w-full">
      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-blue-500 bg-blue-50/70 shadow-inner'
            : 'border-slate-300 bg-white hover:border-slate-400 shadow-sm'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf,image/png,image/jpeg"
          onChange={handleInputChange}
          className="hidden"
          id="pdf-upload-input"
        />

        <div className="max-w-md mx-auto flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 mb-1">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h3 className="text-lg font-semibold text-slate-900">
            Upload Rate Confirmation PDF
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Drag and drop your logistics rate confirmation or load tender PDF here, or click to browse from your device.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium text-sm rounded-lg transition-colors shadow-sm inline-flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Browse PDF File</span>
            </button>
          </div>

          {selectedFileName && (
            <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-100 px-3 py-1.5 rounded-md max-w-full truncate">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">Selected: {selectedFileName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Loading state indicator */}
      {isLoading && (
        <div className="mt-6 p-6 bg-blue-50/60 border border-blue-200/80 rounded-xl flex flex-col items-center text-center gap-3 animate-fade-in">
          <div className="flex items-center gap-3 text-blue-700 font-semibold text-base">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span>Gemini 3.8 Flash is analyzing Rate Confirmation...</span>
          </div>
          <p className="text-xs text-slate-600 max-w-md">
            Extracting load identification, broker and carrier contacts, linehaul rates, stop itinerary, and special instructions.
          </p>
        </div>
      )}

      {/* Error notification */}
      {errorMessage && (
        <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-rose-900">Extraction Error</p>
            <p className="text-rose-700 mt-0.5 text-xs sm:text-sm">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Pre-Loaded Sample Loads Bar */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Or test immediately with real sample freight loads</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SAMPLE_RATE_CONFIRMATIONS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className="text-left p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
                  <span className="font-semibold text-blue-600">{sample.brokerLogoText}</span>
                  <span className="font-mono text-slate-700 font-bold">{sample.rateSummary}</span>
                </div>
                <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {sample.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                  {sample.routeSummary} · {sample.equipmentSummary}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-medium">
                <span>Load Sample</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
