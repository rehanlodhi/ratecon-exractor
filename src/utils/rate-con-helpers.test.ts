import test from 'node:test';
import assert from 'node:assert/strict';
import { formatCurrency, getStopCounts, sanitizeRateCon, convertRateConToCSV } from './rate-con-helpers';

test('formatCurrency formats valid numbers and fallback strings', () => {
  assert.equal(formatCurrency(2450.5), '$2,450.50');
  assert.equal(formatCurrency('1800'), '$1,800.00');
  assert.equal(formatCurrency(0), '$0.00');
  assert.equal(formatCurrency(null), '$0.00');
});

test('getStopCounts counts pickups and deliveries correctly', () => {
  const counts = getStopCounts([
    { type: 'PICKUP', stop_number: 1, facility_name: 'Origin WH', address: 'Chicago IL', appointment_date: '2026-11-01', appointment_time: '08:00' },
    { type: 'DELIVERY', stop_number: 2, facility_name: 'Midwest Hub', address: 'Indianapolis IN', appointment_date: '2026-11-02', appointment_time: '14:00' },
    { type: 'DELIVERY', stop_number: 3, facility_name: 'Final Dest', address: 'Louisville KY', appointment_date: '2026-11-03', appointment_time: '10:00' },
  ]);
  assert.equal(counts.pickups, 1);
  assert.equal(counts.deliveries, 2);
  assert.equal(counts.total, 3);
});

test('sanitizeRateCon fills in safe defaults for empty or incomplete payload', () => {
  const result = sanitizeRateCon({
    load_number: 'LD-9921',
    total_rate: 3200,
  });
  assert.equal(result.load_number, 'LD-9921');
  assert.equal(result.total_rate, 3200);
  assert.equal(result.broker.name, 'Not Provided');
  assert.equal(result.carrier.name, 'Not Assigned');
  assert.equal(result.currency, 'USD');
  assert.ok(Array.isArray(result.stops));
  assert.ok(Array.isArray(result.special_instructions));
});

test('convertRateConToCSV generates valid CSV text with load header and stops', () => {
  const sanitized = sanitizeRateCon({
    load_number: 'TEST-1234',
    total_rate: 1500,
    broker: { name: 'Freight Express' },
    carrier: { name: 'Apex Logistics' },
    stops: [
      { type: 'PICKUP', stop_number: 1, facility_name: 'Depot A', address: '123 Main St', appointment_date: '2026-10-30', appointment_time: '09:00' },
    ],
  });
  const csv = convertRateConToCSV(sanitized);
  assert.ok(csv.includes('TEST-1234'));
  assert.ok(csv.includes('Freight Express'));
  assert.ok(csv.includes('Depot A'));
});
