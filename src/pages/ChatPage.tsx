import React, { useState, useRef, useEffect } from 'react';
import { Activity, Trash2, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { ChatMessage } from '../components/chat/ChatMessage';
import { ChatInput } from '../components/chat/ChatInput';
import { ChatMessage as ChatMessageType } from '../types';
import { chatService } from '../services/mockChatService';
import { useLanguage } from '../data/LanguageContext';
import { EmergencyModal } from '../components/layout/EmergencyModal';

export const ChatPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeText =
        language === 'hi'
          ? 'नमस्ते! मैं MedAware हूँ - प्रमाण-आधारित जन स्वास्थ्य जागरूकता सहायक। आप मुझसे किसी भी संक्रामक या जीवनशैली रोग, उसके लक्षणों, सावधानियों और डॉक्टर के पास कब जाना चाहिए, इसके बारे में पूछ सकते हैं।'
          : language === 'mr'
          ? 'नमस्कार! मी MedAware आहे - पुरावा-आधारित सार्वजनिक आरोग्य जनजागृती सहाय्यक. आपण मला आजारांची लक्षणे, प्रतिबंध आणि डॉक्टरांकडे कधी जावे याबद्दल विचारू शकता.'
          : 'Hello! I am MedAware, an evidence-based public health awareness assistant. Ask me about disease symptoms, prevention, home precautions, and when to seek certified medical care.';

      const initialMessage: ChatMessageType = {
        id: 'welcome-1',
        sender: 'assistant',
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language,
        structuredResponse: {
          summary: welcomeText,
          importantPoints: [
            'All responses are grounded in WHO, MoHFW, and CDC public health guidelines.',
            'Automatic red-flag symptom screening protects in life-threatening emergencies.',
            'Connect with verified MBBS medical students via MedConnect.',
            'Strictly non-diagnostic and non-prescriptive.'
          ],
          prevention: [
            'Regular handwashing and sanitation',
            'Vector control and elimination of stagnant water',
            'Nutritious balanced diet and regular exercise'
          ],
          whenToSeekCare: [
            'High fever persisting beyond 3 days',
            'Persistent vomiting, chest discomfort, or sudden breathlessness',
            'Any sudden neurological deficit or loss of consciousness'
          ],
          sources: [
            {
              name: 'Ministry of Health & Family Welfare (MoHFW)',
              url: 'https://mohfw.gov.in',
              organization: 'MoHFW',
              lastReviewed: '2024-07-01'
            },
            {
              name: 'World Health Organization (WHO)',
              url: 'https://www.who.int',
              organization: 'WHO',
              lastReviewed: '2024-06-15'
            }
          ],
          nonDiagnosticDisclaimer:
            'Notice: MedAware provides health awareness only and does not replace certified doctors or provide medical diagnosis.'
        },
        suggestedFollowUps: [
          'What are the symptoms of dengue?',
          'How can I prevent dengue?',
          'What are common symptoms of flu?',
          'When should I seek medical care?'
        ]
      };
      setMessages([initialMessage]);
    }
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (userText: string) => {
    const userMsg: ChatMessageType = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(userText, language, messages);
      setMessages((prev) => [...prev, response]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-100 max-w-7xl w-full mx-auto shadow-sm min-h-[calc(100vh-4rem)]">
      {/* Chat Clinical Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-16 z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-health-50 text-health-700 border border-health-200 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                {t.appName} Health Assistant
              </h2>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Grounded & Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              WHO / MoHFW knowledge retrieval • Zero prescription guardrails
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold transition"
            title="Emergency response hotlines"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>112 / 108</span>
          </button>

          <button
            onClick={handleClearChat}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            title="Reset conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onSelectPrompt={(p) => handleSendMessage(p)}
          />
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 items-center animate-fadeIn">
            <div className="w-8 h-8 rounded-xl bg-health-600 text-white flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-health-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-health-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-health-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-xs text-slate-500 font-medium ml-1.5">Checking safety & retrieving verified sources...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Tray */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />

      <EmergencyModal isOpen={isEmergencyModalOpen} onClose={() => setIsEmergencyModalOpen(false)} />
    </div>
  );
};
