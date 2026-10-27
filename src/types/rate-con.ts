export interface Stop {
  type: 'PICKUP' | 'DELIVERY';
  stop_number: number;
  facility_name: string;
  address: string;
  appointment_date: string;
  appointment_time: string;
  notes?: string;
  commodity?: string;
  weight_lbs?: number | string;
  po_or_ref_number?: string;
}

export interface BrokerInfo {
  name: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  dispatcher_name?: string;
}

export interface CarrierInfo {
  name: string;
  mc_number?: string;
  dot_number?: string;
  contact_phone?: string;
  driver_name?: string;
  truck_number?: string;
  trailer_number?: string;
}

export interface RateBreakdown {
  linehaul?: number;
  fuel_surcharge?: number;
  accessorials?: number;
  detention_rate_per_hour?: number;
}

export interface RateConfirmation {
  id?: string;
  fileName?: string;
  extractedAt?: string;
  load_number: string;
  broker: BrokerInfo;
  carrier: CarrierInfo;
  equipment_type: string;
  total_rate: number;
  currency: string;
  weight: string;
  stops: Stop[];
  special_instructions: string[];
  breakdown?: RateBreakdown;
  temperature_setting?: string;
  payment_terms?: string;
}

export interface ExtractionResult {
  data: RateConfirmation;
  rawText?: string;
  tokensUsed?: number;
  durationMs?: number;
}
