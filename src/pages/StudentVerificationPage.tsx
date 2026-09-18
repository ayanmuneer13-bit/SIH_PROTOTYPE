import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  ShieldCheck,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Lock,
  Award,
  ExternalLink
} from 'lucide-react';
import {
  StudentVerificationApplication,
  StudentVerificationDocument,
  VerificationStatus
} from '../types';
import { VerificationStepper } from '../components/verification/VerificationStepper';
import { CameraIdentityCheck } from '../components/verification/CameraIdentityCheck';
import { apiClient } from '../services/apiClient';

export const StudentVerificationPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Registration fields
  const [name, setName] = useState('Devendra Kumar Sharma');
  const [email, setEmail] = useState('devendra.sharma@aiims.edu');
  const [phone, setPhone] = useState('+91 98112 34567');
  const [college, setCollege] = useState('All India Institute of Medical Sciences (AIIMS)');
  const [course, setCourse] = useState('MBBS');
  const [year, setYear] = useState<StudentVerificationApplication['year']>('MBBS Final Year');
  const [studentIdNumber, setStudentIdNumber] = useState('AIIMS/MBBS/2021/048');
  const [bio, setBio] = useState('Passionate about community medicine and epidemic prevention awareness.');
  const [areasOfInterest, setAreasOfInterest] = useState<string[]>([
    'Community Medicine',
    'Infectious Diseases',
    'Vaccine Literacy'
  ]);

  // Step 2: Documents
  const [documents, setDocuments] = useState<StudentVerificationDocument[]>([
    {
      id: 'doc-college-id-1',
      docType: 'College_ID',
      fileName: 'AIIMS_Student_SmartCard_FrontBack.pdf',
      fileSize: '1.4 MB',
      uploadedAt: '2026-09-18 10:30'
    }
  ]);
  const [newDocType, setNewDocType] = useState<StudentVerificationDocument['docType']>('College_ID');

  // Step 3: Identity / Camera check
  const [selfieImage, setSelfieImage] = useState<string | null>(null);

  // Overall status
  const [overallStatus, setOverallStatus] = useState<VerificationStatus>('PENDING');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const newDoc: StudentVerificationDocument = {
      id: `doc-${Date.now()}`,
      docType: newDocType,
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadedAt: new Date().toISOString()
    };
    setDocuments((prev) => [...prev, newDoc]);
    e.target.value = '';
  };

  const handleRemoveDoc = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // Submit complete verification application
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    const newApp: StudentVerificationApplication = {
      id: applicationId || `verif-app-${Date.now()}`,
      studentId: `stu-${Date.now().toString().slice(-6)}`,
      name,
      email,
      phone,
      college,
      course,
      year,
      studentIdNumber,
      languages: ['English', 'Hindi'],
      areasOfInterest,
      bio,
      documents,
      identityCheck: {
        submitted: !!selfieImage,
        imageUrl: selfieImage || undefined,
        capturedAt: new Date().toISOString(),
        status: 'submitted_awaiting_verification'
      },
      overallStatus: 'PENDING',
      submittedAt: new Date().toISOString()
    };

    try {
      await apiClient.submitVerificationApplication(newApp);
      setApplicationId(newApp.id);
      setOverallStatus('PENDING');
      setCurrentStep(4);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Safety & Purpose Header */}
        <div className="bg-gradient-to-r from-health-800 via-clinical-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/10 text-health-200 text-xs font-bold border border-white/20">
              MedConnect Ecosystem Verification
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Medical Student Verification Portal</h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            MedConnect connects verified medical students with patients strictly for educational and supportive health literacy.
            Medical students are never presented as doctors and do NOT diagnose or prescribe. Complete this 5-step verification
            to earn your verified badge.
          </p>
        </div>

        {/* 5-Step Visual Stepper */}
        <VerificationStepper currentStep={currentStep} overallStatus={overallStatus} />

        {/* STEP 1: Registration */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-slate-900">Step 1 — Student Registration & Academic Profile</h3>
              <p className="text-xs text-slate-500">
                Enter your official enrollment credentials from your recognized medical college.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official College Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Medical College / Institution</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course / Degree</label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <option value="MBBS">MBBS (Bachelor of Medicine & Surgery)</option>
                  <option value="BAMS">BAMS (Ayurvedic Medicine & Surgery)</option>
                  <option value="BHMS">BHMS (Homeopathic Medicine & Surgery)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Academic Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <option value="MBBS 3rd Year">MBBS 3rd Year</option>
                  <option value="MBBS 4th Year">MBBS 4th Year</option>
                  <option value="MBBS Final Year">MBBS Final Year</option>
                  <option value="Intern Medical Student">Intern Medical Student</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Student Enrollment / Registration ID Number
                </label>
                <input
                  type="text"
                  value={studentIdNumber}
                  onChange={(e) => setStudentIdNumber(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2.5 bg-health-600 hover:bg-health-500 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <span>Continue to Step 2: Document Submission</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Document Submission */}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-slate-900">Step 2 — Institutional Document Submission</h3>
              <p className="text-xs text-slate-500">
                Upload your College ID card and Bonafide / Enrollment certificate for administrative audit.
              </p>
            </div>

            {/* Upload Selector */}
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50">
              <UploadCloud className="w-8 h-8 text-health-600 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-800">Choose Verification Proof to Upload</div>
              <div className="mt-3 flex justify-center gap-2">
                {(['College_ID', 'Enrollment_Certificate', 'Other_Institutional_Proof'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setNewDocType(t)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition ${
                      newDocType === t
                        ? 'bg-health-600 text-white border-health-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {t.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 text-slate-800 text-xs font-bold rounded-xl cursor-pointer shadow-xs hover:border-health-500 transition">
                  <span>Browse Document (PDF, JPG, PNG)</span>
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleDocumentUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Attached Documents List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Attached Documents ({documents.length}):</span>
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <div>
                    <span className="font-extrabold text-slate-900">{doc.fileName}</span>
                    <span className="text-slate-500 block text-[11px]">
                      {doc.docType.replace(/_/g, ' ')} • {doc.fileSize} • Uploaded {doc.uploadedAt}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveDoc(doc.id)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Back to Registration
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2.5 bg-health-600 hover:bg-health-500 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <span>Continue to Step 3: Camera Identity Check</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Camera / Identity Check */}
        {currentStep === 3 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-slate-900">Step 3 — Camera / Live Identity Verification</h3>
              <p className="text-xs text-slate-500">
                Capture a live selfie to prove identity alignment with your submitted student ID card.
              </p>
            </div>

            <CameraIdentityCheck
              existingImage={selfieImage || undefined}
              onCaptureComplete={(dataUrl) => setSelfieImage(dataUrl)}
            />

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Back to Documents
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={!selfieImage || isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-health-600 to-clinical-600 hover:from-health-500 hover:to-clinical-500 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <span>{isSubmitting ? 'Submitting Application...' : 'Submit for Institutional Review'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Institutional Review Pending */}
        {currentStep === 4 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto animate-pulse">
              <Clock className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase">
                Status: Verification Pending
              </span>
              <h3 className="text-2xl font-black text-slate-900">Application Submitted for Institutional Review</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Verification may take 3–4 working days. An authorized verification committee member will examine
                your submitted documents and live photograph before approving your profile.
              </p>
            </div>

            {/* Quick Demo Simulator CTA for Jury Evaluation */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-lg mx-auto text-xs text-slate-600 space-y-3">
              <div className="flex items-center justify-center gap-1.5 font-bold text-slate-800">
                <span>SIH Hackathon Evaluation Shortcut:</span>
              </div>
              <p>
                As an evaluator, you can open the Admin Dashboard to review and approve this pending application.
              </p>
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition"
              >
                <span>Go to Admin Dashboard to Review Application</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
