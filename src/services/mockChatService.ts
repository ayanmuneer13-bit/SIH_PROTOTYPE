import { assessSafety } from './safetyService';
import { searchKnowledgeBase } from './retrievalService';
import { ChatMessage, StructuredAIResponse, SupportedLanguage } from '../types';

export interface ChatService {
  sendMessage(
    userText: string,
    language: SupportedLanguage,
    messageHistory: ChatMessage[]
  ): Promise<ChatMessage>;
}

export class MockChatService implements ChatService {
  public async sendMessage(
    userText: string,
    language: SupportedLanguage,
    _messageHistory: ChatMessage[]
  ): Promise<ChatMessage> {
    // Brief processing latency
    await new Promise((res) => setTimeout(res, 300));

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Check Safety & Red-Flag Layer
    const safety = assessSafety(userText);
    const retrieval = searchKnowledgeBase(userText);

    // CRITICAL RED FLAG EMERGENCY ESCALATION
    if (safety.isEmergency) {
      const emergencySummary =
        language === 'hi'
          ? '⚠️ तत्काल आपातकालीन चिकित्सा सहायता की आवश्यकता हो सकती है। आपके द्वारा बताए गए लक्षण (जैसे ' + safety.matchedRedFlags.join(', ') + ') जीवन के लिए गंभीर आपातकालीन स्थिति का संकेत हो सकते हैं।'
          : language === 'mr'
          ? '⚠️ तातडीच्या आपत्कालीन वैद्यकीय उपचारांची गरज भासू शकते. आपण नमूद केलेली लक्षणे (' + safety.matchedRedFlags.join(', ') + ') गंभीर वैद्यकीय आणीबाणी दर्शवू शकतात.'
          : '⚠️ Urgent medical attention may be needed. Some symptoms you described (' + safety.matchedRedFlags.join(', ') + ') can be associated with serious medical emergencies.';

      return {
        id: 'msg-' + Date.now(),
        sender: 'assistant',
        timestamp,
        language,
        isEmergencyAlert: true,
        safetyAssessment: safety,
        text: emergencySummary,
        structuredResponse: {
          summary: emergencySummary,
          importantPoints: [
            safety.guidanceText,
            'Do NOT delay seeking emergency evaluation. Call 112 or 108 immediately.',
            'Keep the individual calm, resting, and ensure clear airway.',
            'Do NOT attempt to drive yourself if experiencing dizziness, weakness, or chest pressure.'
          ],
          prevention: [
            'Emergency escalation protocol active: Immediate hospital transit is required.',
            'Have someone accompany the patient to provide history to the emergency medical team.'
          ],
          whatToMonitor: [
            'Loss of responsiveness or fainting',
            'Severe drop in breathing rate or bluish lips',
            'Worsening chest tightness or confusion'
          ],
          whenToSeekCare: [
            'IMMEDIATELY: Call 108 (Ambulance) or 112 (National Emergency Helpline).'
          ],
          sources: [
            {
              name: 'National Emergency Response System (MoHFW & MHA India)',
              url: 'https://112.gov.in',
              organization: 'MoHFW',
              lastReviewed: '2024-06-01'
            }
          ],
          nonDiagnosticDisclaimer:
            'Critical Safety Alert: MedAware does not diagnose medical emergencies. Always follow certified emergency personnel instructions.',
          retrievalGrounding: {
            primaryTopic: 'Emergency Escalation (' + (safety.emergencyCategory || 'Life-Threatening') + ')',
            confidenceScore: 100,
            matchedIndicators: safety.matchedRedFlags,
            differentialTopics: ['Immediate Emergency Response (112 / 108)'],
            isAmbiguous: false,
            whatToMonitor: ['Conscious state', 'Breathing difficulty', 'Pulse rate'],
            groundingNotice: 'Emergency triage rule intercepted acute critical symptoms.',
            isGroundedInLocalKb: true
          }
        },
        suggestedFollowUps: [
          'What should I tell the 108 ambulance operator?',
          'What first-aid precautions should I take while waiting?',
          'Find nearest emergency hospital'
        ]
      };
    }

    // GROUNDED DISEASE / SYMPTOM RESPONSE (NON-DIAGNOSTIC)
    if (retrieval.topDisease && retrieval.confidenceScore >= 45) {
      const d = retrieval.topDisease;
      const g = retrieval.grounding;

      // Clinical Non-Diagnostic Framing
      let intro = '';
      if (g.isAmbiguous) {
        if (language === 'hi') {
          intro = `आपके द्वारा बताए गए लक्षण (${g.matchedIndicators.join(', ')}) कई अलग-अलग बीमारियों में हो सकते हैं। MedAware बीमारी का निदान नहीं कर सकता। हालांकि, इन लक्षणों के आधार पर **${d.name} (${d.localNames.hi})** तथा अन्य संबंधित स्थितियों के बारे में जन स्वास्थ्य जागरूकता नीचे दी जा रही है:`;
        } else if (language === 'mr') {
          intro = `आपण नमूद केलेली लक्षणे (${g.matchedIndicators.join(', ')}) एकापेक्षा जास्त आजारांमध्ये दिसू शकतात. MedAware कोणत्याही आजाराचे निदान करू शकत नाही. परंतु, या लक्षणांच्या आधारे **${d.name} (${d.localNames.mr})** व संबंधित आजारांविषयी अधिकृत माहिती खालीलप्रमाणे आहे:`;
        } else {
          intro = `The symptoms you described (${g.matchedIndicators.join(', ')}) can occur with multiple acute illnesses, and MedAware cannot determine the cause or provide a medical diagnosis. For health awareness, here is evidence-based information regarding **${d.name}** and related differential conditions:`;
        }
      } else {
        if (language === 'hi') {
          intro = `${d.name} (${d.localNames.hi}) के बारे में सत्यापित जन स्वास्थ्य जानकारी:`;
        } else if (language === 'mr') {
          intro = `${d.name} (${d.localNames.mr}) विषयी पडताळलेली सार्वजनिक आरोग्य माहिती:`;
        } else {
          intro = `Evidence-based health awareness regarding **${d.name}**:`;
        }
      }

      const structuredResponse: StructuredAIResponse = {
        summary: intro + ' ' + d.overview,
        importantPoints: d.commonSymptoms,
        prevention: d.prevention,
        whatToMonitor: g.whatToMonitor,
        whenToSeekCare: d.whenToSeekImmediateCare,
        sources: d.sources,
        nonDiagnosticDisclaimer:
          'Medical Awareness Notice: These symptoms can occur with multiple illnesses. MedAware provides public health education and cannot diagnose your condition or prescribe medication. Consult a qualified doctor for medical evaluation and diagnostic testing.',
        retrievalGrounding: g
      };

      const followUps = [
        `What laboratory tests are used to evaluate ${d.name}?`,
        `What are the danger signs I should monitor for ${d.name}?`,
        `Talk to an MBBS student on MedConnect for guidance`
      ];

      return {
        id: 'msg-' + Date.now(),
        sender: 'assistant',
        timestamp,
        language,
        text: intro + ' ' + d.overview,
        structuredResponse,
        suggestedFollowUps: followUps
      };
    }

    // GENERAL SYMPTOM AWARENESS (WHEN CONFIDENCE IS LOW OR GENERAL QUERY)
    const generalSummary =
      language === 'hi'
        ? 'आपके द्वारा बताए गए लक्षण सामान्य हैं और कई कारणों से हो सकते हैं। MedAware किसी बीमारी का निदान नहीं कर सकता। कृपया किसी योग्य डॉक्टर से परामर्श लें, और अपने लक्षणों (बुखार, उल्टी या दर्द) पर ध्यान दें।'
        : language === 'mr'
        ? 'आपण विचारलेली लक्षणे सामान्य असून अनेक कारणांमुळे उद्भवू शकतात. MedAware आजाराचे निदान करू शकत नाही. कृपया अधिकृत डॉक्टरांचा सल्ला घ्या आणि धोक्याच्या लक्षणांवर लक्ष ठेवा.'
        : 'The symptoms you described can occur across multiple conditions. MedAware is a health-awareness tool and cannot determine the cause or diagnose conditions. Here is general public health guidance on common symptoms and when to see a doctor:';

    return {
      id: 'msg-' + Date.now(),
      sender: 'assistant',
      timestamp,
      language,
      text: generalSummary,
      structuredResponse: {
        summary: generalSummary,
        importantPoints: [
          'Symptoms like fever, headache, or body aches occur across many viral and bacterial illnesses.',
          'A certified doctor can perform essential clinical examination and blood testing (e.g. CBC, ESR, smear).',
          'Avoid taking antibiotics or pain medications without prescription (especially Aspirin/NSAIDs if fever is present, as they risk bleeding in dengue).'
        ],
        prevention: [
          'Stay well hydrated with clean oral fluids (ORS, coconut water, boiled water).',
          'Adequate bed rest and temperature monitoring.',
          'Maintain mosquito protection (repellents, bed nets) in vector-endemic seasons.'
        ],
        whatToMonitor: [
          'High fever persisting beyond 3 days',
          'Pain behind the eyes with severe headache',
          'Inability to tolerate fluids or persistent vomiting',
          'Any unusual bruising or bleeding from nose/gums'
        ],
        whenToSeekCare: [
          'If fever does not subside within 48-72 hours',
          'If you develop severe abdominal pain, persistent vomiting, or extreme weakness',
          'Seek immediate 112/108 emergency care if breathing becomes difficult or confusion develops'
        ],
        sources: [
          {
            name: 'Ministry of Health & Family Welfare (MoHFW) Citizen Guidance',
            url: 'https://mohfw.gov.in',
            organization: 'MoHFW',
            lastReviewed: '2024-07-01'
          },
          {
            name: 'World Health Organization (WHO) Health Topics',
            url: 'https://www.who.int/health-topics',
            organization: 'WHO',
            lastReviewed: '2024-06-15'
          }
        ],
        nonDiagnosticDisclaimer:
          'Medical Awareness Notice: MedAware provides disease education only. It does not diagnose diseases or prescribe treatment. Always seek advice from a qualified healthcare professional.',
        retrievalGrounding: {
          primaryTopic: 'General Symptom Awareness',
          confidenceScore: 35,
          matchedIndicators: ['Non-specific symptoms'],
          differentialTopics: ['Viral Fever', 'Seasonal Influenza', 'Vector-borne illnesses'],
          isAmbiguous: true,
          whatToMonitor: ['Fever duration', 'Hydration status', 'Warning signs'],
          groundingNotice: 'Grounded in WHO/MoHFW general public health protocols.',
          isGroundedInLocalKb: true
        }
      },
      suggestedFollowUps: [
        'What are the symptoms of dengue?',
        'How can I tell the difference between flu and dengue?',
        'When should I seek immediate medical care?'
      ]
    };
  }
}

export const chatService = new MockChatService();
