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

// ==========================================
// MEDIKIOSK CLINICAL HISTORY & CASE-TAKING TYPES (SIH26047)
// ==========================================

export interface PatientIdentification {
  id: string;
  abhaId?: string;
  uhid?: string;
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  preferredLanguage: SupportedLanguage;
  ayushMode: boolean;
  consentGiven: boolean;
  consentTimestamp: string;
}

export interface ChiefComplaint {
  symptom: string;
  duration: string;
  severity: number; // 1-10
  notes?: string;
}

export interface HistoryOfPresentIllness {
  onset: 'Sudden' | 'Gradual' | 'Insidious';
  character: string;
  radiation?: string;
  aggravatingFactors: string[];
  relievingFactors: string[];
  associatedSymptoms: string[];
  progression: 'Improving' | 'Worsening' | 'Static' | 'Fluctuating';
}

export interface PastMedicalHistory {
  conditions: string[];
  durationYears?: string;
  isControlled: boolean;
  notes?: string;
}

export interface PastSurgicalHistory {
  procedures: {
    name: string;
    year?: string;
    complications?: string;
  }[];
}

export interface DrugHistory {
  currentMedications: {
    name: string;
    dosage?: string;
    frequency?: string;
    compliance: 'Regular' | 'Irregular' | 'Stopped';
  }[];
}

export interface AllergyHistory {
  allergies: {
    substance: string;
    reaction: string;
    severity: 'Mild' | 'Moderate' | 'Severe';
  }[];
}

export interface FamilyHistory {
  conditions: string[];
  affectedMembers: string[];
  notes?: string;
}

export interface PersonalHistory {
  diet: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Eggetarian';
  smoking: 'Never' | 'Former' | 'Current';
  alcohol: 'Never' | 'Occasional' | 'Regular';
  physicalActivity: 'Sedentary' | 'Moderate' | 'Active';
  sleepHours: number;
  occupation?: string;
}

export interface ReviewOfSystems {
  general: string[];
  cardiovascular: string[];
  respiratory: string[];
  gastrointestinal: string[];
  neurological: string[];
  musculoskeletal: string[];
  genitourinary: string[];
}

export interface AyushHistory {
  enabled: boolean;
  prakritiAssessment?: 'Vata' | 'Pitta' | 'Kapha' | 'Vata-Pitta' | 'Pitta-Kapha' | 'Tridosha';
  homeRemedies?: string[];
  ayurvedicFormulations?: string[];
  homeopathicRemedies?: string[];
  unaniSiddhaNotes?: string;
  yogaPractices?: string[];
}

export interface FollowUpQuestion {
  id: string;
  question: string;
  category: string;
  answer?: string;
  inputType: 'text' | 'choice' | 'yesno';
  options?: string[];
}

export type TriagePriority = 'P1_CRITICAL' | 'P2_URGENT' | 'P3_ROUTINE';

export interface ClinicalTriage {
  priority: TriagePriority;
  priorityLabel: 'P1 - Emergency' | 'P2 - Urgent Priority' | 'P3 - Routine OPD';
  reasons: string[];
  detectedRedFlags: string[];
  recommendedAction: string;
}

export interface ExtractedLabValue {
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'Normal' | 'Abnormal' | 'Critical';
}

export interface MedicalDocumentRecord {
  id: string;
  patientId: string;
  documentType: 'Prescription' | 'Lab Report' | 'Discharge Summary' | 'Imaging Report' | 'Other';
  title: string;
  documentDate: string;
  issuingInstitution?: string;
  fileName: string;
  fileSize?: string;
  fileUrl?: string;
  ocrExtractedText: string;
  extractedDiagnosis?: string[];
  extractedMedications?: string[];
  extractedLabValues?: ExtractedLabValue[];
  uploadedAt: string;
}

export interface PhysicianReviewData {
  isConfirmed: boolean;
  reviewedAt?: string;
  physicianName?: string;
  registrationNumber?: string;
  clinicalNotes?: string;
  diagnosticImpressions?: string[];
  recommendedInvestigations?: string[];
}

export interface ClinicalCaseSummary {
  id: string;
  patient: PatientIdentification;
  intakeTimestamp: string;
  chiefComplaint: ChiefComplaint;
  hpi: HistoryOfPresentIllness;
  pmhx: PastMedicalHistory;
  pshx: PastSurgicalHistory;
  drugHistory: DrugHistory;
  allergyHistory: AllergyHistory;
  familyHistory: FamilyHistory;
  personalHistory: PersonalHistory;
  ros: ReviewOfSystems;
  ayushHistory: AyushHistory;
  triage: ClinicalTriage;
  documents: MedicalDocumentRecord[];
  physicianReview: PhysicianReviewData;
  tokenNumber?: number;
}

// ==========================================
// OPD QUEUE & WAITING TIME ESTIMATION (KNN ML)
// ==========================================

export interface OPDQueueRecord {
  id: string;
  tokenNumber: number;
  patientsAhead: number;
  queueSize: number;
  department: string;
  doctorName: string;
  doctorExperience: number;
  dayOfWeek: string;
  timeSlot: string;
  avgConsultMinutes: number;
  historicalAvgWait: number;
  actualWaitMinutes: number;
}

export interface OPDQueueInput {
  tokenNumber: number;
  department: string;
  patientsAhead: number;
  queueSize: number;
  dayOfWeek?: string;
  timeSlot?: string;
  doctorExperience?: number;
  doctorName?: string;
}

export interface KNNNeighbor {
  id: string;
  department: string;
  tokenNumber: number;
  patientsAhead: number;
  distance: number;
  actualWaitMinutes: number;
}

export interface WaitingTimePrediction {
  tokenNumber: number;
  department: string;
  patientsAhead: number;
  queueSize: number;
  estimatedWaitMinutes: number;
  lowerBound: number;
  upperBound: number;
  confidence: 'high' | 'moderate' | 'low';
  similarCasesFound: number;
  nearestNeighbors: KNNNeighbor[];
  isFallback: boolean;
  disclaimer: string;
}

// ==========================================
// MEDCONNECT STUDENT VERIFICATION TYPES
// ==========================================

export type VerificationStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'REJECTED'
  | 'MORE_INFORMATION_REQUIRED';

export interface StudentVerificationDocument {
  id: string;
  docType: 'College_ID' | 'Enrollment_Certificate' | 'Other_Institutional_Proof';
  fileName: string;
  fileSize: string;
  fileUrl?: string;
  uploadedAt: string;
}

export interface IdentityCheckRecord {
  submitted: boolean;
  imageUrl?: string;
  capturedAt?: string;
  status: 'submitted_awaiting_verification' | 'verified' | 'failed';
  deviceInfo?: string;
}

export interface StudentVerificationApplication {
  id: string;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  course: string;
  year: 'MBBS 3rd Year' | 'MBBS 4th Year' | 'MBBS Final Year' | 'Intern Medical Student';
  studentIdNumber: string;
  languages: string[];
  areasOfInterest: string[];
  bio: string;
  documents: StudentVerificationDocument[];
  identityCheck: IdentityCheckRecord;
  overallStatus: VerificationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewerName?: string;
  rejectionReason?: string;
  adminNotes?: string;
}
