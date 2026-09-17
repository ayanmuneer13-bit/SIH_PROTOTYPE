import { SupportedLanguage } from '../types';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  shortDescription: string;
  startChatCTA: string;
  talkToStudentsCTA: string;
  howItWorks: string;
  howItWorksSubtitle: string;
  featuresTitle: string;
  featuresSubtitle: string;
  navHome: string;
  navChat: string;
  navMedConnect: string;
  navDashboard: string;
  navEmergency: string;
  disclaimerShort: string;
  disclaimerFull: string;
  privacyBadge: string;
  privacySubtext: string;
  chatPlaceholder: string;
  listening: string;
  voiceTooltip: string;
  speakTooltip: string;
  send: string;
  suggestedQuestionsTitle: string;
  emergencyAlertTitle: string;
  emergencyAlertBody: string;
  callEmergencyCTA: string;
  findCareCTA: string;
  continueReadingCTA: string;
  sourcesUsed: string;
  lastReviewed: string;
  medConnectTitle: string;
  medConnectSubtitle: string;
  medConnectDisclaimer: string;
  filterAllColleges: string;
  filterAllYears: string;
  filterAllLanguages: string;
  filterAllSpecialties: string;
  requestConversation: string;
  demoScenarios: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appName: 'MedAware',
    tagline: 'AI-Powered Public Health Awareness for Everyone',
    shortDescription: 'Evidence-based disease awareness, early red-flag symptom triage, verified health sources, and guidance from verified future doctors.',
    startChatCTA: 'Start Health Chat',
    talkToStudentsCTA: 'Connect with Future Doctors',
    howItWorks: 'How MedAware Works',
    howItWorksSubtitle: 'A multi-tier safe clinical pipeline built for public health education',
    featuresTitle: 'Why Public Health Matters',
    featuresSubtitle: 'Engineered for safety, verified truth, and human healthcare connection',
    navHome: 'Home',
    navChat: 'Health Chat',
    navMedConnect: 'MedConnect',
    navDashboard: 'SIH Dashboard',
    navEmergency: 'Emergency 112 / 108',
    disclaimerShort: 'For health awareness only. Does not diagnose conditions or prescribe treatment.',
    disclaimerFull: 'Important Medical Safety Notice: MedAware is an educational public health prototype developed for Smart India Hackathon 2025. It does not provide medical diagnosis, clinical prognosis, or prescription. Always consult a certified physician for medical symptoms or emergencies.',
    privacyBadge: 'Privacy-First Design',
    privacySubtext: 'Minimal data footprint. No health profiling or tracking.',
    chatPlaceholder: 'Ask about disease symptoms, prevention, or precautions (e.g., Dengue symptoms)...',
    listening: 'Listening... Speak your health question',
    voiceTooltip: 'Voice Input (Web Speech)',
    speakTooltip: 'Read Response Aloud',
    send: 'Send',
    suggestedQuestionsTitle: 'Suggested Health Inquiries',
    emergencyAlertTitle: 'Urgent Medical Attention May Be Needed',
    emergencyAlertBody: 'Some symptoms you mentioned can be associated with critical medical emergencies. Please contact emergency services immediately or visit the nearest emergency room.',
    callEmergencyCTA: 'Call Emergency Services (112 / 108)',
    findCareCTA: 'Find Nearest Emergency Center',
    continueReadingCTA: 'Acknowledge & Read Awareness Info',
    sourcesUsed: 'Verified Health Sources Used',
    lastReviewed: 'Last Reviewed',
    medConnectTitle: 'Talk to Future Doctors',
    medConnectSubtitle: 'Connect with verified MBBS medical students for empathetic health-awareness guidance.',
    medConnectDisclaimer: 'Medical students provide disease awareness, community health education, and navigation support only. They do not diagnose conditions or prescribe treatments.',
    filterAllColleges: 'All Medical Colleges',
    filterAllYears: 'All MBBS Years',
    filterAllLanguages: 'All Languages',
    filterAllSpecialties: 'All Areas of Interest',
    requestConversation: 'Request Conversation',
    demoScenarios: 'Quick Demo Scenarios (SIH Judges)'
  },
  hi: {
    appName: 'MedAware',
    tagline: 'सभी के लिए एआई-संचालित जन स्वास्थ्य जागरूकता',
    shortDescription: 'प्रमाण-आधारित रोग जागरूकता, शुरुआती चेतावनी (रेड-फ्लैग) लक्षणों की पहचान, सत्यापित स्वास्थ्य स्रोत, और भावी डॉक्टरों से मार्गदर्शन।',
    startChatCTA: 'स्वास्थ्य चैट शुरू करें',
    talkToStudentsCTA: 'भावी डॉक्टरों से जुड़ें',
    howItWorks: 'MedAware कैसे काम करता है',
    howItWorksSubtitle: 'जन स्वास्थ्य शिक्षा के लिए निर्मित बहुस्तरीय सुरक्षित प्रणाली',
    featuresTitle: 'जन स्वास्थ्य क्यों महत्वपूर्ण है',
    featuresSubtitle: 'सुरक्षा, सत्यापित सत्य और मानवीय स्वास्थ्य संपर्क के लिए तैयार किया गया',
    navHome: 'होम',
    navChat: 'स्वास्थ्य चैट',
    navMedConnect: 'मेडकनेक्ट',
    navDashboard: 'एसआईएच डैशबोर्ड',
    navEmergency: 'आपातकालीन 112 / 108',
    disclaimerShort: 'केवल स्वास्थ्य जागरूकता के लिए। यह मंच किसी बीमारी का निदान या दवा नहीं लिखता।',
    disclaimerFull: 'महत्वपूर्ण स्वास्थ्य सुरक्षा सूचना: MedAware स्मार्ट इंडिया हैकाथॉन 2025 के लिए विकसित एक शैक्षणिक जन स्वास्थ्य प्रोटोटाइप है। यह चिकित्सीय निदान या नुस्खे प्रदान नहीं करता। किसी भी लक्षण के लिए योग्य चिकित्सक से परामर्श लें।',
    privacyBadge: 'गोपनीयता-प्रथम डिज़ाइन',
    privacySubtext: 'न्यूनतम डेटा संग्रह। कोई व्यक्तिगत ट्रैकिंग नहीं।',
    chatPlaceholder: 'रोग के लक्षण, रोकथाम या सावधानियों के बारे में पूछें (जैसे: डेंगू के लक्षण)...',
    listening: 'सुन रहे हैं... अपना स्वास्थ्य प्रश्न बोलें',
    voiceTooltip: 'आवाज से पूछें (माइक)',
    speakTooltip: 'उत्तर सुनें (ऑडियो)',
    send: 'भेजें',
    suggestedQuestionsTitle: 'सुझाए गए स्वास्थ्य प्रश्न',
    emergencyAlertTitle: 'तत्काल चिकित्सा सहायता की आवश्यकता हो सकती है',
    emergencyAlertBody: 'आपके द्वारा बताए गए कुछ लक्षण गंभीर आपातकालीन स्थिति से जुड़े हो सकते हैं। कृपया तुरंत आपातकालीन सेवाओं से संपर्क करें या निकटतम अस्पताल जाएं।',
    callEmergencyCTA: 'आपातकालीन सेवा को कॉल करें (112 / 108)',
    findCareCTA: 'निकटतम आपातकालीन केंद्र खोजें',
    continueReadingCTA: 'स्वीकार करें और जानकारी पढ़ें',
    sourcesUsed: 'सत्यापित स्वास्थ्य स्रोत',
    lastReviewed: 'अंतिम समीक्षा',
    medConnectTitle: 'भावी डॉक्टरों से बात करें',
    medConnectSubtitle: 'स्वास्थ्य जागरूकता मार्गदर्शन के लिए सत्यापित एमबीबीएस मेडिकल छात्रों से जुड़ें।',
    medConnectDisclaimer: 'मेडिकल छात्र केवल स्वास्थ्य जागरूकता और सामान्य मार्गदर्शन प्रदान करते हैं। वे बीमारी का निदान या दवाएं नहीं लिखते।',
    filterAllColleges: 'सभी मेडिकल कॉलेज',
    filterAllYears: 'सभी एमबीबीएस वर्ष',
    filterAllLanguages: 'सभी भाषाएं',
    filterAllSpecialties: 'सभी विषय क्षेत्र',
    requestConversation: 'बातचीत का अनुरोध करें',
    demoScenarios: 'शीघ्र डेमो परिदृश्य (एसआईएच जज)'
  },
  mr: {
    appName: 'MedAware',
    tagline: 'सर्वांसाठी एआय-सक्षम सार्वजनिक आरोग्य जनजागृती',
    shortDescription: 'पुरावा-आधारित आजारांची माहिती, गंभीर धोक्याच्या लक्षणांची त्वरित ओळख, अधिकृत आरोग्य स्रोत आणि वैद्यकीय विद्यार्थ्यांचे मार्गदर्शन.',
    startChatCTA: 'आरोग्य संवाद सुरू करा',
    talkToStudentsCTA: 'भावी डॉक्टरांशी जोडा',
    howItWorks: 'MedAware कसे कार्य करते',
    howItWorksSubtitle: 'सार्वजनिक आरोग्य शिक्षणासाठी तयार केलेली बहुस्तरीय सुरक्षित यंत्रणा',
    featuresTitle: 'सार्वजनिक आरोग्य महत्त्वाचे का आहे',
    featuresSubtitle: 'सुरक्षितता, पडताळलेले सत्य आणि मानवी मार्गदर्शनासाठी तयार केलेले',
    navHome: 'मुख्यपृष्ठ',
    navChat: 'आरोग्य संवाद',
    navMedConnect: 'मेडकनेक्ट',
    navDashboard: 'एसआयएच डॅशबोर्ड',
    navEmergency: 'तातडीची मदत 112 / 108',
    disclaimerShort: 'फक्त आरोग्य जनजागृतीसाठी. हे व्यासपीठ निदान करत नाही किंवा औषधे लिहून देत नाही.',
    disclaimerFull: 'महत्त्वाची वैद्यकीय सुरक्षा सूचना: MedAware हा स्मार्ट इंडिया हॅकाथॉन २०२५ साठी तयार केलेला शैक्षणिक सार्वजनिक आरोग्य प्रोटोटाइप आहे. हे वैद्यकीय निदान किंवा औषधोपचार पुरवत नाही. आजाराच्या लक्षणांसाठी नेहमी अधिकृत डॉक्टरांचा सल्ला घ्या.',
    privacyBadge: 'गोपनीयता-प्रथम रचना',
    privacySubtext: 'किमान वैयक्तिक माहिती संग्रह. कोणतीही ट्रॅकिंग नाही.',
    chatPlaceholder: 'आजारांची लक्षणे, प्रतिबंध किंवा उपायांबद्दल विचारा (उदा. डेंग्यूची लक्षणे)...',
    listening: 'ऐकत आहे... आपला आरोग्याचा प्रश्न बोला',
    voiceTooltip: 'व्हॉइस इनपुट (माइक)',
    speakTooltip: 'उत्तर ऐका (ऑडिओ)',
    send: 'पाठवा',
    suggestedQuestionsTitle: 'सुचवलेले आरोग्याचे प्रश्न',
    emergencyAlertTitle: 'तातडीच्या वैद्यकीय उपचारांची गरज भासू शकते',
    emergencyAlertBody: 'आपण नमूद केलेली काही लक्षणे गंभीर वैद्यकीय आणीबाणीशी संबंधित असू शकतात. कृपया त्वरित रुग्णवाहिका किंवा जवळच्या रुग्णालयाशी संपर्क साधा.',
    callEmergencyCTA: 'तातडीच्या सेवेला फोन करा (112 / 108)',
    findCareCTA: 'जवळचे आपत्कालीन केंद्र शोधा',
    continueReadingCTA: 'मान्य करा आणि माहिती वाचा',
    sourcesUsed: 'पडताळलेले अधिकृत आरोग्य स्रोत',
    lastReviewed: 'शेवटचे पुनरावलोकन',
    medConnectTitle: 'भावी डॉक्टरांशी चर्चा करा',
    medConnectSubtitle: 'आरोग्य जनजागृती मार्गदर्शनासाठी पडताळणी केलेल्या एमबीबीएस विद्यार्थ्यांशी संवाद साधा.',
    medConnectDisclaimer: 'वैद्यकीय विद्यार्थी केवळ आरोग्य मार्गदर्शन व जनजागृती करतात. ते आजाराचे निदान किंवा औषधोपचार देत नाहीत.',
    filterAllColleges: 'सर्व मेडिकल कॉलेज',
    filterAllYears: 'सर्व वर्ष',
    filterAllLanguages: 'सर्व भाषा',
    filterAllSpecialties: 'सर्व विषय',
    requestConversation: 'संभाषणाची विनंती करा',
    demoScenarios: 'झटपट डेमो परिस्थिती (एसआयएच परीक्षक)'
  }
};

export const COMMON_PROMPTS: Record<SupportedLanguage, string[]> = {
  en: [
    'What are the symptoms of dengue?',
    'How can I prevent dengue?',
    'What are common symptoms of flu?',
    'When should I seek medical care?',
    'How can I prevent mosquito-borne diseases?'
  ],
  hi: [
    'डेंगू के शुरुआती लक्षण क्या हैं?',
    'डेंगू से बचाव कैसे करें?',
    'फ्लू के सामान्य लक्षण क्या हैं?',
    'डॉक्टर के पास कब जाना चाहिए?',
    'मच्छरों से होने वाली बीमारियों से कैसे बचें?'
  ],
  mr: [
    'डेंग्यूची सुरुवातीची लक्षणे कोणती आहेत?',
    'डेंग्यूपासून स्वतःचा बचाव कसा करावा?',
    'फ्लूची सामान्य लक्षणे कोणती आहेत?',
    'डॉक्टरांकडे तातडीने कधी जावे?',
    'डासांमुळे होणारे आजार कसे रोखावेत?'
  ]
};
