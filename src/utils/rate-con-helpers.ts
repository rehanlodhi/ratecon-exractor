import { RateConfirmation, Stop } from '../types/rate-con';

/**
 * Format currency amount with symbol and tabular precision
 */
export function formatCurrency(amount: number | string | undefined | null, currency = 'USD'): string {
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount || 0));
  if (isNaN(num)) return '$0.00';
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    return `$${num.toFixed(2)}`;
  }
}

/**
 * Counts pickups and deliveries in a stops itinerary
 */
export function getStopCounts(stops: Stop[] = []) {
  let pickups = 0;
  let deliveries = 0;
  for (const s of stops) {
    if (s.type === 'PICKUP') pickups++;
    else if (s.type === 'DELIVERY') deliveries++;
  }
  return { pickups, deliveries, total: stops.length };
}

/**
 * Sanitizes and normalizes extracted rate confirmation data to guarantee safe render
 */
export function sanitizeRateCon(input: Partial<RateConfirmation>): RateConfirmation {
  const broker = input.broker || { name: 'Not Provided' };
  const carrier = input.carrier || { name: 'Not Assigned' };
  
  const rawRate = (input as any).total_rate;
  const numRate = typeof rawRate === 'number' 
    ? rawRate 
    : (typeof rawRate === 'string' ? parseFloat(rawRate.replace(/[^0-9.-]/g, '')) : 0);

  const stops = Array.isArray(input.stops)
    ? input.stops.map((s, idx) => ({
        type: (s.type === 'PICKUP' || s.type === 'DELIVERY') ? s.type : (idx === 0 ? 'PICKUP' : 'DELIVERY'),
        stop_number: Number(s.stop_number) || idx + 1,
        facility_name: String(s.facility_name || `Facility #${idx + 1}`),
        address: String(s.address || 'Address unlisted'),
        appointment_date: String(s.appointment_date || 'Pending Schedule'),
        appointment_time: String(s.appointment_time || 'Open Window'),
        notes: s.notes ? String(s.notes) : undefined,
        commodity: s.commodity ? String(s.commodity) : undefined,
        weight_lbs: s.weight_lbs,
        po_or_ref_number: s.po_or_ref_number ? String(s.po_or_ref_number) : undefined,
      }))
    : [];

  const special_instructions = Array.isArray(input.special_instructions)
    ? input.special_instructions.map(String).filter(Boolean)
    : [];

  return {
    id: input.id || `rc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    fileName: input.fileName,
    extractedAt: input.extractedAt || new Date().toISOString(),
    load_number: String(input.load_number || 'UNKNOWN-LOAD').trim(),
    broker: {
      name: String(broker.name || 'Not Provided'),
      contact_email: broker.contact_email ? String(broker.contact_email) : undefined,
      contact_phone: broker.contact_phone ? String(broker.contact_phone) : undefined,
      address: broker.address ? String(broker.address) : undefined,
      dispatcher_name: broker.dispatcher_name ? String(broker.dispatcher_name) : undefined,
    },
    carrier: {
      name: String(carrier.name || 'Not Assigned'),
      mc_number: carrier.mc_number ? String(carrier.mc_number) : undefined,
      dot_number: carrier.dot_number ? String(carrier.dot_number) : undefined,
      contact_phone: carrier.contact_phone ? String(carrier.contact_phone) : undefined,
      driver_name: carrier.driver_name ? String(carrier.driver_name) : undefined,
      truck_number: carrier.truck_number ? String(carrier.truck_number) : undefined,
      trailer_number: carrier.trailer_number ? String(carrier.trailer_number) : undefined,
    },
    equipment_type: String(input.equipment_type || '53ft Dry Van'),
    total_rate: isNaN(numRate) ? 0 : numRate,
    currency: String(input.currency || 'USD'),
    weight: String(input.weight || 'N/A'),
    stops,
    special_instructions,
    breakdown: input.breakdown,
    temperature_setting: input.temperature_setting,
    payment_terms: input.payment_terms || 'Standard 30 Days QuickPay available',
  };
}

/**
 * Generate a clean CSV export for transportation management systems (TMS)
 */
export function convertRateConToCSV(rateCon: RateConfirmation): string {
  const rows: string[][] = [
    ['Load Number', rateCon.load_number],
    ['Total Rate', `${rateCon.currency} ${rateCon.total_rate}`],
    ['Equipment', rateCon.equipment_type],
    ['Weight', rateCon.weight],
    ['Broker Name', rateCon.broker.name],
    ['Broker Phone', rateCon.broker.contact_phone || ''],
    ['Broker Email', rateCon.broker.contact_email || ''],
    ['Carrier Name', rateCon.carrier.name],
    ['Carrier MC #', rateCon.carrier.mc_number || ''],
    ['Carrier DOT #', rateCon.carrier.dot_number || ''],
    [],
    ['Stop #', 'Type', 'Facility Name', 'Address', 'Appointment Date', 'Appointment Time', 'Notes'],
  ];

  for (const stop of rateCon.stops) {
    rows.push([
      String(stop.stop_number),
      stop.type,
      `"${(stop.facility_name || '').replace(/"/g, '""')}"`,
      `"${(stop.address || '').replace(/"/g, '""')}"`,
      stop.appointment_date,
      stop.appointment_time,
      `"${(stop.notes || '').replace(/"/g, '""')}"`,
    ]);
  }

  return rows.map(r => r.join(',')).join('\n');
}
