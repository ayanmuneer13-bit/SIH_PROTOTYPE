import { OPDQueueRecord } from '../types';

export const DEPARTMENTS = [
  'General Medicine',
  'Cardiology',
  'Orthopedics',
  'Pediatrics',
  'ENT',
  'Dermatology',
  'Ophthalmology',
  'Gynecology'
] as const;

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

export const TIME_SLOTS = [
  'Morning (08:00 - 11:00)',
  'Midday (11:00 - 14:00)',
  'Afternoon (14:00 - 17:00)',
  'Evening (17:00 - 20:00)'
] as const;

export const DOCTORS_BY_DEPT: Record<string, { name: string; exp: number; avgMin: number }[]> = {
  'General Medicine': [
    { name: 'Dr. Rajesh Verma', exp: 16, avgMin: 9 },
    { name: 'Dr. S. K. Mukherjee', exp: 22, avgMin: 11 },
    { name: 'Dr. Alok Nath', exp: 7, avgMin: 10 }
  ],
  Cardiology: [
    { name: 'Dr. A. P. Chawla', exp: 20, avgMin: 18 },
    { name: 'Dr. Meenakshi Rao', exp: 12, avgMin: 16 }
  ],
  Orthopedics: [
    { name: 'Dr. Vikram Malhotra', exp: 18, avgMin: 14 },
    { name: 'Dr. Pradeep Sen', exp: 9, avgMin: 13 }
  ],
  Pediatrics: [
    { name: 'Dr. Sunita Bansal', exp: 14, avgMin: 12 },
    { name: 'Dr. Harish Patel', exp: 8, avgMin: 11 }
  ],
  ENT: [
    { name: 'Dr. Farooq Khan', exp: 15, avgMin: 9 },
    { name: 'Dr. Vandana Gupta', exp: 11, avgMin: 8 }
  ],
  Dermatology: [
    { name: 'Dr. Neha Kapoor', exp: 10, avgMin: 8 },
    { name: 'Dr. Amit Trivedi', exp: 6, avgMin: 7 }
  ],
  Ophthalmology: [
    { name: 'Dr. Joyjit Ghosh', exp: 13, avgMin: 9 },
    { name: 'Dr. Rina Jacob', exp: 17, avgMin: 10 }
  ],
  Gynecology: [
    { name: 'Dr. Kavita Singhania', exp: 19, avgMin: 15 },
    { name: 'Dr. Smriti Jain', exp: 11, avgMin: 14 }
  ]
};

// Seeded deterministic pseudo-random generator for consistent synthetic records
function createSeededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateSyntheticDataset(count = 520): OPDQueueRecord[] {
  const rand = createSeededRandom(426047);
  const records: OPDQueueRecord[] = [];

  for (let i = 1; i <= count; i++) {
    const dept = DEPARTMENTS[Math.floor(rand() * DEPARTMENTS.length)];
    const docs = DOCTORS_BY_DEPT[dept] || DOCTORS_BY_DEPT['General Medicine'];
    const doc = docs[Math.floor(rand() * docs.length)];
    const day = DAYS_OF_WEEK[Math.floor(rand() * DAYS_OF_WEEK.length)];
    const timeSlot = TIME_SLOTS[Math.floor(rand() * TIME_SLOTS.length)];

    // Day of week rush factor (Mondays and Saturdays heavier in OPD)
    const dayRushMultiplier = day === 'Monday' ? 1.25 : day === 'Saturday' ? 1.2 : 1.0;
    // Time slot factor (Mornings are busiest)
    const slotMultiplier =
      timeSlot.startsWith('Morning') ? 1.2 : timeSlot.startsWith('Midday') ? 1.05 : 0.9;

    const tokenNumber = Math.floor(rand() * 90) + 1;
    // Patients ahead is bounded by token number minus already seen patients
    const completedAheadFraction = 0.3 + rand() * 0.45; // 30% to 75% seen
    const patientsAhead = Math.max(0, Math.round(tokenNumber * (1 - completedAheadFraction)));
    const queueSize = Math.max(patientsAhead + Math.floor(rand() * 15), tokenNumber + 5);

    // Baseline calculation with realistic noise and emergency interruptions
    const baselineWait = patientsAhead * doc.avgMin * dayRushMultiplier * slotMultiplier;
    // Add realistic hospital variance (emergency cases jumping queue, complex patient consults)
    const varianceMinutes = (rand() - 0.45) * (patientsAhead > 10 ? 16 : 8);
    const actualWaitMinutes = Math.max(4, Math.round(baselineWait + varianceMinutes));

    const historicalAvgWait = Math.round(patientsAhead * doc.avgMin);

    records.push({
      id: `opd-rec-${i}`,
      tokenNumber,
      patientsAhead,
      queueSize,
      department: dept,
      doctorName: doc.name,
      doctorExperience: doc.exp,
      dayOfWeek: day,
      timeSlot,
      avgConsultMinutes: doc.avgMin,
      historicalAvgWait,
      actualWaitMinutes
    });
  }

  return records;
}

export const SYNTHETIC_OPD_DATASET: OPDQueueRecord[] = generateSyntheticDataset(520);
