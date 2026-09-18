import { Helpline, SafetyAssessment } from '../types';

export const EMERGENCY_HELPLINES: Helpline[] = [
  {
    name: 'National Emergency Number',
    number: '112',
    description: 'All-in-one emergency response (Ambulance, Police, Fire)',
    type: 'national'
  },
  {
    name: 'National Ambulance Service',
    number: '108',
    description: 'Free emergency medical transit across India',
    type: 'ambulance'
  },
  {
    name: 'National Health Helpline',
    number: '104',
    description: 'Government health advice and emergency hospital bed information',
    type: 'national'
  },
  {
    name: 'Tele-MANAS Mental Health Support',
    number: '14416',
    description: '24/7 free national psychological support & crisis helpline',
    type: 'mental_health'
  }
];

interface SafetyRule {
  category: string;
  patterns: RegExp[];
  severity: 'critical' | 'moderate';
  guidanceText: string;
}

const SAFETY_RULES: SafetyRule[] = [
  // 1. CARDIAC EMERGENCY (CRITICAL)
  {
    category: 'Severe Cardiac / Chest Emergency',
    patterns: [
      /(crushing|severe|radiating|intense)?\s*(chest\s*pain|chest\s*pressure|pain\s*in\s*chest)/i,
      /chest\s*pain.*(arm|jaw|shoulder|neck|back|breathless|sweat)/i,
      /(arm|jaw|shoulder|neck).*chest\s*pain/i,
      /heart\s*attack/i,
      /chest\s*pain.*(difficult|trouble|shortness).*breath/i,
      /(difficult|trouble|shortness).*breath.*chest\s*pain/i,
      /छाती\s*में\s*(तेज\s*)?दर्द/i,
      /छातीत\s*(तीव्र\s*)?(कळ|वेदना)/i
    ],
    severity: 'critical',
    guidanceText: 'Severe, crushing, or radiating chest pain especially combined with breathing difficulty is a critical cardiac emergency requiring immediate 112/108 response.'
  },

  // 2. RESPIRATORY DISTRESS (CRITICAL)
  {
    category: 'Acute Respiratory Distress',
    patterns: [
      /(difficulty\s*breathing|shortness\s*of\s*breath|breathlessness|trouble\s*breathing)/i,
      /(cannot|unable\s*to)\s*breathe/i,
      /gasping\s*for\s*(air|breath)/i,
      /bluish\s*(lips|face|nails)|cyanosis/i,
      /choking|stridor/i,
      /सांस\s*लेने\s*में\s*(तकलीफ|दिक्कत)/i,
      /श्वास\s*घेण्यास\s*त्रास/i,
      /दम\s*लागणे|दम\s*घुटने/i
    ],
    severity: 'critical',
    guidanceText: 'Inability to breathe comfortably, gasping, or bluish coloration of lips indicates acute airway compromise. Seek immediate emergency medical care.'
  },

  // 3. NEUROLOGICAL / SEIZURE / UNCONSCIOUSNESS (CRITICAL)
  {
    category: 'Neurological Emergency / Seizure / Unconsciousness',
    patterns: [
      /unconscious(ness)?/i,
      /(is|went|found)\s*(unresponsive|passed\s*out|fainted)/i,
      /seizure|convulsion|active\s*fits/i,
      /sudden\s*(weakness|numbness|paralysis)/i,
      /facial\s*droop|slurred\s*speech/i,
      /stroke\s*(signs|symptoms)/i,
      /दौरा\s*पड़ना|बेहोश|मूर्छित/i,
      /फिट्स|झटका|अर्धांगवायू/i
    ],
    severity: 'critical',
    guidanceText: 'Active seizures, loss of consciousness, sudden facial droop, or sudden one-sided body weakness require immediate hospital emergency triage.'
  },

  // 4. SEVERE BLEEDING / HEMORRHAGE (CRITICAL)
  {
    category: 'Severe Bleeding / Hemorrhage',
    patterns: [
      /(severe|uncontrolled|profuse)\s*bleeding/i,
      /vomiting\s*(fresh\s*)?blood|hematemesis/i,
      /coughing\s*up\s*(large\s*amounts\s*of\s*)?blood/i,
      /रक्ताच्या\s*उलट्या|खून\s*की\s*उल्टी/i
    ],
    severity: 'critical',
    guidanceText: 'Uncontrolled hemorrhage or vomiting blood carries a severe risk of hypovolemic shock. Contact 108/112 ambulance without delay.'
  },

  // 5. PSYCHIATRIC EMERGENCY / SELF-HARM (CRITICAL)
  {
    category: 'Crisis & Self-Harm Emergency',
    patterns: [
      /suicid(e|al)/i,
      /want\s*to\s*(kill|end)\s*myself/i,
      /end\s*my\s*life/i,
      /आत्महत्या/i,
      /जीव\s*देणे/i
    ],
    severity: 'critical',
    guidanceText: 'Compassionate help is available right now. Please call the National Tele-MANAS helpline at 14416 (or 1800-891-4416) or 112 immediately.'
  },

  // 6. HYPERTHERMIA / HEAT STROKE EMERGENCY (CRITICAL)
  {
    category: 'Extreme Hyperthermia / Heat Stroke',
    patterns: [
      /(104|105|106)\s*(degree|°|f).*confusion/i,
      /confusion.*(104|105|106)\s*(degree|°|f)/i,
      /heat\s*stroke\s*(with|and)\s*(delirium|unconscious|seizure)/i
    ],
    severity: 'critical',
    guidanceText: 'Body temperature exceeding 104°F combined with altered consciousness or confusion indicates life-threatening heat stroke. Emergency medical cooling is essential.'
  },

  // 7. CONCERNING MULTI-SYMPTOM COMBINATIONS (MODERATE WARNING)
  {
    category: 'Concerning Symptom Combination Requiring Clinical Evaluation',
    patterns: [
      /(fever|high\s*fever).*(persistent\s*vomiting|bleeding\s*gums|severe\s*abdominal\s*pain)/i,
      /(persistent\s*vomiting|bleeding\s*gums|severe\s*abdominal\s*pain).*(fever|high\s*fever)/i,
      /cough.*(>|more\s*than|over)?\s*(2|two)\s*weeks.*(blood|weight\s*loss)/i,
      /severe\s*dehydration.*(no\s*urine|sunken\s*eyes)/i
    ],
    severity: 'moderate',
    guidanceText: 'These symptoms represent warning indicators that require in-person clinical evaluation and diagnostic testing (such as complete blood count or sputum examination).'
  }
];

export function assessSafety(input: string): SafetyAssessment {
  const normalized = input.trim().toLowerCase();
  const matchedFlags: string[] = [];
  let highestSeverity: 'none' | 'moderate' | 'critical' = 'none';
  let primaryCategory = '';
  let guidance = '';

  for (const rule of SAFETY_RULES) {
    const isMatched = rule.patterns.some((pattern) => pattern.test(normalized));
    if (isMatched) {
      matchedFlags.push(rule.category);
      if (rule.severity === 'critical') {
        highestSeverity = 'critical';
        primaryCategory = rule.category;
        guidance = rule.guidanceText;
        break; // prioritize first critical match
      } else if (highestSeverity === 'none') {
        highestSeverity = 'moderate';
        primaryCategory = rule.category;
        guidance = rule.guidanceText;
      }
    }
  }

  const isEmergency = highestSeverity === 'critical';

  return {
    isEmergency,
    severity: highestSeverity,
    matchedRedFlags: matchedFlags,
    emergencyCategory: primaryCategory || undefined,
    guidanceText: guidance || (isEmergency
      ? 'Some symptoms you described may indicate a medical emergency. Please contact emergency services (112 / 108) or seek immediate hospital care.'
      : ''),
    recommendedHelplines: isEmergency ? EMERGENCY_HELPLINES : []
  };
}

export const safetyService = {
  assessSafety,
  EMERGENCY_HELPLINES
};
