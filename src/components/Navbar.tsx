import React from 'react';
import { FileSpreadsheet, FileUp } from 'lucide-react';

interface NavbarProps {
  onUploadClick: () => void;
  onSelectSample: () => void;
  activeTab: 'viewer' | 'samples' | 'raw';
  setActiveTab: (tab: 'viewer' | 'samples' | 'raw') => void;
  hasExtractedData: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onUploadClick,
  onSelectSample,
  activeTab,
  setActiveTab,
  hasExtractedData,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header Bar */}
        <div className="h-14 sm:h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
              LoadDoc
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-100/80 hidden md:inline-block">
              Gemini 3.8 Flash
            </span>
          </div>

          {/* Zone 2: Desktop Navigation Links */}
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('viewer')}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'viewer' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'hover:text-slate-900'
              }`}
            >
              Extraction Results
            </button>
            <button
              onClick={() => {
                setActiveTab('samples');
                onSelectSample();
              }}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'samples' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'hover:text-slate-900'
              }`}
            >
              Sample Loads
            </button>
            {hasExtractedData && (
              <button
                onClick={() => setActiveTab('raw')}
                className={`whitespace-nowrap transition-colors py-1 ${
                  activeTab === 'raw' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'hover:text-slate-900'
                }`}
              >
                Raw JSON
              </button>
            )}
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onUploadClick}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
            >
              <FileUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Upload PDF</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab Strip (Only on small screens <640px) */}
        <div className="sm:hidden flex items-center justify-around border-t border-slate-100 py-2 text-xs font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('viewer')}
            className={`px-2 py-1 rounded-md transition-colors ${
              activeTab === 'viewer' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:text-slate-900'
            }`}
          >
            Results
          </button>
          <button
            onClick={() => {
              setActiveTab('samples');
              onSelectSample();
            }}
            className={`px-2 py-1 rounded-md transition-colors ${
              activeTab === 'samples' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:text-slate-900'
            }`}
          >
            Sample Loads
          </button>
          {hasExtractedData && (
            <button
              onClick={() => setActiveTab('raw')}
              className={`px-2 py-1 rounded-md transition-colors ${
                activeTab === 'raw' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:text-slate-900'
              }`}
            >
              Raw JSON
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
