import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Trash2,
  Eye,
  Plus,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { MedicalDocumentRecord } from '../../types';
import { apiClient } from '../../services/apiClient';

interface DocumentUploadTimelineProps {
  patientId: string;
  initialDocuments?: MedicalDocumentRecord[];
  onComplete: (documents: MedicalDocumentRecord[]) => void;
  onBack: () => void;
}

export const DocumentUploadTimeline: React.FC<DocumentUploadTimelineProps> = ({
  patientId,
  initialDocuments = [],
  onComplete,
  onBack
}) => {
  const [documents, setDocuments] = useState<MedicalDocumentRecord[]>(
    initialDocuments.length > 0 ? initialDocuments : []
  );
  const [isExtracting, setIsExtracting] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<MedicalDocumentRecord['documentType']>('Prescription');

  // Handle mock file upload & extraction
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsExtracting(true);

    try {
      const extracted = await apiClient.extractDocumentOCR(file.name, selectedDocType, patientId);
      setDocuments((prev) => [...prev, extracted]);
    } catch (err) {
      console.error('OCR extraction failed:', err);
    } finally {
      setIsExtracting(false);
      e.target.value = '';
    }
  };

  // Load standard SIH prototype demo documents
  const handleLoadDemoRecords = async () => {
    setIsExtracting(true);
    try {
      const doc1 = await apiClient.extractDocumentOCR(
        'Cardiology_Prescription_Fortis.pdf',
        'Prescription',
        patientId
      );
      doc1.documentDate = '2026-06-10';
      doc1.title = 'Cardiology Prescription - Fortis Escorts';

      const doc2 = await apiClient.extractDocumentOCR(
        'Complete_Blood_Count_PathLabs.pdf',
        'Lab Report',
        patientId
      );
      doc2.documentDate = '2026-08-22';
      doc2.title = 'Comprehensive Metabolic & Lipid Panel';
      doc2.extractedLabValues = [
        { testName: 'Fasting Blood Glucose', value: '158', unit: 'mg/dL', referenceRange: '70 - 100', status: 'Abnormal' },
        { testName: 'Hemoglobin (Hb)', value: '10.2', unit: 'g/dL', referenceRange: '13.0 - 17.0', status: 'Abnormal' },
        { testName: 'Serum Creatinine', value: '1.0', unit: 'mg/dL', referenceRange: '0.7 - 1.2', status: 'Normal' },
        { testName: 'Platelet Count', value: '92,000', unit: '/uL', referenceRange: '150,000 - 450,000', status: 'Critical' }
      ];

      const doc3 = await apiClient.extractDocumentOCR(
        'Discharge_Summary_CityHospital.pdf',
        'Discharge Summary',
        patientId
      );
      doc3.documentDate = '2025-11-14';
      doc3.title = 'Prior Inpatient Discharge Summary';
      doc3.ocrExtractedText =
        'ADMISSION REASON: Acute exacerbation of chronic bronchitis. Treated with bronchodilators and IV antibiotics. Discharged stable.';

      setDocuments([doc1, doc2, doc3]);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleRemoveDoc = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // Chronologically sorted documents (newest first)
  const sortedDocuments = [...documents].sort(
    (a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime()
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Upload Banner & Demo Loader */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-clinical-700 bg-clinical-50 px-2.5 py-0.5 rounded-full border border-clinical-200">
                Document Digitization & OCR
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Previous Medical Records & Lab Reports
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Upload past prescriptions, lab reports, or discharge summaries for automated chronological extraction.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLoadDemoRecords}
            disabled={isExtracting}
            className="self-start sm:self-auto px-4 py-2.5 bg-gradient-to-r from-health-600 to-clinical-600 hover:from-health-500 hover:to-clinical-500 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Load Demo Lab & Rx Records</span>
          </button>
        </div>

        {/* Upload Dropzone */}
        <div className="border-2 border-dashed border-slate-300 hover:border-health-500 rounded-2xl p-6 sm:p-8 text-center transition bg-slate-50/50">
          <UploadCloud className="w-10 h-10 text-health-600 mx-auto mb-2 animate-bounce-subtle" />
          <h4 className="text-sm font-bold text-slate-800">Drag & Drop or Choose Medical Document</h4>
          <p className="text-xs text-slate-500 mt-1">Supports PDF, PNG, JPG (Prescriptions, Lab tests, Discharge notes)</p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Document Type:</span>
            {(['Prescription', 'Lab Report', 'Discharge Summary', 'Imaging Report'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedDocType(t)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition ${
                  selectedDocType === t
                    ? 'bg-health-600 text-white border-health-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 hover:border-health-500 text-slate-800 text-xs font-bold rounded-xl cursor-pointer shadow-xs transition">
              <span>Select File from Device</span>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {isExtracting && (
          <div className="p-4 bg-health-50 border border-health-200 rounded-2xl flex items-center gap-3 animate-pulse">
            <div className="w-6 h-6 rounded-full border-2 border-health-600 border-t-transparent animate-spin" />
            <div className="text-xs text-health-900 font-bold">
              Extracting clinical text and parsing abnormal laboratory markers via OCR engine...
            </div>
          </div>
        )}
      </div>

      {/* Chronological Timeline Display */}
      {sortedDocuments.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h4 className="text-base font-extrabold text-slate-900">
                Chronological Medical Document Timeline ({sortedDocuments.length})
              </h4>
              <p className="text-xs text-slate-500">
                Organized by issuance date with automatic abnormal value highlighting
              </p>
            </div>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-bold">
              OCR Processed
            </span>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {sortedDocuments.map((doc) => (
              <div key={doc.id} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-health-500 border-4 border-white shadow-xs" />

                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3 hover:border-health-400 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-clinical-100 text-clinical-800">
                          {doc.documentType}
                        </span>
                        <h5 className="text-sm font-extrabold text-slate-900">{doc.title}</h5>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {doc.documentDate}
                        </span>
                        {doc.issuingInstitution && (
                          <span>• {doc.issuingInstitution}</span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveDoc(doc.id)}
                      className="text-slate-400 hover:text-red-600 p-1 self-end sm:self-center transition"
                      title="Remove document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Extracted Diagnosis or Medications */}
                  {doc.extractedDiagnosis && doc.extractedDiagnosis.length > 0 && (
                    <div className="text-xs">
                      <span className="font-bold text-slate-700">Extracted Diagnoses: </span>
                      <span className="text-slate-600">{doc.extractedDiagnosis.join(', ')}</span>
                    </div>
                  )}

                  {doc.extractedMedications && doc.extractedMedications.length > 0 && (
                    <div className="text-xs">
                      <span className="font-bold text-slate-700">Extracted Medications: </span>
                      <span className="text-slate-600">{doc.extractedMedications.join(' • ')}</span>
                    </div>
                  )}

                  {/* Abnormal Lab Values Highlighter */}
                  {doc.extractedLabValues && doc.extractedLabValues.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-200 space-y-2">
                      <span className="text-xs font-bold text-slate-700 block">
                        Extracted Laboratory Findings:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {doc.extractedLabValues.map((lab, lIdx) => (
                          <div
                            key={lIdx}
                            className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                              lab.status === 'Critical'
                                ? 'bg-red-50 border-red-300 text-red-900 font-bold'
                                : lab.status === 'Abnormal'
                                ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <div>
                              <span className="block font-bold">{lab.testName}</span>
                              <span className="text-[11px] opacity-75">
                                Normal: {lab.referenceRange} {lab.unit}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-black">
                                {lab.value} {lab.unit}
                              </span>
                              <span
                                className={`block text-[10px] uppercase font-extrabold ${
                                  lab.status === 'Critical'
                                    ? 'text-red-700'
                                    : lab.status === 'Abnormal'
                                    ? 'text-amber-700'
                                    : 'text-emerald-700'
                                }`}
                              >
                                {lab.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Nav */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Case Inquiry</span>
        </button>

        <button
          type="button"
          onClick={() => onComplete(documents)}
          className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-health-600 to-clinical-600 hover:from-health-500 hover:to-clinical-500 text-white text-xs font-extrabold rounded-xl shadow-md transition"
        >
          <span>Generate Structured Clinical Summary</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
