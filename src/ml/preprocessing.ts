import { OPDQueueRecord, OPDQueueInput } from '../types';
import { DEPARTMENTS, DAYS_OF_WEEK, TIME_SLOTS } from './dataset';

export interface NormalizedFeatureVector {
  values: number[];
  weights: number[];
}

export interface FeatureScaler {
  min: number;
  max: number;
}

export interface PreprocessingMeta {
  tokenScaler: FeatureScaler;
  patientsAheadScaler: FeatureScaler;
  queueSizeScaler: FeatureScaler;
  expScaler: FeatureScaler;
  consultTimeScaler: FeatureScaler;
}

// Compute scalers across dataset
export function computeDatasetScalers(dataset: OPDQueueRecord[]): PreprocessingMeta {
  let minToken = Infinity, maxToken = -Infinity;
  let minAhead = Infinity, maxAhead = -Infinity;
  let minQueue = Infinity, maxQueue = -Infinity;
  let minExp = Infinity, maxExp = -Infinity;
  let minConsult = Infinity, maxConsult = -Infinity;

  for (const r of dataset) {
    if (r.tokenNumber < minToken) minToken = r.tokenNumber;
    if (r.tokenNumber > maxToken) maxToken = r.tokenNumber;

    if (r.patientsAhead < minAhead) minAhead = r.patientsAhead;
    if (r.patientsAhead > maxAhead) maxAhead = r.patientsAhead;

    if (r.queueSize < minQueue) minQueue = r.queueSize;
    if (r.queueSize > maxQueue) maxQueue = r.queueSize;

    if (r.doctorExperience < minExp) minExp = r.doctorExperience;
    if (r.doctorExperience > maxExp) maxExp = r.doctorExperience;

    if (r.avgConsultMinutes < minConsult) minConsult = r.avgConsultMinutes;
    if (r.avgConsultMinutes > maxConsult) maxConsult = r.avgConsultMinutes;
  }

  return {
    tokenScaler: { min: minToken, max: maxToken || 100 },
    patientsAheadScaler: { min: minAhead, max: maxAhead || 50 },
    queueSizeScaler: { min: minQueue, max: maxQueue || 80 },
    expScaler: { min: minExp, max: maxExp || 30 },
    consultTimeScaler: { min: minConsult, max: maxConsult || 25 }
  };
}

function minMaxScale(val: number, scaler: FeatureScaler): number {
  if (scaler.max === scaler.min) return 0.5;
  const clamped = Math.max(scaler.min, Math.min(scaler.max, val));
  return (clamped - scaler.min) / (scaler.max - scaler.min);
}

// Feature extraction and vectorization
// Feature indices:
// 0: Patients Ahead (Weight 3.5) - primary driver of wait time
// 1: Token Number (Weight 1.5)
// 2: Queue Size (Weight 1.2)
// 3: Department Match (Weight 3.0)
// 4: Time of Day Factor (Weight 1.0)
// 5: Day of Week Factor (Weight 0.8)
// 6: Doctor Consultation Pace (Weight 2.0)
export function extractFeatureVector(
  record: OPDQueueRecord | OPDQueueInput,
  meta: PreprocessingMeta,
  targetDept?: string
): NormalizedFeatureVector {
  const dept = record.department || targetDept || 'General Medicine';
  const deptIdx = DEPARTMENTS.indexOf(dept as typeof DEPARTMENTS[number]);
  const deptNormalized = deptIdx >= 0 ? deptIdx / DEPARTMENTS.length : 0;

  const day = record.dayOfWeek || 'Monday';
  const dayIdx = DAYS_OF_WEEK.indexOf(day as typeof DAYS_OF_WEEK[number]);
  const dayNormalized = dayIdx >= 0 ? dayIdx / DAYS_OF_WEEK.length : 0.5;

  const slot = record.timeSlot || 'Morning (08:00 - 11:00)';
  const slotIdx = TIME_SLOTS.indexOf(slot as typeof TIME_SLOTS[number]);
  const slotNormalized = slotIdx >= 0 ? slotIdx / TIME_SLOTS.length : 0.5;

  const exp = ('doctorExperience' in record && record.doctorExperience) ? record.doctorExperience : 12;
  const consultMin = ('avgConsultMinutes' in record && record.avgConsultMinutes)
    ? record.avgConsultMinutes
    : 11;

  const values = [
    minMaxScale(record.patientsAhead, meta.patientsAheadScaler),
    minMaxScale(record.tokenNumber, meta.tokenScaler),
    minMaxScale(record.queueSize, meta.queueSizeScaler),
    deptNormalized,
    slotNormalized,
    dayNormalized,
    minMaxScale(consultMin, meta.consultTimeScaler),
    minMaxScale(exp, meta.expScaler)
  ];

  // Importance weights
  const weights = [3.5, 1.2, 1.0, 3.0, 1.0, 0.8, 2.2, 0.6];

  return { values, weights };
}
