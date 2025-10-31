class VoiceChatManager {
  private synthesis: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private recognition: any = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.setupSpeechRecognition();
  }

  private setupSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      
      // Auto-stop AI when user starts speaking
      this.recognition.onstart = () => {
        this.cancel();
      };
    }
  }

  speak(text: string, onEnd?: () => void): void {
    // Cancel any ongoing speech first
    this.cancel();
    
    // Create new utterance
    this.currentUtterance = new SpeechSynthesisUtterance(text);
    
    // Set up event handlers
    this.currentUtterance.onend = () => {
      this.currentUtterance = null;
      onEnd?.();
    };
    
    this.currentUtterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      this.currentUtterance = null;
    };
    
    // Start speaking
    this.synthesis.speak(this.currentUtterance);
  }

  cancel(): void {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }
    this.currentUtterance = null;
  }

  pause(): void {
    if (this.synthesis.speaking && !this.synthesis.paused) {
      this.synthesis.pause();
    }
  }

  resume(): void {
    if (this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  isSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  startListening(onResult: (transcript: string) => void): void {
    if (this.recognition) {
      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };
      this.recognition.start();
    }
  }

  stopListening(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}

export const voiceChatManager = new VoiceChatManager();
