import { RateConfirmation } from '../types/rate-con';

export interface SampleDocument {
  id: string;
  title: string;
  brokerLogoText: string;
  description: string;
  equipmentSummary: string;
  routeSummary: string;
  rateSummary: string;
  data: RateConfirmation;
  rawDocumentText: string;
}

export const SAMPLE_RATE_CONFIRMATIONS: SampleDocument[] = [
  {
    id: 'sample-chr-dryvan',
    title: 'C.H. Robinson - Chicago to Dallas Dry Van',
    brokerLogoText: 'CHR',
    description: 'High-volume consumer goods dry van freight with strict pickup appointment and live unloader.',
    equipmentSummary: '53\' Dry Van (Air-Ride)',
    routeSummary: 'Chicago, IL → Dallas, TX',
    rateSummary: '$2,850.00 USD',
    data: {
      id: 'rc-chr-849201',
      fileName: 'CH_Robinson_Load_849201.pdf',
      extractedAt: '2026-10-26T18:30:00.000Z',
      load_number: 'CHR-8492019',
      broker: {
        name: 'C.H. Robinson Worldwide, Inc.',
        contact_email: 'midwest-dispatch@chrobinson.com',
        contact_phone: '(800) 323-7587 ext. 4410',
        address: '14701 Charlson Rd, Eden Prairie, MN 55347',
        dispatcher_name: 'Marcus Vance'
      },
      carrier: {
        name: 'Apex Freight Systems LLC',
        mc_number: 'MC-948271',
        dot_number: 'USDOT 3184920',
        contact_phone: '(773) 555-0199',
        driver_name: 'David Miller',
        truck_number: 'TRK-104',
        trailer_number: 'TLR-5390'
      },
      equipment_type: '53ft Dry Van',
      total_rate: 2850.00,
      currency: 'USD',
      weight: '41,500 lbs',
      breakdown: {
        linehaul: 2450.00,
        fuel_surcharge: 400.00,
        detention_rate_per_hour: 75.00
      },
      payment_terms: 'QuickPay 2% Net 2 Days or Standard Net 30',
      stops: [
        {
          type: 'PICKUP',
          stop_number: 1,
          facility_name: 'Procter Distribution Logistics Hub',
          address: '4200 S Pulaski Rd, Chicago, IL 60632',
          appointment_date: '2026-11-02',
          appointment_time: '08:00 CST (Strict Firm)',
          notes: 'Check in at Gate 4. Driver must have safety vest and steel toe boots. Clean dry van required.',
          commodity: 'Packaged Household Paper Goods',
          weight_lbs: 41500,
          po_or_ref_number: 'PO-883910'
        },
        {
          type: 'DELIVERY',
          stop_number: 2,
          facility_name: 'Southwest Fulfillment Center #12',
          address: '3200 Logistics Dr, Dallas, TX 75241',
          appointment_date: '2026-11-04',
          appointment_time: '07:30 CST (Live Unload)',
          notes: 'Receiving dock bays 18-24. Call 2 hours prior to arrival for staging number.',
          commodity: 'Packaged Household Paper Goods',
          weight_lbs: 41500,
          po_or_ref_number: 'BOL-992014'
        }
      ],
      special_instructions: [
        'Driver must maintain 24/7 MacroPoint or ELD tracking from pickup dispatch until final delivery.',
        'Detention: $75/hr after 2 free hours. Must notify broker at 1 hr 45 min mark with in/out timestamps on signed BOL.',
        'No brokering, double-brokering, or co-loading permitted. Violation results in full forfeiture of rate.',
        'Clean trailer interior with no holes, strong chemical odor, or protruding nails.',
        'Immediate notification required for any transit delays or breakdown.'
      ]
    },
    rawDocumentText: `C.H. ROBINSON WORLDWIDE, INC.
RATE CONFIRMATION AGREEMENT / LOAD TENDER
Load Number: CHR-8492019
Date Tendered: 10/26/2026
Carrier: Apex Freight Systems LLC (MC-948271 / USDOT: 3184920)
Contact: David Miller | Phone: (773) 555-0199
Broker Rep: Marcus Vance | Email: midwest-dispatch@chrobinson.com | Phone: (800) 323-7587 ext 4410

RATE AGREEMENT:
Linehaul: $2,450.00 USD
Fuel Surcharge: $400.00 USD
TOTAL AGREED RATE: $2,850.00 USD
Payment Terms: QuickPay 2% Net 2 Days / Standard Net 30
Equipment: 53ft Dry Van | Weight: 41,500 lbs | Commodity: Packaged Household Paper Goods

STOP 1: PICKUP (Stop #1)
Facility: Procter Distribution Logistics Hub
Address: 4200 S Pulaski Rd, Chicago, IL 60632
Appt Date: 11/02/2026 @ 08:00 CST (Strict Firm)
Ref/PO#: PO-883910
Notes: Check in at Gate 4. Driver must have safety vest and steel toe boots. Clean dry van required.

STOP 2: DELIVERY (Stop #2)
Facility: Southwest Fulfillment Center #12
Address: 3200 Logistics Dr, Dallas, TX 75241
Appt Date: 11/04/2026 @ 07:30 CST (Live Unload)
BOL#: BOL-992014
Notes: Receiving dock bays 18-24. Call 2 hours prior to arrival for staging number.

SPECIAL INSTRUCTIONS & ACCESSORIAL POLICIES:
1. Tracking: MacroPoint or ELD automated tracking required continuous until empty.
2. Detention: $75/hr after 2 hours free. Must notify broker within 1hr 45min of arrival.
3. Strict no double-brokering policy in effect.`
  },
  {
    id: 'sample-tql-reefer',
    title: 'TQL - Multi-Stop Refrigerated Produce',
    brokerLogoText: 'TQL',
    description: '3-stop cold chain produce run requiring continuous -10°F reefer temperature log and pulp temp verification.',
    equipmentSummary: '53\' Reefer (Continuous -10°F)',
    routeSummary: 'Fresno, CA → Phoenix, AZ → Denver, CO',
    rateSummary: '$4,600.00 USD',
    data: {
      id: 'rc-tql-338192',
      fileName: 'TQL_Reefer_Confirmation_338192.pdf',
      extractedAt: '2026-10-26T19:15:00.000Z',
      load_number: 'TQL-3381922',
      broker: {
        name: 'Total Quality Logistics (TQL)',
        contact_email: 'loads@tql.com',
        contact_phone: '(800) 580-3101',
        address: '4289 Ivy Pointe Blvd, Cincinnati, OH 45245',
        dispatcher_name: 'Sarah Jenkins'
      },
      carrier: {
        name: 'Polar Express Haulers Inc',
        mc_number: 'MC-772910',
        dot_number: 'USDOT 2883011',
        contact_phone: '(559) 555-8822',
        driver_name: 'Carlos Hernandez',
        truck_number: 'REEF-88',
        trailer_number: 'TR-9002'
      },
      equipment_type: '53ft Reefer',
      total_rate: 4600.00,
      currency: 'USD',
      weight: '38,200 lbs',
      temperature_setting: 'Continuous -10°F (Pre-cooled prior to loading)',
      breakdown: {
        linehaul: 4100.00,
        fuel_surcharge: 500.00,
        detention_rate_per_hour: 65.00
      },
      payment_terms: 'Direct Deposit Net 21',
      stops: [
        {
          type: 'PICKUP',
          stop_number: 1,
          facility_name: 'Central Valley Cold Storage',
          address: '1850 E American Ave, Fresno, CA 93725',
          appointment_date: '2026-11-05',
          appointment_time: '06:00 PST (Pre-cooled trailer mandatory)',
          notes: 'Driver must verify pulp temperatures and record on BOL prior to departure. Reefers must run continuous mode.',
          commodity: 'Frozen Organic Berries',
          weight_lbs: 38200,
          po_or_ref_number: 'CV-44910'
        },
        {
          type: 'DELIVERY',
          stop_number: 2,
          facility_name: 'Desert Sun Produce Wholesalers',
          address: '4500 W Buckeye Rd, Phoenix, AZ 85043',
          appointment_date: '2026-11-06',
          appointment_time: '14:00 MST (Partial Unload - 12 Pallets)',
          notes: 'Dock door 9. Driver must witness count and obtain initials for offloaded pallets.',
          commodity: 'Frozen Organic Berries (Partial)',
          weight_lbs: 16000,
          po_or_ref_number: 'DROP-PHX-10'
        },
        {
          type: 'DELIVERY',
          stop_number: 3,
          facility_name: 'Mile High Cold Logistics',
          address: '10200 E 40th Ave, Denver, CO 80238',
          appointment_date: '2026-11-08',
          appointment_time: '09:00 MST (Final Delivery)',
          notes: 'Final drop. Download and provide reefer temperature continuous download report.',
          commodity: 'Frozen Organic Berries (Final)',
          weight_lbs: 22200,
          po_or_ref_number: 'DROP-DEN-99'
        }
      ],
      special_instructions: [
        'REEFER MUST RUN ON CONTINUOUS RUN MODE - NO CYCLE SENTRY PERMITTED AT ANY TIME.',
        'Carrier must upload temp download trace with invoice or payment will be delayed.',
        'Pulp temperature must read between -12°F and -8°F upon loading. Do not load warm freight.',
        'Lumper fees pre-authorized up to $250 per stop with valid receipt uploaded to TQL Trax within 24 hours.'
      ]
    },
    rawDocumentText: `TOTAL QUALITY LOGISTICS - RATE CONFIRMATION
Load Reference: TQL-3381922
Tendered Date: 10/26/2026
Carrier: Polar Express Haulers Inc | MC# 772910 | DOT# 2883011
Broker Contact: Sarah Jenkins | Email: loads@tql.com | Phone: (800) 580-3101

COMPENSATION:
Total Agreed Carrier Rate: $4,600.00 USD
(Linehaul: $4,100.00, Fuel: $500.00)
Equipment: 53ft Reefer | Weight: 38,200 lbs | Temp Setting: Continuous -10°F

STOP 1 - PICKUP
Central Valley Cold Storage
1850 E American Ave, Fresno, CA 93725
Date: 11/05/2026 @ 06:00 PST
Notes: Pre-cool trailer to -10F. Pulp temp required.

STOP 2 - DELIVERY (Stop 2 of 3)
Desert Sun Produce Wholesalers
4500 W Buckeye Rd, Phoenix, AZ 85043
Date: 11/06/2026 @ 14:00 MST
Notes: Partial drop 12 pallets.

STOP 3 - DELIVERY (Stop 3 of 3 - Final)
Mile High Cold Logistics
10200 E 40th Ave, Denver, CO 80238
Date: 11/08/2026 @ 09:00 MST
Notes: Final clear. Temp download required.

SPECIAL CONDITIONS:
Continuous reefer mode mandatory. Lumper reimbursement requires receipt within 24h.`
  },
  {
    id: 'sample-echo-flatbed',
    title: 'Echo Global - Industrial Flatbed Steel & Machinery',
    brokerLogoText: 'ECHO',
    description: 'Heavy industrial flatbed freight requiring 8ft drop tarps, edge protectors, and 4-inch heavy ratchet straps.',
    equipmentSummary: '48\'/53\' Flatbed with Tarps',
    routeSummary: 'Cleveland, OH → Atlanta, GA',
    rateSummary: '$3,150.00 USD',
    data: {
      id: 'rc-echo-518290',
      fileName: 'Echo_Logistics_Flatbed_518290.pdf',
      extractedAt: '2026-10-26T20:00:00.000Z',
      load_number: 'ECHO-5182904',
      broker: {
        name: 'Echo Global Logistics, Inc.',
        contact_email: 'flatbed-team@echo.com',
        contact_phone: '(800) 354-7993',
        address: '600 W Chicago Ave #725, Chicago, IL 60654',
        dispatcher_name: 'Brent Caldwell'
      },
      carrier: {
        name: 'Titan Heavy Hauling Corp',
        mc_number: 'MC-619284',
        dot_number: 'USDOT 2419082',
        contact_phone: '(216) 555-4011',
        driver_name: 'Robert Vance',
        truck_number: 'FB-502',
        trailer_number: 'FLT-811'
      },
      equipment_type: '53ft Flatbed',
      total_rate: 3150.00,
      currency: 'USD',
      weight: '44,800 lbs',
      breakdown: {
        linehaul: 2750.00,
        fuel_surcharge: 300.00,
        accessorials: 100.00, // Tarp fee
        detention_rate_per_hour: 70.00
      },
      payment_terms: 'Direct Deposit Net 15',
      stops: [
        {
          type: 'PICKUP',
          stop_number: 1,
          facility_name: 'Great Lakes Fabricators & Steel Works',
          address: '3300 E 55th St, Cleveland, OH 44127',
          appointment_date: '2026-11-03',
          appointment_time: '07:00 EST (FCFS 07:00 - 14:00)',
          notes: 'Driver must provide 8ft drop tarps in excellent condition. Overhead crane loading.',
          commodity: 'Structural Steel Beams & Machined Tubing',
          weight_lbs: 44800,
          po_or_ref_number: 'GLS-99120'
        },
        {
          type: 'DELIVERY',
          stop_number: 2,
          facility_name: 'Metro Atlanta Industrial Site B',
          address: '1500 Fulton Industrial Blvd, Atlanta, GA 30336',
          appointment_date: '2026-11-05',
          appointment_time: '08:00 EST (Firm Appointment)',
          notes: 'Job site delivery. Forklift unload from side of trailer. PPE mandatory on site.',
          commodity: 'Structural Steel Beams & Machined Tubing',
          weight_lbs: 44800,
          po_or_ref_number: 'JOB-ATL-044'
        }
      ],
      special_instructions: [
        'Load must be 100% tarped with 8ft drop tarps and secured with min 10 steel ratchet straps.',
        'Use corner edge protectors on all beam contact points to avoid cutting straps or tarps.',
        'Driver must carry hard hat, high-vis reflective vest, safety glasses, and steel-toed boots.',
        'Notify Echo operations immediately upon completion of tarping and strapping with photos.'
      ]
    },
    rawDocumentText: `ECHO GLOBAL LOGISTICS - RATE CONFIRMATION
Confirmation ID: ECHO-5182904
Date: 10/26/2026
Carrier: Titan Heavy Hauling Corp (MC# 619284 / DOT# 2419082)
Broker Specialist: Brent Caldwell | flatbed-team@echo.com | (800) 354-7993

TOTAL CARRIER PAY: $3,150.00 USD
(Linehaul: $2,750.00 | Fuel: $300.00 | Tarp Fee: $100.00)
Equipment: 53ft Flatbed | Weight: 44,800 lbs | Commodity: Structural Steel Beams

ORIGIN (PICKUP 1):
Great Lakes Fabricators & Steel Works
3300 E 55th St, Cleveland, OH 44127
Date: 11/03/2026 @ 07:00 EST FCFS
Notes: 8ft drop tarps required. Overhead crane load.

DESTINATION (DELIVERY 1):
Metro Atlanta Industrial Site B
1500 Fulton Industrial Blvd, Atlanta, GA 30336
Date: 11/05/2026 @ 08:00 EST
Notes: Construction job site. Strict PPE.

TERMS & CONDITIONS:
Full tarping required. Must secure with heavy chains/straps and corner protectors.`
  }
];
