import React, { useState, useEffect } from 'react';
import { Send, Mic, MicOff, Sparkles, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../data/LanguageContext';
import { COMMON_PROMPTS } from '../../data/languages';
import { VoiceRecognitionController, isSpeechRecognitionSupported } from '../../services/speechService';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const { language, t } = useLanguage();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechController, setSpeechController] = useState<VoiceRecognitionController | null>(null);

  const prompts = [
    'I have fever, severe headache and pain behind my eyes. What could this be and what should I do?',
    ...((COMMON_PROMPTS[language] || COMMON_PROMPTS.en))
  ];

  useEffect(() => {
    if (isSpeechRecognitionSupported()) {
      const controller = new VoiceRecognitionController(
        (transcript) => {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
        },
        (error) => {
          console.warn('Speech recognition error:', error);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );
      setSpeechController(controller);
    }
  }, []);

  const handleToggleVoice = () => {
    if (!speechController) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome, Edge, or text input.');
      return;
    }

    if (isListening) {
      speechController.stop();
      setIsListening(false);
    } else {
      const started = speechController.start(language);
      if (started) {
        setIsListening(true);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleDemoScenario = (scenarioText: string) => {
    if (!isLoading) {
      onSendMessage(scenarioText);
    }
  };

  return (
    <div className="border-t border-slate-200 bg-white p-4 space-y-3 shadow-lg">
      {/* Quick Prompts Carousel */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[11px] font-bold text-slate-500 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-health-600" /> Prompts:
        </span>
        {prompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setInputText(p);
            }}
            className="px-2.5 py-1 rounded-full text-xs bg-slate-100 hover:bg-health-50 hover:border-health-300 text-slate-700 border border-slate-200 whitespace-nowrap transition shrink-0"
          >
            {p.length > 55 ? p.substring(0, 55) + '...' : p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1 flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening ? t.listening : t.chatPlaceholder}
            disabled={isLoading}
            className={`w-full pl-4 pr-12 py-3 text-xs sm:text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-health-500 focus:bg-white transition ${
              isListening ? 'border-red-400 bg-red-50/50 ring-2 ring-red-300' : 'border-slate-300'
            }`}
          />

          {/* Voice Input Mic Button */}
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`absolute right-2.5 p-2 rounded-lg transition-all ${
              isListening
                ? 'bg-red-600 text-white animate-pulse shadow-sm'
                : 'text-slate-400 hover:text-health-700 hover:bg-slate-200'
            }`}
            title={t.voiceTooltip}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="px-5 py-3 rounded-xl bg-health-600 hover:bg-health-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow transition flex items-center gap-1.5 shrink-0"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">{t.send}</span>
        </button>
      </form>

      {/* Quick Judge Demo Bar */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-bold text-slate-600 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-500" /> SIH Test Triggers:
          </span>
          <button
            type="button"
            onClick={() => handleDemoScenario('I have fever, severe headache and pain behind my eyes. What could this be and what should I do?')}
            className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-300 hover:bg-teal-100 font-semibold"
          >
            1. Fever + Pain Behind Eyes (Dengue)
          </button>
          <button
            type="button"
            onClick={() => handleDemoScenario('I have high fever with periodic shaking chills and sweating')}
            className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100"
          >
            2. Chills + Sweating (Malaria)
          </button>
          <button
            type="button"
            onClick={() => handleDemoScenario('I have had a cough for >2 weeks and night sweats')}
            className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-300 hover:bg-blue-100"
          >
            3. Cough &gt;2 Weeks (TB)
          </button>
          <button
            type="button"
            onClick={() => handleDemoScenario('I am having excessive thirst and frequent urination especially at night')}
            className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-300 hover:bg-purple-100"
          >
            4. Thirst + Urination (Diabetes)
          </button>
          <button
            type="button"
            onClick={() => handleDemoScenario('I have severe crushing chest pain and difficulty breathing')}
            className="px-2 py-0.5 rounded bg-red-50 text-red-800 border border-red-300 hover:bg-red-100 font-bold"
          >
            5. Chest Pain + Breathing (Emergency)
          </button>
        </div>

        <span className="text-[10px] text-slate-400">Strict Non-Diagnostic Public Health System</span>
      </div>
    </div>
  );
};
