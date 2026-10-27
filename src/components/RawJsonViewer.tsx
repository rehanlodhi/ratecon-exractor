import React, { useState } from 'react';
import { Copy, Check, Download, FileCode } from 'lucide-react';
import { RateConfirmation } from '../types/rate-con';

interface RawJsonViewerProps {
  data: RateConfirmation;
}

export const RawJsonViewer: React.FC<RawJsonViewerProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RateCon_${data.load_number || 'raw'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700/80">
        <div className="flex items-center gap-2 text-slate-300 text-xs font-mono">
          <FileCode className="w-4 h-4 text-blue-400" />
          <span>Extracted Schema Output (RateConfirmation JSON)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy JSON</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Download</span>
          </button>
        </div>
      </div>

      <div className="p-6 overflow-x-auto max-h-[600px] text-xs font-mono text-emerald-300 leading-relaxed">
        <pre>{jsonString}</pre>
      </div>
    </div>
  );
};
