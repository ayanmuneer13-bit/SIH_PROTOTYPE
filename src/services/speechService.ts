// Web Speech API interface definitions and browser helpers

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export class VoiceRecognitionController {
  private recognition: any = null;
  private isListening = false;

  constructor(
    private onResult: (text: string) => void,
    private onError: (error: string) => void,
    private onEnd: () => void
  ) {
    if (isSpeechRecognitionSupported()) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onresult = (event: any) => {
        if (event.results && event.results[0] && event.results[0][0]) {
          const transcript = event.results[0][0].transcript;
          this.onResult(transcript);
        }
      };

      this.recognition.onerror = (event: any) => {
        this.onError(event.error || 'Speech recognition error');
        this.isListening = false;
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.onEnd();
      };
    }
  }

  public start(lang: 'en' | 'hi' | 'mr'): boolean {
    if (!this.recognition) return false;
    try {
      this.recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-IN';
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (e) {
      console.warn('Recognition start exception', e);
      return false;
    }
  }

  public stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}

export function speakText(text: string, lang: 'en' | 'hi' | 'mr'): void {
  if (!isSpeechSynthesisSupported()) return;

  window.speechSynthesis.cancel(); // cancel any ongoing speech

  const cleanText = text
    .replace(/[*_#`]/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/⚠️|🚨|📌|🔍|🛡️|📚/g, '');

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-IN';
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}
