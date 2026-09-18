import {
  ClinicalCaseSummary,
  MedicalStudent,
  StudentVerificationApplication,
  OPDQueueRecord,
  MedicalDocumentRecord
} from '../types';
import { MEDICAL_STUDENTS } from '../data/medConnectData';
import { SYNTHETIC_OPD_DATASET } from '../ml/dataset';

const STORAGE_KEYS = {
  INTAKES: 'medikiosk_intakes_v1',
  STUDENT_VERIFICATIONS: 'medconnect_verifications_v1',
  VERIFIED_STUDENTS: 'medconnect_verified_students_v1',
  OPD_QUEUE: 'medikiosk_opd_queue_v1',
  TALK_REQUESTS: 'medconnect_talk_requests_v1'
};

// Initial sample verification applications for SIH prototype demo
const INITIAL_VERIFICATION_APPLICATIONS: StudentVerificationApplication[] = [
  {
    id: 'verif-app-101',
    studentId: 'stu-aiims-2023',
    name: 'Devendra Kumar Sharma',
    email: 'devendra.sharma@aiims.edu',
    phone: '+91 98112 34567',
    college: 'All India Institute of Medical Sciences (AIIMS)',
    course: 'MBBS',
    year: 'MBBS Final Year',
    studentIdNumber: 'AIIMS/MBBS/2021/048',
    languages: ['Hindi', 'English'],
    areasOfInterest: ['Community Medicine', 'Infectious Disease Control'],
    bio: 'Active public health volunteer focusing on seasonal outbreak awareness.',
    documents: [
      {
        id: 'doc-id-101',
        docType: 'College_ID',
        fileName: 'aiims_student_id_front.jpg',
        fileSize: '1.4 MB',
        uploadedAt: '2026-09-17 14:30'
      },
      {
        id: 'doc-bonafide-101',
        docType: 'Enrollment_Certificate',
        fileName: 'bonafide_certificate_dean_office.pdf',
        fileSize: '2.1 MB',
        uploadedAt: '2026-09-17 14:32'
      }
    ],
    identityCheck: {
      submitted: true,
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256',
      capturedAt: '2026-09-17 14:35',
      status: 'submitted_awaiting_verification',
      deviceInfo: 'Webcam 1080p Chrome Windows'
    },
    overallStatus: 'PENDING',
    submittedAt: '2026-09-17 14:36'
  },
  {
    id: 'verif-app-102',
    studentId: 'stu-kem-2022',
    name: 'Sayali Kulkarni',
    email: 'sayali.k@kem.edu',
    phone: '+91 97654 11223',
    college: 'Seth GS Medical College & KEM Hospital',
    course: 'MBBS',
    year: 'MBBS 4th Year',
    studentIdNumber: 'KEM/UG/2022/112',
    languages: ['Marathi', 'Hindi', 'English'],
    areasOfInterest: ['Pediatrics', 'Maternal Nutrition'],
    bio: 'Passionate about adolescent health education in municipal schools.',
    documents: [
      {
        id: 'doc-id-102',
        docType: 'College_ID',
        fileName: 'kem_student_smartcard.png',
        fileSize: '1.8 MB',
        uploadedAt: '2026-09-16 11:20'
      }
    ],
    identityCheck: {
      submitted: true,
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256',
      capturedAt: '2026-09-16 11:24',
      status: 'submitted_awaiting_verification'
    },
    overallStatus: 'UNDER_REVIEW',
    submittedAt: '2026-09-16 11:25',
    reviewedAt: '2026-09-17 10:15',
    reviewerName: 'Dr. Ramesh Nair (Academic Dean Verification Committee)'
  },
  {
    id: 'verif-app-103',
    studentId: 'stu-bjmc-2024',
    name: 'Pooja Hegde',
    email: 'pooja.h@bjgmc.edu',
    phone: '+91 94220 88990',
    college: 'B.J. Government Medical College & Sassoon General Hospital',
    course: 'MBBS',
    year: 'MBBS 3rd Year',
    studentIdNumber: 'BJMC/MBBS/2023/074',
    languages: ['Kannada', 'Marathi', 'English', 'Hindi'],
    areasOfInterest: ['Preventive Cardiology', 'Geriatric Care'],
    bio: 'Assists in geriatric primary health clinics in semi-urban Pune.',
    documents: [
      {
        id: 'doc-id-103',
        docType: 'College_ID',
        fileName: 'bjmc_id_card.pdf',
        fileSize: '950 KB',
        uploadedAt: '2026-09-15 09:12'
      }
    ],
    identityCheck: {
      submitted: true,
      imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256&h=256',
      capturedAt: '2026-09-15 09:15',
      status: 'verified'
    },
    overallStatus: 'MORE_INFORMATION_REQUIRED',
    submittedAt: '2026-09-15 09:16',
    reviewedAt: '2026-09-16 14:00',
    reviewerName: 'Admin Registrar',
    rejectionReason: 'College ID card is blurred and expiration date is not legible. Please upload a clear photo of front and back.'
  }
];

// Pre-seeded clinical intake summaries for SIH evaluation demonstration
const INITIAL_CLINICAL_INTAKES: ClinicalCaseSummary[] = [
  {
    id: 'intake-sih-001',
    tokenNumber: 42,
    patient: {
      id: 'pat-901',
      abhaId: '91-4829-1029-4820',
      uhid: 'UHID-2026-0941',
      fullName: 'Rameshwar Prasad Gupta',
      age: 58,
      gender: 'Male',
      phone: '+91 98230 45671',
      preferredLanguage: 'hi',
      ayushMode: true,
      consentGiven: true,
      consentTimestamp: '2026-09-18 09:15'
    },
    intakeTimestamp: '2026-09-18 09:20',
    chiefComplaint: {
      symptom: 'Retrosternal chest heaviness and breathlessness on climbing stairs',
      duration: '4 days, worsened this morning',
      severity: 8,
      notes: 'Patient feels band-like tightness radiating towards left shoulder.'
    },
    hpi: {
      onset: 'Sudden',
      character: 'Constricting, pressure-like sensation',
      radiation: 'Radiates to left shoulder and jaw',
      aggravatingFactors: ['Mild exertion', 'Climbing stairs', 'Heavy meal'],
      relievingFactors: ['Rest (partial relief)'],
      associatedSymptoms: ['Cold diaphoresis (sweating)', 'Mild nausea', 'Dizziness'],
      progression: 'Worsening'
    },
    pmhx: {
      conditions: ['Essential Hypertension (12 yrs)', 'Type 2 Diabetes Mellitus (8 yrs)'],
      durationYears: '12 years',
      isControlled: false,
      notes: 'Last HbA1c was 8.4% 3 months ago.'
    },
    pshx: {
      procedures: [{ name: 'Appendectomy', year: '2011', complications: 'None' }]
    },
    drugHistory: {
      currentMedications: [
        { name: 'Tab Telmisartan 40mg', dosage: '1 tab OD', compliance: 'Regular' },
        { name: 'Tab Metformin 500mg', dosage: '1 tab BD', compliance: 'Regular' },
        { name: 'Tab Atorvastatin 20mg', dosage: '1 tab HS', compliance: 'Irregular' }
      ]
    },
    allergyHistory: {
      allergies: [
        { substance: 'Diclofenac / NSAIDs', reaction: 'Gastric epigastric burning & rash', severity: 'Moderate' }
      ]
    },
    familyHistory: {
      conditions: ['Premature Coronary Artery Disease', 'Diabetes Mellitus'],
      affectedMembers: ['Father died of myocardial infarction at age 52', 'Brother has CAD']
    },
    personalHistory: {
      diet: 'Vegetarian',
      smoking: 'Former',
      alcohol: 'Never',
      physicalActivity: 'Sedentary',
      sleepHours: 6,
      occupation: 'Accountant'
    },
    ros: {
      general: ['Fatigue', 'Profuse sweating'],
      cardiovascular: ['Chest heaviness', 'Palpitations on exertion'],
      respiratory: ['Shortness of breath on mild exertion'],
      gastrointestinal: ['Mild nausea', 'No vomiting'],
      neurological: ['Mild dizziness', 'No syncope'],
      musculoskeletal: ['No joint pain'],
      genitourinary: ['No dysuria']
    },
    ayushHistory: {
      enabled: true,
      prakritiAssessment: 'Pitta-Kapha',
      homeRemedies: ['Arjuna bark decoction (taking since 2 weeks on advice of neighbor)'],
      ayurvedicFormulations: ['Lashunadi Vati'],
      yogaPractices: ['Pranayama in morning']
    },
    triage: {
      priority: 'P1_CRITICAL',
      priorityLabel: 'P1 - Emergency',
      reasons: [
        'Acute retrosternal chest pain radiating to left shoulder and jaw',
        'Accompanied by diaphoresis and acute shortness of breath in a high-risk diabetic hypertensive patient'
      ],
      detectedRedFlags: ['Severe chest discomfort radiating to left arm/jaw', 'Cold diaphoresis', 'Acute breathlessness'],
      recommendedAction: 'Immediate ECG and emergency physician evaluation (Stat Cardiology Triage).'
    },
    documents: [
      {
        id: 'doc-prev-rx-1',
        patientId: 'pat-901',
        documentType: 'Prescription',
        title: 'Dr. Mehta Clinic - Cardiology Follow-up',
        documentDate: '2026-06-12',
        issuingInstitution: 'Fortis Escorts Heart Center',
        fileName: 'prescription_june_2026.pdf',
        fileSize: '1.1 MB',
        ocrExtractedText: 'Dx: HTN, T2DM. Advised: Telmisartan 40mg, Metformin 500mg. Lipid profile: LDL 142 mg/dL.',
        extractedDiagnosis: ['Hypertension', 'T2DM', 'Dyslipidemia'],
        extractedMedications: ['Telmisartan 40mg OD', 'Metformin 500mg BD', 'Atorvastatin 20mg HS'],
        uploadedAt: '2026-09-18 09:22'
      },
      {
        id: 'doc-prev-lab-1',
        patientId: 'pat-901',
        documentType: 'Lab Report',
        title: 'Comprehensive Metabolic Panel',
        documentDate: '2026-08-20',
        issuingInstitution: 'Dr. Lal PathLabs',
        fileName: 'lipid_glucose_report.pdf',
        fileSize: '840 KB',
        ocrExtractedText: 'Fasting Blood Glucose: 162 mg/dL. HbA1c: 8.4%. Total Cholesterol: 228 mg/dL. Serum Creatinine: 1.1 mg/dL.',
        extractedLabValues: [
          { testName: 'Fasting Blood Sugar', value: '162', unit: 'mg/dL', referenceRange: '70 - 100', status: 'Abnormal' },
          { testName: 'HbA1c', value: '8.4', unit: '%', referenceRange: '< 5.7', status: 'Abnormal' },
          { testName: 'Total Cholesterol', value: '228', unit: 'mg/dL', referenceRange: '< 200', status: 'Abnormal' },
          { testName: 'Serum Creatinine', value: '1.1', unit: 'mg/dL', referenceRange: '0.7 - 1.2', status: 'Normal' }
        ],
        uploadedAt: '2026-09-18 09:23'
      }
    ],
    physicianReview: {
      isConfirmed: false,
      clinicalNotes: 'Awaiting ECG and Troponin I. Draft intake verified by MediKiosk AI.'
    }
  }
];

export const storageService = {
  // --- Clinical Intakes ---
  getIntakes(): ClinicalCaseSummary[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.INTAKES);
      if (raw) return JSON.parse(raw);
    } catch {
      // Fallback
    }
    return INITIAL_CLINICAL_INTAKES;
  },

  getIntakeById(id: string): ClinicalCaseSummary | undefined {
    return this.getIntakes().find((i) => i.id === id);
  },

  saveIntake(intake: ClinicalCaseSummary): void {
    const list = this.getIntakes();
    const existingIdx = list.findIndex((i) => i.id === intake.id);
    if (existingIdx >= 0) {
      list[existingIdx] = intake;
    } else {
      list.unshift(intake);
    }
    try {
      localStorage.setItem(STORAGE_KEYS.INTAKES, JSON.stringify(list));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  updatePhysicianReview(id: string, review: Partial<ClinicalCaseSummary['physicianReview']>): ClinicalCaseSummary | undefined {
    const list = this.getIntakes();
    const intake = list.find((i) => i.id === id);
    if (!intake) return undefined;

    intake.physicianReview = {
      ...intake.physicianReview,
      ...review,
      isConfirmed: true,
      reviewedAt: new Date().toISOString()
    };
    this.saveIntake(intake);
    return intake;
  },

  // --- Student Verifications ---
  getVerificationApplications(): StudentVerificationApplication[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.STUDENT_VERIFICATIONS);
      if (raw) return JSON.parse(raw);
    } catch {
      // Fallback
    }
    return INITIAL_VERIFICATION_APPLICATIONS;
  },

  getVerificationApplicationById(id: string): StudentVerificationApplication | undefined {
    return this.getVerificationApplications().find((a) => a.id === id);
  },

  saveVerificationApplication(app: StudentVerificationApplication): void {
    const list = this.getVerificationApplications();
    const idx = list.findIndex((a) => a.id === app.id);
    if (idx >= 0) {
      list[idx] = app;
    } else {
      list.unshift(app);
    }
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENT_VERIFICATIONS, JSON.stringify(list));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  updateVerificationStatus(
    id: string,
    status: StudentVerificationApplication['overallStatus'],
    reviewer: string,
    reason?: string,
    adminNotes?: string
  ): StudentVerificationApplication | undefined {
    const list = this.getVerificationApplications();
    const app = list.find((a) => a.id === id);
    if (!app) return undefined;

    app.overallStatus = status;
    app.reviewedAt = new Date().toISOString();
    app.reviewerName = reviewer;
    if (reason) app.rejectionReason = reason;
    if (adminNotes) app.adminNotes = adminNotes;

    if (status === 'VERIFIED') {
      app.identityCheck.status = 'verified';
      // Automatically add or verify the student in the public MedConnect directory
      this.promoteStudentToVerified(app);
    }

    this.saveVerificationApplication(app);
    return app;
  },

  // --- MedConnect Verified Students Directory ---
  getVerifiedStudents(): MedicalStudent[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.VERIFIED_STUDENTS);
      if (raw) return JSON.parse(raw);
    } catch {
      // Fallback
    }
    return MEDICAL_STUDENTS;
  },

  promoteStudentToVerified(app: StudentVerificationApplication): void {
    const students = this.getVerifiedStudents();
    const existing = students.find((s) => s.id === app.studentId || s.name.toLowerCase() === app.name.toLowerCase());
    if (existing) {
      existing.verified = true;
    } else {
      students.unshift({
        id: app.studentId || `student-${Date.now()}`,
        name: app.name,
        avatar: app.identityCheck.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256',
        college: app.college,
        city: 'New Delhi',
        state: 'Delhi',
        year: app.year,
        languages: app.languages.length > 0 ? app.languages : ['English', 'Hindi'],
        areasOfInterest: app.areasOfInterest.length > 0 ? app.areasOfInterest : ['Community Health'],
        verified: true,
        availability: 'Available Today',
        bio: app.bio || `Medical student at ${app.college}.`,
        sessionsCompleted: 1,
        rating: 5.0
      });
    }
    try {
      localStorage.setItem(STORAGE_KEYS.VERIFIED_STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  // --- Talk Requests ---
  saveTalkRequest(studentId: string, patientName: string, reason: string, phone: string) {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.TALK_REQUESTS) || '[]');
      existing.unshift({
        id: `req-${Date.now()}`,
        studentId,
        patientName,
        reason,
        phone,
        timestamp: new Date().toISOString(),
        status: 'Pending Student Confirmation'
      });
      localStorage.setItem(STORAGE_KEYS.TALK_REQUESTS, JSON.stringify(existing));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }
};
