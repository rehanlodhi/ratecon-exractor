import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { UploadDropzone } from './components/UploadDropzone';
import { RateConViewer } from './components/RateConViewer';
import { RawJsonViewer } from './components/RawJsonViewer';
import { SampleLoadsModal } from './components/SampleLoadsModal';
import { RateConfirmation } from './types/rate-con';
import { SAMPLE_RATE_CONFIRMATIONS, SampleDocument } from './data/sampleRateCons';
import { sanitizeRateCon } from './utils/rate-con-helpers';
import { Sparkles, FileText, History, ArrowRight } from 'lucide-react';

export default function App() {
  // Initialize with the first sample so the user immediately sees a rich populated state
  const defaultSample = SAMPLE_RATE_CONFIRMATIONS[0];
  const [currentRateCon, setCurrentRateCon] = useState<RateConfirmation>(defaultSample.data);
  const [currentRawText, setCurrentRawText] = useState<string | undefined>(defaultSample.rawDocumentText);
  const [activeTab, setActiveTab] = useState<'viewer' | 'samples' | 'raw'>('viewer');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(defaultSample.data.fileName || null);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  
  // History of analyzed loads
  const [recentLoads, setRecentLoads] = useState<RateConfirmation[]>([
    defaultSample.data,
  ]);

  const dropzoneRef = useRef<HTMLDivElement>(null);

  // Scroll to upload area when user clicks Upload in Navbar
  const handleNavbarUploadClick = () => {
    setActiveTab('viewer');
    dropzoneRef.current?.scrollIntoView({ behavior: 'smooth' });
    const input = document.getElementById('pdf-upload-input') as HTMLInputElement;
    if (input) input.click();
  };

  const handleSelectSample = (sample: SampleDocument) => {
    setErrorMessage(null);
    setCurrentRateCon(sample.data);
    setCurrentRawText(sample.rawDocumentText);
    setSelectedFileName(sample.data.fileName || sample.title);
    setActiveTab('viewer');

    // Add to recent if not present
    setRecentLoads((prev) => {
      const exists = prev.some((l) => l.load_number === sample.data.load_number);
      if (exists) return prev;
      return [sample.data, ...prev.slice(0, 4)];
    });
  };

  const handleFileUpload = async (file: File) => {
    setSelectedFileName(file.name);
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Convert file to base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const res = reader.result as string;
          // Strip data:...;base64, prefix if present
          const base64 = res.includes(',') ? res.split(',')[1] : res;
          resolve(base64);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });

      // Send to Express backend with Gemini 3.8 Flash
      const response = await fetch('/api/extract-rate-con', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          base64Data,
          mimeType: file.type || 'application/pdf',
          fileName: file.name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server extraction failed with status ${response.status}`);
      }

      const extractedResult = await response.json();
      const sanitized = sanitizeRateCon({
        ...extractedResult,
        fileName: file.name,
        extractedAt: new Date().toISOString(),
      });

      setCurrentRateCon(sanitized);
      setCurrentRawText(undefined);
      setActiveTab('viewer');

      // Add to recent
      setRecentLoads((prev) => [sanitized, ...prev.filter((l) => l.load_number !== sanitized.load_number).slice(0, 4)]);
    } catch (err: any) {
      console.error('File extraction failed:', err);
      setErrorMessage(
        err.message || 'Unable to analyze rate confirmation. Please ensure the file is a readable PDF or document image.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateData = (updated: RateConfirmation) => {
    setCurrentRateCon(updated);
    setRecentLoads((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        onUploadClick={handleNavbarUploadClick}
        onSelectSample={() => setIsSampleModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasExtractedData={Boolean(currentRateCon)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Logistics Document Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Rate Confirmation AI Extractor
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Instantly parse freight rate confirmations, carrier load tenders, and BOL sheets into structured TMS data. Extracts load IDs, broker contacts, equipment, total compensation, and multi-stop itineraries.
          </p>
        </div>

        {/* Upload Dropzone Container */}
        <div ref={dropzoneRef} className="max-w-4xl mx-auto">
          <UploadDropzone
            onFileSelect={handleFileUpload}
            onSelectSample={handleSelectSample}
            isLoading={isLoading}
            errorMessage={errorMessage}
            selectedFileName={selectedFileName}
          />
        </div>

        {/* Recent Extractions Bar */}
        {recentLoads.length > 1 && (
          <div className="max-w-5xl mx-auto flex flex-wrap items-center gap-2 pt-2 pb-1 border-b border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mr-2">
              <History className="w-3.5 h-3.5" />
              <span>Loaded Profiles:</span>
            </div>
            {recentLoads.map((load) => {
              const isCurrent = load.load_number === currentRateCon?.load_number;
              return (
                <button
                  key={load.id || load.load_number}
                  onClick={() => {
                    setCurrentRateCon(load);
                    setSelectedFileName(load.fileName || load.load_number);
                    setActiveTab('viewer');
                  }}
                  className={`text-xs px-3 py-1 rounded-md font-mono transition-colors ${
                    isCurrent
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Load #{load.load_number}
                </button>
              );
            })}
          </div>
        )}

        {/* Main Presentation View */}
        <div className="max-w-5xl mx-auto">
          {activeTab === 'viewer' && currentRateCon && (
            <RateConViewer
              data={currentRateCon}
              onUpdateData={handleUpdateData}
              rawText={currentRawText}
            />
          )}

          {activeTab === 'raw' && currentRateCon && (
            <RawJsonViewer data={currentRateCon} />
          )}

          {activeTab === 'samples' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Available Demo Logistics Files
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SAMPLE_RATE_CONFIRMATIONS.map((sample) => (
                  <div
                    key={sample.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-blue-600 uppercase">
                        {sample.brokerLogoText}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">{sample.title}</h4>
                      <p className="text-xs text-slate-600 mt-1">{sample.description}</p>
                    </div>
                    <button
                      onClick={() => handleSelectSample(sample)}
                      className="mt-4 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center justify-between"
                    >
                      <span>Load Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 LoadDoc. Production Freight Extraction Engine powered by Gemini 3.8 Flash.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Server-side Secure GenAI</span>
            <span>·</span>
            <span>Structured JSON Schema</span>
          </div>
        </div>
      </footer>

      {/* Sample Loads Modal */}
      <SampleLoadsModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        onSelect={handleSelectSample}
        currentSelectedId={currentRateCon?.id}
      />
    </div>
  );
}
