import {
  OPDQueueInput,
  WaitingTimePrediction,
  ClinicalCaseSummary,
  StudentVerificationApplication,
  VerificationStatus,
  PhysicianReviewData,
  MedicalDocumentRecord
} from '../types';
import { opdWaitingTimeModel } from '../ml';
import { storageService } from './storageService';

const BACKEND_BASE_URL = 'http://localhost:5001/api';

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 1200): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export const apiClient = {
  /**
   * Predict OPD Waiting Time via KNN
   */
  async predictWaitingTime(input: OPDQueueInput): Promise<WaitingTimePrediction> {
    try {
      const res = await fetchWithTimeout(`${BACKEND_BASE_URL}/queue/predict-wait-time`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Backend offline or timed out, seamlessly use client KNN engine
    }
    // Genuine KNN model execution in browser
    return opdWaitingTimeModel.predict(input);
  },

  /**
   * Submit or save clinical intake
   */
  async submitIntake(intake: ClinicalCaseSummary): Promise<ClinicalCaseSummary> {
    storageService.saveIntake(intake);
    try {
      await fetchWithTimeout(`${BACKEND_BASE_URL}/intake/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(intake)
      });
    } catch {
      // Offline fallback already stored in localStorage
    }
    return intake;
  },

  /**
   * Retrieve all clinical intakes
   */
  async getIntakes(): Promise<ClinicalCaseSummary[]> {
    return storageService.getIntakes();
  },

  /**
   * Physician signs off on clinical summary
   */
  async confirmPhysicianReview(
    id: string,
    review: Partial<PhysicianReviewData>
  ): Promise<ClinicalCaseSummary | undefined> {
    const updated = storageService.updatePhysicianReview(id, review);
    try {
      await fetchWithTimeout(`${BACKEND_BASE_URL}/intake/${id}/physician-review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
      });
    } catch {
      // Handled locally
    }
    return updated;
  },

  /**
   * OCR extraction simulation for uploaded medical records
   */
  async extractDocumentOCR(
    fileName: string,
    documentType: MedicalDocumentRecord['documentType'],
    patientId: string
  ): Promise<MedicalDocumentRecord> {
    const isLab = documentType === 'Lab Report';
    const isRx = documentType === 'Prescription';

    // Tailor realistic clinical extraction based on document type
    const record: MedicalDocumentRecord = {
      id: `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      patientId,
      documentType,
      title: `${documentType} - ${fileName.replace(/\.[^/.]+$/, '')}`,
      documentDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      issuingInstitution: isLab ? 'PathCare Diagnostics & Labs' : 'City Multispecialty Hospital OPD',
      fileName,
      fileSize: '1.2 MB',
      ocrExtractedText: isLab
        ? `AUTOMATED LAB OCR SCAN: Complete Blood Count & Metabolic Panel. Fasting Plasma Glucose elevated. Serum Creatinine within normal range.`
        : `CLINICAL PRESCRIPTION SCAN: Rx Tab Telmisartan 40mg OD, Tab Metformin 500mg BD. Advised regular blood pressure monitoring.`,
      extractedDiagnosis: isLab
        ? ['Impaired Fasting Glucose', 'Mild Microcytic Anemia']
        : ['Essential Hypertension Stage 1', 'Type 2 Diabetes Follow-up'],
      extractedMedications: isRx
        ? ['Telmisartan 40mg (1 OD morning)', 'Metformin 500mg (1 BD after meals)', 'Atorvastatin 10mg (1 HS night)']
        : [],
      extractedLabValues: isLab
        ? [
            {
              testName: 'Fasting Blood Glucose',
              value: '148',
              unit: 'mg/dL',
              referenceRange: '70 - 100',
              status: 'Abnormal'
            },
            {
              testName: 'Hemoglobin (Hb)',
              value: '10.8',
              unit: 'g/dL',
              referenceRange: '13.0 - 17.0',
              status: 'Abnormal'
            },
            {
              testName: 'Platelet Count',
              value: '195,000',
              unit: '/uL',
              referenceRange: '150,000 - 450,000',
              status: 'Normal'
            },
            {
              testName: 'Serum Creatinine',
              value: '0.9',
              unit: 'mg/dL',
              referenceRange: '0.7 - 1.2',
              status: 'Normal'
            }
          ]
        : undefined,
      uploadedAt: new Date().toISOString()
    };

    return record;
  },

  /**
   * Student verification submissions
   */
  async submitVerificationApplication(
    app: StudentVerificationApplication
  ): Promise<StudentVerificationApplication> {
    storageService.saveVerificationApplication(app);
    try {
      await fetchWithTimeout(`${BACKEND_BASE_URL}/students/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(app)
      });
    } catch {
      // Local fallback
    }
    return app;
  },

  async getVerificationApplications(): Promise<StudentVerificationApplication[]> {
    return storageService.getVerificationApplications();
  },

  async updateVerificationStatus(
    id: string,
    status: VerificationStatus,
    reviewer: string,
    reason?: string,
    adminNotes?: string
  ): Promise<StudentVerificationApplication | undefined> {
    const res = storageService.updateVerificationStatus(id, status, reviewer, reason, adminNotes);
    try {
      await fetchWithTimeout(`${BACKEND_BASE_URL}/admin/verifications/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reviewerName: reviewer, rejectionReason: reason, adminNotes })
      });
    } catch {
      // Local fallback
    }
    return res;
  },

  /**
   * MedConnect Talk Request
   */
  async requestTalk(
    studentId: string,
    patientName: string,
    reason: string,
    phone: string
  ): Promise<{ success: boolean }> {
    storageService.saveTalkRequest(studentId, patientName, reason, phone);
    try {
      await fetchWithTimeout(`${BACKEND_BASE_URL}/medconnect/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, patientName, reason, phone })
      });
    } catch {
      // Local fallback
    }
    return { success: true };
  }
};
