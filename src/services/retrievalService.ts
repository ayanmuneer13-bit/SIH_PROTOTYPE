import { HEALTH_KNOWLEDGE_BASE } from '../data/healthKnowledge';
import { DiseaseKnowledge, DiseaseSource, RetrievalGrounding } from '../types';

export interface HallmarkRule {
  diseaseId: string;
  weight: number;
  pattern: RegExp;
  indicatorLabel: string;
  isDistinctive: boolean;
}

export const CLINICAL_HALLMARKS: HallmarkRule[] = [
  // --- DENGUE FEVER ---
  {
    diseaseId: 'dengue',
    weight: 70,
    pattern: /pain\s*behind\s*(the\s*|my\s*)?eyes?|eye\s*pain|behind\s*(the\s*)?eyes?\s*pain|retro[- ]orbital/i,
    indicatorLabel: 'Pain behind the eyes (Retro-orbital pain)',
    isDistinctive: true
  },
  {
    diseaseId: 'dengue',
    weight: 45,
    pattern: /severe\s*headache/i,
    indicatorLabel: 'Severe frontal headache',
    isDistinctive: false
  },
  {
    diseaseId: 'dengue',
    weight: 40,
    pattern: /breakbone|break\s*bone|(severe\s*)?(joint|muscle)\s*pain|body\s*ache/i,
    indicatorLabel: 'Severe joint and muscle aches (Breakbone presentation)',
    isDistinctive: false
  },
  {
    diseaseId: 'dengue',
    weight: 35,
    pattern: /(high\s*)?fever/i,
    indicatorLabel: 'High sudden fever',
    isDistinctive: false
  },
  {
    diseaseId: 'dengue',
    weight: 60,
    pattern: /platelet(s)?|dengue|ns1|aedes|डेंग्यू|डेंगू/i,
    indicatorLabel: 'Dengue specific terminology / Platelets',
    isDistinctive: true
  },

  // --- MALARIA ---
  {
    diseaseId: 'malaria',
    weight: 65,
    pattern: /(shaking\s*)?chills|rigor(s)?|cold\s*stage/i,
    indicatorLabel: 'Periodic shaking chills and rigor',
    isDistinctive: true
  },
  {
    diseaseId: 'malaria',
    weight: 45,
    pattern: /(profuse\s*)?sweat(ing|s)?/i,
    indicatorLabel: 'Profuse sweating as fever breaks',
    isDistinctive: true
  },
  {
    diseaseId: 'malaria',
    weight: 70,
    pattern: /periodic\s*fever|cyclical\s*fever|fever\s*with\s*(chills|rigors?)/i,
    indicatorLabel: 'Cyclical fever with chills',
    isDistinctive: true
  },
  {
    diseaseId: 'malaria',
    weight: 60,
    pattern: /malaria|anopheles|plasmodium|vivax|falciparum|मलेरिया|हिवताप/i,
    indicatorLabel: 'Malaria specific terminology',
    isDistinctive: true
  },

  // --- TUBERCULOSIS (TB) ---
  {
    diseaseId: 'tuberculosis',
    weight: 70,
    pattern: /cough.*(2|two|\>2|\> 2)\s*weeks?|cough.*(more\s*than|over)\s*(2|two)\s*weeks|cough.*2\s*weeks|persistent\s*cough/i,
    indicatorLabel: 'Persistent cough lasting more than 2 weeks',
    isDistinctive: true
  },
  {
    diseaseId: 'tuberculosis',
    weight: 65,
    pattern: /cough(ing)?\s*(up\s*)?blood|hemoptysis|blood\s*in\s*sputum|sputum/i,
    indicatorLabel: 'Blood in sputum (Hemoptysis)',
    isDistinctive: true
  },
  {
    diseaseId: 'tuberculosis',
    weight: 40,
    pattern: /night\s*sweats|unexplained\s*weight\s*loss/i,
    indicatorLabel: 'Drenching night sweats and weight loss',
    isDistinctive: true
  },
  {
    diseaseId: 'tuberculosis',
    weight: 60,
    pattern: /tb|tuberculosis|nikshay|क्षयरोग|तपेदिक/i,
    indicatorLabel: 'TB specific terminology',
    isDistinctive: true
  },

  // --- TYPE 2 DIABETES ---
  {
    diseaseId: 'diabetes',
    weight: 55,
    pattern: /(excessive|extreme|constant)\s*thirst|polydipsia|thirsty\s*all\s*the\s*time/i,
    indicatorLabel: 'Excessive thirst (Polydipsia)',
    isDistinctive: true
  },
  {
    diseaseId: 'diabetes',
    weight: 55,
    pattern: /(frequent|increased)\s*urination|polyuria|urinat(ing|e)\s*often|peeing\s*a\s*lot/i,
    indicatorLabel: 'Frequent urination (Polyuria)',
    isDistinctive: true
  },
  {
    diseaseId: 'diabetes',
    weight: 80,
    pattern: /(thirst.*urination|urination.*thirst|thirst.*peeing|peeing.*thirst)/i,
    indicatorLabel: 'Combined excessive thirst & frequent urination',
    isDistinctive: true
  },
  {
    diseaseId: 'diabetes',
    weight: 60,
    pattern: /diabetes|blood\s*sugar|glucose|hba1c|insulin|मधुमेह/i,
    indicatorLabel: 'Diabetes specific terminology',
    isDistinctive: true
  },

  // --- HYPERTENSION ---
  {
    diseaseId: 'hypertension',
    weight: 65,
    pattern: /(high\s*)?blood\s*pressure|high\s*bp|hypertension|bp\s*>|140\/90|180\/120|उच्च\s*रक्तचाप|रक्तदाब/i,
    indicatorLabel: 'Elevated blood pressure measurements',
    isDistinctive: true
  },
  {
    diseaseId: 'hypertension',
    weight: 45,
    pattern: /silent\s*killer|occipital\s*headache|headache\s*back\s*of\s*head/i,
    indicatorLabel: 'Occipital morning headaches / Silent killer symptoms',
    isDistinctive: true
  },

  // --- HEAT STROKE ---
  {
    diseaseId: 'heat-stroke',
    weight: 65,
    pattern: /heat\s*stroke|heatwave|sunstroke|hyperthermia|लू|उष्माघात/i,
    indicatorLabel: 'Heatwave / Extreme heat exposure',
    isDistinctive: true
  },
  {
    diseaseId: 'heat-stroke',
    weight: 55,
    pattern: /104\s*(degree|°|f)|hot\s*dry\s*skin|lack\s*of\s*sweat/i,
    indicatorLabel: 'High core temperature (104°F) with hot dry skin',
    isDistinctive: true
  },

  // --- FOOD POISONING ---
  {
    diseaseId: 'food-poisoning',
    weight: 65,
    pattern: /food\s*poisoning|foodborne|gastroenteritis|फूड\s*पॉइजनिंग/i,
    indicatorLabel: 'Food poisoning / Foodborne infection history',
    isDistinctive: true
  },
  {
    diseaseId: 'food-poisoning',
    weight: 60,
    pattern: /(vomiting\s*(and|&)\s*diarrhea|diarrhea\s*(and|&)\s*vomiting|loose\s*motion.*vomit|उल्टी.*दस्त)/i,
    indicatorLabel: 'Concurrent acute vomiting and diarrhea',
    isDistinctive: true
  },

  // --- SEASONAL INFLUENZA (FLU) ---
  {
    diseaseId: 'influenza',
    weight: 65,
    pattern: /(seasonal\s*)?flu|influenza|h3n2|h1n1|फ्लू/i,
    indicatorLabel: 'Seasonal Influenza / Flu clinical pattern',
    isDistinctive: true
  },
  {
    diseaseId: 'influenza',
    weight: 50,
    pattern: /(sore\s*throat.*cough|cough.*sore\s*throat|runny\s*nose.*fever|fever.*runny\s*nose)/i,
    indicatorLabel: 'Upper respiratory constellation (sore throat, cough, runny nose)',
    isDistinctive: true
  }
];

export interface RetrievalResult {
  matchedDiseases: DiseaseKnowledge[];
  topDisease: DiseaseKnowledge | null;
  confidenceScore: number;
  sources: DiseaseSource[];
  grounding: RetrievalGrounding;
}

export function searchKnowledgeBase(query: string): RetrievalResult {
  const normalizedQuery = query.toLowerCase().trim();

  // 1. Evaluate Clinical Hallmarks
  const scoreMap: Record<string, number> = {};
  const matchedIndicatorsMap: Record<string, string[]> = {};
  const hasDistinctiveMap: Record<string, boolean> = {};

  for (const rule of CLINICAL_HALLMARKS) {
    if (rule.pattern.test(normalizedQuery)) {
      scoreMap[rule.diseaseId] = (scoreMap[rule.diseaseId] || 0) + rule.weight;
      if (!matchedIndicatorsMap[rule.diseaseId]) {
        matchedIndicatorsMap[rule.diseaseId] = [];
      }
      if (!matchedIndicatorsMap[rule.diseaseId].includes(rule.indicatorLabel)) {
        matchedIndicatorsMap[rule.diseaseId].push(rule.indicatorLabel);
      }
      if (rule.isDistinctive) {
        hasDistinctiveMap[rule.diseaseId] = true;
      }
    }
  }

  // 2. Co-occurrence synergy bonuses
  // Dengue: fever + headache + pain behind eyes
  if (
    /pain\s*behind\s*(the\s*|my\s*)?eyes?|eye\s*pain|retro[- ]orbital/i.test(normalizedQuery) &&
    /fever/i.test(normalizedQuery)
  ) {
    scoreMap['dengue'] = (scoreMap['dengue'] || 0) + 40;
  }
  if (
    /pain\s*behind\s*(the\s*|my\s*)?eyes?|eye\s*pain/i.test(normalizedQuery) &&
    /headache/i.test(normalizedQuery)
  ) {
    scoreMap['dengue'] = (scoreMap['dengue'] || 0) + 25;
  }

  // Malaria: fever + chills
  if (/fever/i.test(normalizedQuery) && /chills|rigor/i.test(normalizedQuery)) {
    scoreMap['malaria'] = (scoreMap['malaria'] || 0) + 40;
  }

  // 3. Fallback scoring from full knowledge documents
  HEALTH_KNOWLEDGE_BASE.forEach((doc) => {
    // Direct name match
    if (normalizedQuery.includes(doc.name.toLowerCase())) {
      scoreMap[doc.id] = (scoreMap[doc.id] || 0) + 50;
    }
    if (
      normalizedQuery.includes(doc.localNames.hi.toLowerCase()) ||
      normalizedQuery.includes(doc.localNames.mr.toLowerCase())
    ) {
      scoreMap[doc.id] = (scoreMap[doc.id] || 0) + 50;
    }

    // Exact keyword checks (whole word/token)
    doc.keywords.forEach((kw) => {
      const escaped = kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      if (regex.test(normalizedQuery)) {
        scoreMap[doc.id] = (scoreMap[doc.id] || 0) + 20;
      }
    });
  });

  // Sort matched diseases by score
  const ranked = Object.entries(scoreMap)
    .map(([diseaseId, score]) => {
      const doc = HEALTH_KNOWLEDGE_BASE.find((d) => d.id === diseaseId)!;
      return { doc, score, indicators: matchedIndicatorsMap[diseaseId] || [] };
    })
    .filter((item) => item.score >= 25)
    .sort((a, b) => b.score - a.score);

  const topMatch = ranked.length > 0 ? ranked[0] : null;

  // Calculate normalized confidence score (0 - 100)
  let confidenceScore = 0;
  if (topMatch) {
    confidenceScore = Math.min(98, Math.max(30, Math.round((topMatch.score / 130) * 100)));
  }

  // Ambiguity check: if top score is close to second score, or if query is a symptom list without explicit disease name
  const isDirectDiseaseInquiry = HEALTH_KNOWLEDGE_BASE.some((d) =>
    normalizedQuery.includes(d.name.toLowerCase()) ||
    normalizedQuery.includes(d.localNames.hi.toLowerCase()) ||
    normalizedQuery.includes(d.localNames.mr.toLowerCase())
  );

  const isAmbiguous = !isDirectDiseaseInquiry && (ranked.length > 1 || confidenceScore < 85);

  // Build differential topics list
  const differentialTopics: string[] = [];
  if (topMatch) {
    differentialTopics.push(topMatch.doc.name);
    // Add other close matches or relevant differentials
    ranked.slice(1, 3).forEach((r) => {
      if (!differentialTopics.includes(r.doc.name)) {
        differentialTopics.push(r.doc.name);
      }
    });

    // Clinically relevant companion differentials if not present
    if (topMatch.doc.id === 'dengue') {
      if (!differentialTopics.includes('Viral Fever / Chikungunya')) differentialTopics.push('Viral Fever / Chikungunya');
      if (!differentialTopics.includes('Malaria')) differentialTopics.push('Malaria');
    } else if (topMatch.doc.id === 'malaria') {
      if (!differentialTopics.includes('Dengue Fever')) differentialTopics.push('Dengue Fever');
      if (!differentialTopics.includes('Typhoid / Enteric Fever')) differentialTopics.push('Typhoid / Enteric Fever');
    }
  }

  // Extract what to monitor
  const whatToMonitor: string[] = topMatch ? topMatch.doc.redFlagSymptoms.slice(0, 4) : [
    'Persistent fever lasting more than 3 days',
    'Severe vomiting or inability to keep fluids down',
    'Shortness of breath, chest pain, or marked lethargy'
  ];

  // Aggregate sources
  const sources: DiseaseSource[] = [];
  const addedUrls = new Set<string>();

  if (topMatch) {
    topMatch.doc.sources.forEach((src) => {
      if (!addedUrls.has(src.url)) {
        addedUrls.add(src.url);
        sources.push(src);
      }
    });
  }

  // Add primary MoHFW & WHO generic sources if list is small
  if (sources.length === 0) {
    sources.push({
      name: 'World Health Organization (WHO) Disease Guidelines',
      url: 'https://www.who.int/health-topics',
      organization: 'WHO',
      lastReviewed: '2024-06-15'
    });
    sources.push({
      name: 'Ministry of Health & Family Welfare (MoHFW) Citizen Portal',
      url: 'https://mohfw.gov.in',
      organization: 'MoHFW',
      lastReviewed: '2024-07-01'
    });
  }

  const grounding: RetrievalGrounding = {
    primaryTopic: topMatch ? topMatch.doc.name : 'General Symptom Awareness',
    confidenceScore,
    matchedIndicators: topMatch ? topMatch.indicators : ['General non-specific symptoms'],
    differentialTopics: differentialTopics.slice(0, 3),
    isAmbiguous,
    whatToMonitor,
    groundingNotice: 'Retrieved from local verified clinical knowledge base (WHO & MoHFW protocols). No unverified web search performed.',
    isGroundedInLocalKb: true
  };

  return {
    matchedDiseases: ranked.map((r) => r.doc),
    topDisease: topMatch ? topMatch.doc : null,
    confidenceScore,
    sources,
    grounding
  };
}
