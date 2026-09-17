export type SupportedLanguage = 'en' | 'hi' | 'mr';

export interface DiseaseSource {
  name: string;
  url: string;
  organization: 'WHO' | 'MoHFW' | 'CDC' | 'ICMR' | 'NDMA';
  lastReviewed: string;
}

export interface DiseaseKnowledge {
  id: string;
  name: string;
  localNames: {
    hi: string;
    mr: string;
  };
  category: 'vector-borne' | 'respiratory' | 'chronic' | 'environmental' | 'gastrointestinal';
  overview: string;
  commonSymptoms: string[];
  redFlagSymptoms: string[];
  prevention: string[];
  selfCareAndPrecautions: string[];
  whenToSeekImmediateCare: string[];
  sources: DiseaseSource[];
  keywords: string[];
}

export interface Helpline {
  name: string;
  number: string;
  description: string;
  type: 'national' | 'ambulance' | 'poison' | 'mental_health';
}

export interface SafetyAssessment {
  isEmergency: boolean;
  severity: 'none' | 'moderate' | 'critical';
  matchedRedFlags: string[];
  emergencyCategory?: string;
  guidanceText: string;
  recommendedHelplines: Helpline[];
}

export interface RetrievalGrounding {
  primaryTopic: string;
  confidenceScore: number;
  matchedIndicators: string[];
  differentialTopics: string[];
  isAmbiguous: boolean;
  whatToMonitor: string[];
  groundingNotice: string;
  isGroundedInLocalKb: boolean;
}

export interface StructuredAIResponse {
  summary: string;
  importantPoints: string[];
  prevention: string[];
  whatToMonitor?: string[];
  whenToSeekCare: string[];
  sources: DiseaseSource[];
  nonDiagnosticDisclaimer: string;
  retrievalGrounding?: RetrievalGrounding;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  language: SupportedLanguage;
  isEmergencyAlert?: boolean;
  safetyAssessment?: SafetyAssessment;
  structuredResponse?: StructuredAIResponse;
  suggestedFollowUps?: string[];
}

export interface MedicalStudent {
  id: string;
  name: string;
  avatar: string;
  college: string;
  city: string;
  state: string;
  year: 'MBBS 3rd Year' | 'MBBS 4th Year' | 'MBBS Final Year' | 'Intern Medical Student';
  languages: string[];
  areasOfInterest: string[];
  verified: boolean;
  availability: 'Available Today' | 'Next Slot: 2 hrs' | 'Evening Clinic' | 'Tomorrow';
  bio: string;
  sessionsCompleted: number;
  rating: number;
}

export interface DashboardMetric {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  description: string;
}
