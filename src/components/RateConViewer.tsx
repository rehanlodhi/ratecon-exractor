import React, { useState } from 'react';
import { 
  Building2, 
  Truck, 
  MapPin, 
  Calendar, 
  Clock, 
  Copy, 
  Check, 
  Download, 
  FileSpreadsheet, 
  ShieldAlert, 
  DollarSign, 
  Scale, 
  Edit3, 
  Save, 
  X,
  ExternalLink,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { RateConfirmation, Stop } from '../types/rate-con';
import { formatCurrency, convertRateConToCSV, getStopCounts } from '../utils/rate-con-helpers';

interface RateConViewerProps {
  data: RateConfirmation;
  onUpdateData: (updated: RateConfirmation) => void;
  rawText?: string;
}

export const RateConViewer: React.FC<RateConViewerProps> = ({
  data,
  onUpdateData,
  rawText,
}) => {
  const [copiedJson, setCopiedJson] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<RateConfirmation>(data);
  const [showRawText, setShowRawText] = useState(false);

  // Sync edit form data if prop changes
  React.useEffect(() => {
    setEditFormData(data);
  }, [data]);

  const stopCounts = getStopCounts(data.stops);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RateCon_${data.load_number || 'export'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCsv = () => {
    const csvContent = convertRateConToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RateCon_${data.load_number || 'export'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateData(editFormData);
    setIsEditing(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
              <span>Rate Confirmation</span>
              <span aria-hidden="true">·</span>
              <span>{data.fileName || 'Document'}</span>
              {data.extractedAt && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-slate-400">
                    {new Date(data.extractedAt).toLocaleDateString()}
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-mono">
                Load #{data.load_number || 'N/A'}
              </h2>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                {data.equipment_type || 'Dry Van'}
              </span>
            </div>
          </div>

          {/* Rate Display Badge */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-3.5 sm:p-4 rounded-xl bg-emerald-50 border border-emerald-200/80">
            <span className="text-xs font-medium text-emerald-800 uppercase tracking-wider">
              Total Agreed Carrier Rate
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-700 tabular-nums">
              {formatCurrency(data.total_rate, data.currency)}
            </div>
          </div>
        </div>

        {/* Action Controls Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              {copiedJson ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied JSON!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                  <span>Copy Raw JSON</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Download JSON</span>
            </button>

            <button
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-600" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {rawText && (
              <button
                onClick={() => setShowRawText(!showRawText)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <span>Document Source</span>
                {showRawText ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Fields'}</span>
            </button>
          </div>
        </div>

        {/* Optional Collapsible Source Document Preview */}
        {showRawText && rawText && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-semibold uppercase text-slate-500 mb-2">
              Extracted Document Text Source
            </h4>
            <pre className="p-4 bg-slate-900 text-slate-100 text-xs font-mono rounded-xl overflow-x-auto whitespace-pre-wrap max-h-60 leading-relaxed">
              {rawText}
            </pre>
          </div>
        )}
      </div>

      {/* Edit Form Modal/Drawer if editing */}
      {isEditing && (
        <form onSubmit={handleSaveEdit} className="bg-white border-2 border-blue-300 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Edit Rate Confirmation Data</h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Load Number</label>
              <input
                type="text"
                value={editFormData.load_number}
                onChange={(e) => setEditFormData({ ...editFormData, load_number: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Total Agreed Rate</label>
              <input
                type="number"
                step="0.01"
                value={editFormData.total_rate}
                onChange={(e) => setEditFormData({ ...editFormData, total_rate: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Equipment Type</label>
              <input
                type="text"
                value={editFormData.equipment_type}
                onChange={(e) => setEditFormData({ ...editFormData, equipment_type: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Broker Name</label>
              <input
                type="text"
                value={editFormData.broker.name}
                onChange={(e) => setEditFormData({
                  ...editFormData,
                  broker: { ...editFormData.broker, name: e.target.value }
                })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Carrier Name</label>
              <input
                type="text"
                value={editFormData.carrier.name}
                onChange={(e) => setEditFormData({
                  ...editFormData,
                  carrier: { ...editFormData.carrier, name: e.target.value }
                })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Weight</label>
              <input
                type="text"
                value={editFormData.weight}
                onChange={(e) => setEditFormData({ ...editFormData, weight: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* Broker & Carrier Information Two-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Broker Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Broker Organization</h3>
            </div>

            <div className="space-y-2.5 text-sm">
              <div className="text-lg font-semibold text-slate-900">
                {data.broker.name || 'Not Provided'}
              </div>

              {data.broker.dispatcher_name && (
                <div className="text-xs text-slate-600">
                  <span className="font-medium text-slate-700">Dispatcher Rep: </span>
                  <span>{data.broker.dispatcher_name}</span>
                </div>
              )}

              {data.broker.address && (
                <div className="text-xs text-slate-500">
                  <span>{data.broker.address}</span>
                </div>
              )}

              <div className="pt-2 flex flex-col gap-1.5 border-t border-slate-100 text-xs">
                {data.broker.contact_phone ? (
                  <a
                    href={`tel:${data.broker.contact_phone}`}
                    className="flex items-center gap-2 text-slate-700 hover:text-blue-600 font-mono transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{data.broker.contact_phone}</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    <span>Phone: Unlisted</span>
                  </div>
                )}

                {data.broker.contact_email ? (
                  <a
                    href={`mailto:${data.broker.contact_email}`}
                    className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{data.broker.contact_email}</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    <span>Email: Unlisted</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Carrier Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Assigned Carrier</h3>
            </div>

            <div className="space-y-2.5 text-sm">
              <div className="text-lg font-semibold text-slate-900">
                {data.carrier.name || 'Not Assigned / Pending'}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                <div className="px-2.5 py-1 rounded bg-slate-100 text-slate-800">
                  <span className="text-slate-500">MC: </span>
                  <span className="font-semibold">{data.carrier.mc_number || 'N/A'}</span>
                </div>
                <div className="px-2.5 py-1 rounded bg-slate-100 text-slate-800">
                  <span className="text-slate-500">DOT: </span>
                  <span className="font-semibold">{data.carrier.dot_number || 'N/A'}</span>
                </div>
              </div>

              {(data.carrier.driver_name || data.carrier.truck_number) && (
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  {data.carrier.driver_name && (
                    <p><span className="font-medium text-slate-700">Driver:</span> {data.carrier.driver_name}</p>
                  )}
                  {data.carrier.truck_number && (
                    <p><span className="font-medium text-slate-700">Tractor/Trailer:</span> {data.carrier.truck_number} / {data.carrier.trailer_number || 'N/A'}</p>
                  )}
                </div>
              )}

              {data.carrier.contact_phone && (
                <div className="pt-2 flex items-center gap-2 text-xs font-mono text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{data.carrier.contact_phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Load Specifications & Financial Details Strip */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase text-slate-500 tracking-wider mb-4">
          Load Parameters & Pricing Details
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Scale className="w-3.5 h-3.5" />
              <span>Reported Weight</span>
            </div>
            <div className="text-base font-bold text-slate-900 font-mono tabular-nums">
              {data.weight || 'N/A'}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Truck className="w-3.5 h-3.5" />
              <span>Equipment</span>
            </div>
            <div className="text-base font-bold text-slate-900 truncate">
              {data.equipment_type || 'Dry Van'}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Total Stops</span>
            </div>
            <div className="text-base font-bold text-slate-900 font-mono">
              {stopCounts.total} ({stopCounts.pickups} PU / {stopCounts.deliveries} DEL)
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Payment Terms</span>
            </div>
            <div className="text-xs font-semibold text-slate-800 leading-tight">
              {data.payment_terms || 'Standard Net 30'}
            </div>
          </div>
        </div>

        {/* Rate Breakdown if available */}
        {data.breakdown && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-mono">
            {data.breakdown.linehaul !== undefined && (
              <span className="text-slate-600">
                Linehaul: <strong className="text-slate-900">{formatCurrency(data.breakdown.linehaul, data.currency)}</strong>
              </span>
            )}
            {data.breakdown.fuel_surcharge !== undefined && (
              <span className="text-slate-600">
                Fuel Surcharge: <strong className="text-slate-900">{formatCurrency(data.breakdown.fuel_surcharge, data.currency)}</strong>
              </span>
            )}
            {data.breakdown.detention_rate_per_hour !== undefined && (
              <span className="text-slate-600">
                Detention: <strong className="text-slate-900">{formatCurrency(data.breakdown.detention_rate_per_hour, data.currency)}/hr</strong>
              </span>
            )}
          </div>
        )}

        {data.temperature_setting && (
          <div className="mt-3 p-3 bg-cyan-50 border border-cyan-200 rounded-xl text-xs text-cyan-900 flex items-center gap-2">
            <span className="font-semibold">Reefer Temp Setting:</span>
            <span>{data.temperature_setting}</span>
          </div>
        )}
      </div>

      {/* Stops & Route Itinerary Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Stops & Route Itinerary</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Chronological schedule of pickup facilities, receivers, and appointment windows
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-md">
            {data.stops?.length || 0} Scheduled Locations
          </div>
        </div>

        <div className="relative pl-4 sm:pl-6 space-y-6 before:absolute before:left-7 sm:before:left-9 before:top-4 before:bottom-6 before:w-0.5 before:bg-slate-200">
          {data.stops?.map((stop: Stop, idx: number) => {
            const isPickup = stop.type === 'PICKUP';
            return (
              <div key={idx} className="relative flex items-start gap-4 group">
                {/* Marker Circle */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 shadow-sm border-2 ${
                    isPickup
                      ? 'bg-blue-600 text-white border-white'
                      : 'bg-emerald-600 text-white border-white'
                  }`}
                >
                  {stop.stop_number || idx + 1}
                </div>

                {/* Stop Card */}
                <div className="flex-1 bg-slate-50 hover:bg-slate-50/80 border border-slate-200/80 rounded-xl p-4 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          isPickup
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {stop.type}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">
                        {stop.facility_name}
                      </h4>
                    </div>

                    {stop.po_or_ref_number && (
                      <span className="text-xs font-mono text-slate-500">
                        Ref/PO: {stop.po_or_ref_number}
                      </span>
                    )}
                  </div>

                  {/* Address */}
                  <div className="mt-2.5 flex items-start gap-2 text-xs text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{stop.address}</span>
                  </div>

                  {/* Schedule Details */}
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-600">
                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{stop.appointment_date}</span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{stop.appointment_time}</span>
                    </div>

                    {stop.commodity && (
                      <div className="text-slate-500">
                        Commodity: <strong className="text-slate-700">{stop.commodity}</strong>
                      </div>
                    )}
                  </div>

                  {/* Stop Notes */}
                  {stop.notes && (
                    <div className="mt-3 p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-lg text-xs text-amber-900 leading-relaxed">
                      <span className="font-semibold">Facility Note: </span>
                      {stop.notes}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Special Instructions & Conditions */}
      {data.special_instructions && data.special_instructions.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Special Instructions & Accessorial Policies
            </h3>
          </div>

          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
            {data.special_instructions.map((instruction, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                <span className="leading-relaxed">{instruction}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
