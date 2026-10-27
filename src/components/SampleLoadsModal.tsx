import React from 'react';
import { X, ArrowRight, Truck, FileText, CheckCircle2 } from 'lucide-react';
import { SAMPLE_RATE_CONFIRMATIONS, SampleDocument } from '../data/sampleRateCons';

interface SampleLoadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (sample: SampleDocument) => void;
  currentSelectedId?: string;
}

export const SampleLoadsModal: React.FC<SampleLoadsModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentSelectedId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Sample Logistics Rate Confirmations
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any pre-configured industry rate confirmation to test data extraction
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          {SAMPLE_RATE_CONFIRMATIONS.map((sample) => {
            const isSelected = sample.id === currentSelectedId;
            return (
              <div
                key={sample.id}
                className={`p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
                      <span>{sample.brokerLogoText} Broker</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-slate-700">{sample.rateSummary}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 mb-1">
                      {sample.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {sample.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono">
                      <span className="bg-slate-100 px-2 py-0.5 rounded">
                        {sample.routeSummary}
                      </span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded">
                        {sample.equipmentSummary}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onSelect(sample);
                      onClose();
                    }}
                    className={`shrink-0 px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Loaded</span>
                      </>
                    ) : (
                      <>
                        <span>Select Load</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
