import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ShieldCheck, Clock, FileText, Sparkles, CheckCircle2 } from 'lucide-react';
import {
  PatientIdentification,
  ClinicalCaseSummary,
  MedicalDocumentRecord
} from '../types';
import { DemographicsModal } from '../components/kiosk/DemographicsModal';
import { CaseTakingWizard } from '../components/kiosk/CaseTakingWizard';
import { DocumentUploadTimeline } from '../components/kiosk/DocumentUploadTimeline';
import { ClinicalSummaryView } from '../components/kiosk/ClinicalSummaryView';
import { apiClient } from '../services/apiClient';

type KioskStage = 'demographics' | 'inquiry' | 'documents' | 'summary';

export const MediKioskPage: React.FC = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<KioskStage>('demographics');

  const [patient, setPatient] = useState<PatientIdentification | null>(null);
  const [caseInquiryData, setCaseInquiryData] = useState<any>(null);
  const [documents, setDocuments] = useState<MedicalDocumentRecord[]>([]);
  const [summary, setSummary] = useState<ClinicalCaseSummary | null>(null);

  // 1. Demographics completed
  const handleDemographicsComplete = (pat: PatientIdentification) => {
    setPatient(pat);
    setStage('inquiry');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 2. Case inquiry completed
  const handleInquiryComplete = (caseData: any) => {
    setCaseInquiryData(caseData);
    setStage('documents');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 3. Documents completed -> Generate Structured Summary
  const handleDocumentsComplete = async (uploadedDocs: MedicalDocumentRecord[]) => {
    setDocuments(uploadedDocs);
    if (!patient || !caseInquiryData) return;

    const assignedToken = Math.floor(Math.random() * 40) + 30; // e.g. 42
    const completeSummary: ClinicalCaseSummary = {
      id: `intake-${Date.now()}`,
      tokenNumber: assignedToken,
      patient,
      intakeTimestamp: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      chiefComplaint: caseInquiryData.chiefComplaint,
      hpi: caseInquiryData.hpi,
      pmhx: caseInquiryData.pmhx,
      pshx: caseInquiryData.pshx,
      drugHistory: caseInquiryData.drugHistory,
      allergyHistory: caseInquiryData.allergyHistory,
      familyHistory: caseInquiryData.familyHistory,
      personalHistory: caseInquiryData.personalHistory,
      ros: caseInquiryData.ros,
      ayushHistory: caseInquiryData.ayushHistory,
      triage: caseInquiryData.triage,
      documents: uploadedDocs,
      physicianReview: {
        isConfirmed: false,
        clinicalNotes: 'Draft clinical case-taking captured via MediKiosk AI. Awaiting attending physician sign-off.'
      }
    };

    // Save to storage and API
    await apiClient.submitIntake(completeSummary);
    setSummary(completeSummary);
    setStage('summary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 4. Proceed to Queue Estimator
  const handleProceedToQueue = (tokenNum: number) => {
    navigate(`/queue?token=${tokenNum}&dept=General%20Medicine`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumb Tracker */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-xs font-bold text-slate-600">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-health-50 text-health-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-900 font-extrabold text-sm block">MediKiosk Case-Taking</span>
              <span className="text-[11px] text-slate-500 font-medium">
                SIH Problem Statement SIH26047
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full ${
                stage === 'demographics'
                  ? 'bg-health-600 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              1. Check-in & Consent
            </span>
            <span>→</span>
            <span
              className={`px-3 py-1 rounded-full ${
                stage === 'inquiry' ? 'bg-health-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              2. Clinical Inquiry
            </span>
            <span>→</span>
            <span
              className={`px-3 py-1 rounded-full ${
                stage === 'documents' ? 'bg-health-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              3. Document OCR
            </span>
            <span>→</span>
            <span
              className={`px-3 py-1 rounded-full ${
                stage === 'summary' ? 'bg-health-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              4. Clinical Summary
            </span>
          </div>
        </div>

        {/* Stage 1: Demographics & Consent */}
        {stage === 'demographics' && (
          <DemographicsModal onComplete={handleDemographicsComplete} />
        )}

        {/* Stage 2: Case Taking Inquiry Wizard */}
        {stage === 'inquiry' && patient && (
          <CaseTakingWizard
            patient={patient}
            onComplete={handleInquiryComplete}
            onBackToDemographics={() => setStage('demographics')}
          />
        )}

        {/* Stage 3: Document Upload & OCR Timeline */}
        {stage === 'documents' && patient && (
          <DocumentUploadTimeline
            patientId={patient.id}
            initialDocuments={documents}
            onComplete={handleDocumentsComplete}
            onBack={() => setStage('inquiry')}
          />
        )}

        {/* Stage 4: Structured Physician-Ready Summary */}
        {stage === 'summary' && summary && (
          <ClinicalSummaryView
            summary={summary}
            onProceedToQueue={handleProceedToQueue}
            onUpdateSummary={(updated) => setSummary(updated)}
          />
        )}
      </div>
    </div>
  );
};
