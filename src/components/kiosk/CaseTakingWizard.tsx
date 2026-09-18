import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Mic,
  MicOff,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldAlert,
  Activity,
  HeartPulse,
  Pill,
  Clock,
  Info
} from 'lucide-react';
import {
  PatientIdentification,
  ChiefComplaint,
  HistoryOfPresentIllness,
  PastMedicalHistory,
  PastSurgicalHistory,
  DrugHistory,
  AllergyHistory,
  FamilyHistory,
  PersonalHistory,
  ReviewOfSystems,
  AyushHistory,
  ClinicalTriage
} from '../../types';
import { safetyService } from '../../services/safetyService';

interface CaseTakingWizardProps {
  patient: PatientIdentification;
  onComplete: (caseData: {
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
  }) => void;
  onBackToDemographics: () => void;
}

export const CaseTakingWizard: React.FC<CaseTakingWizardProps> = ({
  patient,
  onComplete,
  onBackToDemographics
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Form states
  // 1. Chief Complaint
  const [symptom, setSymptom] = useState('Severe chest pressure and difficulty breathing on climbing stairs');
  const [duration, setDuration] = useState('4 days, worsened since morning');
  const [severity, setSeverity] = useState(8);

  // 2. HPI
  const [onset, setOnset] = useState<HistoryOfPresentIllness['onset']>('Sudden');
  const [character, setCharacter] = useState('Constricting, heavy squeezing pressure');
  const [radiation, setRadiation] = useState('Radiating towards left shoulder, neck, and jaw');
  const [aggravating, setAggravating] = useState<string[]>(['Climbing stairs', 'Walking fast']);
  const [relieving, setRelieving] = useState<string[]>(['Sitting still', 'Rest']);
  const [progression, setProgression] = useState<HistoryOfPresentIllness['progression']>('Worsening');

  // 3. Past Medical History
  const [medicalConditions, setMedicalConditions] = useState<string[]>([
    'Essential Hypertension (10+ yrs)',
    'Type 2 Diabetes Mellitus'
  ]);
  const [pmhxNotes, setPmhxNotes] = useState('Takes regular morning antihypertensive and metformin');

  // 4. Past Surgical History
  const [surgeries, setSurgeries] = useState<string[]>(['Appendectomy (2012)']);

  // 5. Drug History
  const [medications, setMedications] = useState<string[]>([
    'Tab Telmisartan 40mg (1 OD)',
    'Tab Metformin 500mg (1 BD)'
  ]);

  // 6. Allergy History
  const [allergies, setAllergies] = useState<string[]>(['Diclofenac / NSAIDs (Causes severe stomach burning)']);

  // 7. Family History
  const [familyConditions, setFamilyConditions] = useState<string[]>([
    'Father had heart attack (CAD) at age 52',
    'Mother has Type 2 Diabetes'
  ]);

  // 8. Personal History
  const [diet, setDiet] = useState<PersonalHistory['diet']>('Vegetarian');
  const [smoking, setSmoking] = useState<PersonalHistory['smoking']>('Former');
  const [alcohol, setAlcohol] = useState<PersonalHistory['alcohol']>('Never');
  const [sleepHours, setSleepHours] = useState(6);

  // 9. Review of Systems
  const [rosSelected, setRosSelected] = useState<string[]>([
    'Cold diaphoresis (excessive sweating)',
    'Shortness of breath (Dyspnea)',
    'Mild dizziness / lightheadedness'
  ]);

  // 10. AYUSH
  const [prakriti, setPrakriti] = useState<AyushHistory['prakritiAssessment']>('Pitta-Kapha');
  const [homeRemedies, setHomeRemedies] = useState<string[]>([
    'Arjuna bark kashayam / decoction (taken for 2 weeks on friend advice)',
    'Warm ginger turmeric milk'
  ]);
  const [ayushMeds, setAyushMeds] = useState<string[]>(['Lashunadi Vati']);

  // Speech Recognition & TTS States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Real-time Red-Flag Triage assessment
  const [triage, setTriage] = useState<ClinicalTriage>({
    priority: 'P3_ROUTINE',
    priorityLabel: 'P3 - Routine OPD',
    reasons: [],
    detectedRedFlags: [],
    recommendedAction: 'Standard OPD consultation.'
  });

  // Calculate red-flag triage whenever symptom, HPI, or ROS changes
  useEffect(() => {
    const combinedNarrative = `${symptom} ${character} ${radiation} ${aggravating.join(' ')} ${rosSelected.join(' ')}`;
    const assessment = safetyService.assessSafety(combinedNarrative);

    if (assessment.isEmergency && assessment.severity === 'critical') {
      setTriage({
        priority: 'P1_CRITICAL',
        priorityLabel: 'P1 - Emergency',
        reasons: [
          'High risk emergency symptoms identified by real-time safety triage',
          assessment.guidanceText
        ],
        detectedRedFlags: assessment.matchedRedFlags,
        recommendedAction: 'Immediate triage to emergency resuscitation or Stat ECG / Cardiology.'
      });
    } else if (assessment.severity === 'moderate' || severity >= 8) {
      setTriage({
        priority: 'P2_URGENT',
        priorityLabel: 'P2 - Urgent Priority',
        reasons: ['Acute high-severity pain or urgent clinical indicators present'],
        detectedRedFlags: assessment.matchedRedFlags.length > 0 ? assessment.matchedRedFlags : ['High pain score (≥8/10)'],
        recommendedAction: 'Expedited physician consultation within 15–30 minutes.'
      });
    } else {
      setTriage({
        priority: 'P3_ROUTINE',
        priorityLabel: 'P3 - Routine OPD',
        reasons: ['Stable clinical profile suitable for routine outpatient consultation'],
        detectedRedFlags: [],
        recommendedAction: 'Proceed with scheduled OPD queue consultation.'
      });
    }
  }, [symptom, character, radiation, aggravating, rosSelected, severity]);

  // Steps configuration
  const steps = [
    {
      id: 'chief-complaint',
      title: 'Chief Complaint',
      subtitle: 'What primary health symptom brought you here today?',
      audioPromptEn: 'Please tell us what primary symptoms you are experiencing today and for how many days.',
      audioPromptHi: 'कृपया बताएं कि आज आपको क्या मुख्य परेशानी या लक्षण महसूस हो रहे हैं और कितने दिनों से हैं।'
    },
    {
      id: 'hpi',
      title: 'History of Present Illness (HPI)',
      subtitle: 'Details on onset, sensation, spreading, and what makes it better or worse.',
      audioPromptEn: 'How did the symptom begin, what does it feel like, and does it spread to any other part of your body?',
      audioPromptHi: 'यह लक्षण कैसे शुरू हुआ, कैसा दर्द या तकलीफ है, और क्या यह शरीर के किसी अन्य हिस्से में फैलता है?'
    },
    {
      id: 'pmhx-pshx',
      title: 'Past Medical & Surgical History',
      subtitle: 'Existing chronic conditions or previous operations.',
      audioPromptEn: 'Do you have long-term conditions such as diabetes, high blood pressure, asthma, or previous surgeries?',
      audioPromptHi: 'क्या आपको पहले से उच्च रक्तचाप, मधुमेह, दमा या किसी पुरानी सर्जरी की शिकायत है?'
    },
    {
      id: 'drugs-allergies',
      title: 'Drug & Allergy History',
      subtitle: 'Current medicines and any known drug or food allergies.',
      audioPromptEn: 'What daily medications do you take, and have you ever had any allergic reaction to medicines?',
      audioPromptHi: 'आप रोज़ाना कौन सी दवाएं लेते हैं, और क्या आपको किसी दवा से एलर्जी या साइड इफ़ेक्ट होता है?'
    },
    {
      id: 'family-personal',
      title: 'Family & Personal History',
      subtitle: 'Family health patterns, dietary habits, tobacco/smoking, and sleep.',
      audioPromptEn: 'Does any disease run in your family, and what are your dietary or smoking habits?',
      audioPromptHi: 'क्या परिवार में किसी को दिल की बीमारी या शुगर है, और आपके खान-पान और दिनचर्या के बारे में बताएं।'
    },
    {
      id: 'ros',
      title: 'Review of Systems (ROS)',
      subtitle: 'Quick check of other associated body signals.',
      audioPromptEn: 'Have you noticed any sweating, dizziness, vomiting, palpitations, or cough?',
      audioPromptHi: 'क्या आपको पसीना, चक्कर आना, जी मिचलाना, धड़कन तेज होना या खांसी जैसी कोई अन्य समस्या है?'
    },
    ...(patient.ayushMode
      ? [
          {
            id: 'ayush',
            title: 'AYUSH & Traditional Care Mode',
            subtitle: 'Home remedies, herbal preparations, and lifestyle practices.',
            audioPromptEn: 'Are you taking any Ayurvedic formulations, home kadha, or homeopathic medicines?',
            audioPromptHi: 'क्या आप कोई आयुर्वेदिक काढ़ा, घरेलू नुस्खे या होम्योपैथिक दवा ले रहे हैं?'
          }
        ]
      : [])
  ];

  const currentStep = steps[currentStepIndex];

  // Text to Speech
  const speakPrompt = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const textToSpeak =
      patient.preferredLanguage === 'hi'
        ? currentStep.audioPromptHi
        : currentStep.audioPromptEn;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = patient.preferredLanguage === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Speech Recognition
  const toggleListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use keyboard or touch input.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang =
        patient.preferredLanguage === 'hi'
          ? 'hi-IN'
          : patient.preferredLanguage === 'mr'
          ? 'mr-IN'
          : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (currentStep.id === 'chief-complaint') {
          setSymptom((prev) => (prev ? `${prev}. ${transcript}` : transcript));
        } else if (currentStep.id === 'hpi') {
          setCharacter((prev) => (prev ? `${prev}. ${transcript}` : transcript));
        } else if (currentStep.id === 'pmhx-pshx') {
          setPmhxNotes((prev) => (prev ? `${prev}. ${transcript}` : transcript));
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Speech recognition error:', e);
      setIsListening(false);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Complete intake
      const caseData = {
        chiefComplaint: {
          symptom,
          duration,
          severity
        },
        hpi: {
          onset,
          character,
          radiation,
          aggravatingFactors: aggravating,
          relievingFactors: relieving,
          associatedSymptoms: rosSelected,
          progression
        },
        pmhx: {
          conditions: medicalConditions,
          durationYears: '10+ years',
          isControlled: false,
          notes: pmhxNotes
        },
        pshx: {
          procedures: surgeries.map((s) => ({ name: s }))
        },
        drugHistory: {
          currentMedications: medications.map((m) => ({
            name: m,
            compliance: 'Regular' as const
          }))
        },
        allergyHistory: {
          allergies: allergies.map((a) => ({
            substance: a,
            reaction: 'Documented clinical sensitivity',
            severity: 'Moderate' as const
          }))
        },
        familyHistory: {
          conditions: familyConditions,
          affectedMembers: ['First-degree relatives']
        },
        personalHistory: {
          diet,
          smoking,
          alcohol,
          physicalActivity: 'Sedentary' as const,
          sleepHours
        },
        ros: {
          general: rosSelected.filter((r) => r.includes('sweating') || r.includes('Fatigue')),
          cardiovascular: rosSelected.filter((r) => r.includes('Chest') || r.includes('Palpitations')),
          respiratory: rosSelected.filter((r) => r.includes('breath') || r.includes('cough')),
          gastrointestinal: rosSelected.filter((r) => r.includes('nausea') || r.includes('vomit')),
          neurological: rosSelected.filter((r) => r.includes('dizziness') || r.includes('headache')),
          musculoskeletal: [],
          genitourinary: []
        },
        ayushHistory: {
          enabled: patient.ayushMode,
          prakritiAssessment: prakriti,
          homeRemedies,
          ayurvedicFormulations: ayushMeds
        },
        triage
      };
      onComplete(caseData);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    } else {
      onBackToDemographics();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Triage Priority Banner (Updates Dynamically) */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          triage.priority === 'P1_CRITICAL'
            ? 'bg-red-50 border-red-300 text-red-900 shadow-sm animate-pulse-subtle'
            : triage.priority === 'P2_URGENT'
            ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                triage.priority === 'P1_CRITICAL'
                  ? 'bg-red-600 text-white'
                  : triage.priority === 'P2_URGENT'
                  ? 'bg-amber-500 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm uppercase tracking-wider">
                  Real-time Safety Triage:
                </span>
                <span
                  className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                    triage.priority === 'P1_CRITICAL'
                      ? 'bg-red-200 text-red-900 border border-red-300'
                      : triage.priority === 'P2_URGENT'
                      ? 'bg-amber-200 text-amber-900 border border-amber-300'
                      : 'bg-emerald-200 text-emerald-900 border border-emerald-300'
                  }`}
                >
                  {triage.priorityLabel}
                </span>
              </div>
              <p className="text-xs mt-0.5 opacity-90">{triage.recommendedAction}</p>
            </div>
          </div>
          {triage.priority === 'P1_CRITICAL' && (
            <span className="hidden sm:inline-block px-3 py-1 bg-red-600 text-white font-bold text-xs rounded-xl shadow-xs">
              Emergency Stat
            </span>
          )}
        </div>
      </div>

      {/* Main Stepper Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Step Progress Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between mb-2 text-xs font-bold text-slate-700">
            <span>
              Clinical Inquiry Step {currentStepIndex + 1} of {steps.length}: {currentStep.title}
            </span>
            <span className="text-health-700 font-extrabold">
              {Math.round(((currentStepIndex + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-health-500 to-clinical-500 transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Header & Speech Tools */}
        <div className="p-6 sm:p-8 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">{currentStep.title}</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">{currentStep.subtitle}</p>
          </div>

          {/* Audio Playback & Speech Input Buttons (Accessibility for Elderly/Low-Literacy) */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={speakPrompt}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
                isSpeaking
                  ? 'bg-health-100 border-health-400 text-health-800 animate-pulse'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title="Listen to question (Audio Assistant)"
            >
              <Volume2 className="w-4 h-4 text-health-600" />
              <span>{isSpeaking ? 'Playing...' : 'Read Aloud'}</span>
            </button>

            <button
              type="button"
              onClick={toggleListening}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
                isListening
                  ? 'bg-red-500 border-red-600 text-white animate-bounce'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title="Speak your symptoms into microphone"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-clinical-600" />}
              <span>{isListening ? 'Listening...' : 'Voice Input'}</span>
            </button>
          </div>
        </div>

        {/* Step Body Form Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* STEP 1: Chief Complaint */}
          {currentStep.id === 'chief-complaint' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Primary Symptom / Chief Complaint <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  placeholder="Describe what is bothering you..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-health-500 focus:bg-white transition"
                />
              </div>

              {/* Large Touch Quick-Select Chips */}
              <div>
                <span className="block text-xs font-bold text-slate-600 mb-2">
                  Quick Touch Chips (Common OPD Complaints):
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Chest pain / pressure',
                    'Severe breathlessness',
                    'High fever with chills',
                    'Persistent cough > 2 weeks',
                    'Severe headache & dizziness',
                    'Acute stomach pain & vomiting',
                    'Joint pain & stiffness',
                    'Burning urination'
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setSymptom((prev) => (prev ? `${prev}, ${chip}` : chip))}
                      className="px-3 py-2 bg-slate-100 hover:bg-health-50 hover:text-health-800 hover:border-health-300 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Duration of Symptoms
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 3 days, 2 weeks, sudden onset"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-health-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pain / Discomfort Severity (Score: {severity}/10)
                  </label>
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={severity}
                      onChange={(e) => setSeverity(Number(e.target.value))}
                      className="w-full accent-health-600 cursor-pointer"
                    />
                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-lg ${
                        severity >= 8
                          ? 'bg-red-100 text-red-700'
                          : severity >= 5
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {severity}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: History of Present Illness (HPI) */}
          {currentStep.id === 'hpi' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Onset Mode</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Sudden', 'Gradual', 'Insidious'] as const).map((o) => (
                      <button
                        key={o}
                        type="button"
                        onClick={() => setOnset(o)}
                        className={`py-2 text-xs font-bold rounded-xl border transition ${
                          onset === o
                            ? 'bg-health-600 text-white border-health-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Progression</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['Worsening', 'Improving', 'Static', 'Fluctuating'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setProgression(p)}
                        className={`py-2 text-[11px] font-bold rounded-xl border transition ${
                          progression === p
                            ? 'bg-clinical-600 text-white border-clinical-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Character of Pain / Sensation
                </label>
                <input
                  type="text"
                  value={character}
                  onChange={(e) => setCharacter(e.target.value)}
                  placeholder="e.g. Squeezing, throbbing, sharp stabbing, dull ache"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-health-500 focus:bg-white transition"
                />
              </div>

              {/* Dynamic Follow-Up Prompt for Chest / Pain cases */}
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>AI Dynamic Follow-Up Question:</span>
                </div>
                <p className="text-xs text-teal-800">
                  "Does the discomfort spread to your left shoulder, arm, back, neck, or jaw?"
                </p>
                <input
                  type="text"
                  value={radiation}
                  onChange={(e) => setRadiation(e.target.value)}
                  placeholder="e.g. Radiates to left arm and shoulder"
                  className="w-full p-2.5 bg-white border border-teal-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Aggravating Factors (What makes it worse?)
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Physical exertion', 'Walking / climbing', 'Heavy meals', 'Lying down flat', 'Cold weather'].map(
                    (f) => {
                      const active = aggravating.includes(f);
                      return (
                        <button
                          key={f}
                          type="button"
                          onClick={() =>
                            setAggravating((prev) =>
                              active ? prev.filter((x) => x !== f) : [...prev, f]
                            )
                          }
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                            active
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {active ? '✓ ' : '+ '}
                          {f}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Past Medical & Surgical History */}
          {currentStep.id === 'pmhx-pshx' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Known Chronic Medical Conditions
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Essential Hypertension',
                    'Type 2 Diabetes Mellitus',
                    'Coronary Artery Disease',
                    'Asthma / COPD',
                    'Hypothyroidism',
                    'Chronic Kidney Disease',
                    'Tuberculosis'
                  ].map((cond) => {
                    const active = medicalConditions.some((c) => c.includes(cond));
                    return (
                      <button
                        key={cond}
                        type="button"
                        onClick={() =>
                          setMedicalConditions((prev) =>
                            active ? prev.filter((c) => !c.includes(cond)) : [...prev, cond]
                          )
                        }
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                          active
                            ? 'bg-health-600 text-white border-health-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}
                        {cond}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Past Medical Notes & Duration
                </label>
                <input
                  type="text"
                  value={pmhxNotes}
                  onChange={(e) => setPmhxNotes(e.target.value)}
                  placeholder="e.g. Diagnosed 10 years ago, last HbA1c 8.4%"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-health-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Previous Surgeries & Operations
                </label>
                <div className="flex flex-wrap gap-2">
                  {['None', 'Appendectomy', 'Gallbladder (Cholecystectomy)', 'Hernia Repair', 'Coronary Angioplasty / CABG', 'C-Section'].map(
                    (s) => {
                      const active = surgeries.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            if (s === 'None') setSurgeries(['None']);
                            else {
                              setSurgeries((prev) =>
                                active
                                  ? prev.filter((x) => x !== s)
                                  : [...prev.filter((x) => x !== 'None'), s]
                              );
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                            active
                              ? 'bg-clinical-600 text-white border-clinical-600'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {active ? '✓ ' : '+ '}
                          {s}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Drug & Allergy History */}
          {currentStep.id === 'drugs-allergies' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Current Medications & Prescriptions
                </label>
                <div className="space-y-2">
                  {medications.map((med, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    >
                      <div className="flex items-center gap-2">
                        <Pill className="w-4 h-4 text-health-600" />
                        <span>{med}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setMedications(medications.filter((_, i) => i !== idx))}
                        className="text-red-500 hover:text-red-700 text-xs font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="new-med-input"
                      placeholder="Add medicine name (e.g. Tab Atorvastatin 20mg)"
                      className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = (e.target as HTMLInputElement).value.trim();
                          if (val) {
                            setMedications([...medications, val]);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('new-med-input') as HTMLInputElement;
                        if (input && input.value.trim()) {
                          setMedications([...medications, input.value.trim()]);
                          input.value = '';
                        }
                      }}
                      className="px-4 py-2 bg-health-600 text-white rounded-xl text-xs font-bold"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Allergies (Drugs, Foods, Inhalants)
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'No Known Drug Allergies (NKDA)',
                    'Diclofenac / NSAIDs',
                    'Penicillin / Amoxicillin',
                    'Sulfa Antibiotics',
                    'Contrast Dye',
                    'Peanuts / Shellfish'
                  ].map((allergy) => {
                    const active = allergies.includes(allergy);
                    return (
                      <button
                        key={allergy}
                        type="button"
                        onClick={() => {
                          if (allergy === 'No Known Drug Allergies (NKDA)') {
                            setAllergies(['No Known Drug Allergies (NKDA)']);
                          } else {
                            setAllergies((prev) =>
                              active
                                ? prev.filter((a) => a !== allergy)
                                : [...prev.filter((a) => !a.includes('NKDA')), allergy]
                            );
                          }
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                          active
                            ? 'bg-red-50 text-red-900 border-red-300 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {active ? '⚠ ' : '+ '}
                        {allergy}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Family & Personal History */}
          {currentStep.id === 'family-personal' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Family Hereditary Conditions
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Father had CAD / Heart Attack',
                    'Family history of Diabetes',
                    'Family history of Hypertension',
                    'Family history of Cancer',
                    'Family history of Stroke'
                  ].map((cond) => {
                    const active = familyConditions.includes(cond);
                    return (
                      <button
                        key={cond}
                        type="button"
                        onClick={() =>
                          setFamilyConditions((prev) =>
                            active ? prev.filter((c) => c !== cond) : [...prev, cond]
                          )
                        }
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                          active
                            ? 'bg-clinical-700 text-white border-clinical-700'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}
                        {cond}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dietary Pattern</label>
                  <select
                    value={diet}
                    onChange={(e) => setDiet(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Eggetarian">Eggetarian</option>
                    <option value="Vegan">Vegan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Smoking / Tobacco</label>
                  <select
                    value={smoking}
                    onChange={(e) => setSmoking(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="Never">Never Smoked</option>
                    <option value="Former">Former Smoker (Quit)</option>
                    <option value="Current">Current Smoker</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sleep (Hours/Day)</label>
                  <input
                    type="number"
                    min="3"
                    max="14"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Review of Systems (ROS) */}
          {currentStep.id === 'ros' && (
            <div className="space-y-4">
              <span className="block text-xs font-bold text-slate-700">
                Select any other symptoms you have experienced in the last 72 hours:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Cold diaphoresis (excessive sweating)',
                  'Shortness of breath (Dyspnea)',
                  'Mild dizziness / lightheadedness',
                  'Palpitations (fluttering heart)',
                  'Nausea or abdominal fullness',
                  'Fever with evening spikes',
                  'Cough with phlegm or sputum',
                  'Loss of appetite & general weakness'
                ].map((symptomItem) => {
                  const active = rosSelected.includes(symptomItem);
                  return (
                    <button
                      key={symptomItem}
                      type="button"
                      onClick={() =>
                        setRosSelected((prev) =>
                          active ? prev.filter((s) => s !== symptomItem) : [...prev, symptomItem]
                        )
                      }
                      className={`p-3 rounded-xl text-xs font-bold border text-left flex items-center justify-between transition ${
                        active
                          ? 'bg-health-50 border-health-500 text-health-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{symptomItem}</span>
                      {active && <CheckCircle2 className="w-4 h-4 text-health-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 7: AYUSH Mode (If Enabled) */}
          {currentStep.id === 'ayush' && (
            <div className="space-y-6">
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-900 mb-1">
                  <HeartPulse className="w-4 h-4 text-teal-700" />
                  <span>AYUSH Integrated Clinical Intake (Ayurveda, Yoga, Unani, Siddha, Homeopathy)</span>
                </div>
                <p className="text-xs text-teal-800">
                  Screens traditional medicines, Prakriti constitution, and home herbal preparations for drug-herb interactions.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Constitutional Tendency / Prakriti Assessment
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {(['Vata', 'Pitta', 'Kapha', 'Vata-Pitta', 'Pitta-Kapha', 'Tridosha'] as const).map(
                    (p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPrakriti(p)}
                        className={`py-2 text-xs font-bold rounded-xl border transition ${
                          prakriti === p
                            ? 'bg-teal-700 text-white border-teal-700'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Traditional Formulations / Kadha / Herbal Decoctions Taken
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Arjuna bark kashayam',
                    'Ashwagandha churna',
                    'Triphala guggulu',
                    'Chyawanprash daily',
                    'Giloy / Guduchi juice',
                    'Warm ginger turmeric water'
                  ].map((item) => {
                    const active = homeRemedies.some((h) => h.includes(item));
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() =>
                          setHomeRemedies((prev) =>
                            active ? prev.filter((h) => !h.includes(item)) : [...prev, item]
                          )
                        }
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                          active
                            ? 'bg-teal-600 text-white border-teal-600'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stepper Navigation Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentStepIndex === 0 ? 'Edit Details' : 'Previous Step'}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-health-600 to-clinical-600 hover:from-health-500 hover:to-clinical-500 text-white text-xs font-extrabold rounded-xl shadow-md transition"
          >
            <span>
              {currentStepIndex === steps.length - 1 ? 'Proceed to Document Upload' : 'Next Question'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
