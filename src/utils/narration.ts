// Male Voice Speech Synthesizer for Flowchart Steps
// Dual engine:
// 1. Studio-grade deep bass male voice (Charon) via pre-rendered master audio
// 2. Strict male-only Web Speech API fallback with onend completion callbacks

export interface NarrationScript {
  id: string;
  en: string;
}

export const STEP_NARRATIONS: Record<number, NarrationScript> = {
  1: {
    id: 'Langkah pertama... Mulai.',
    en: 'Step one... Start.',
  },
  2: {
    id: 'Langkah kedua... Siapkan alat dan bahan. Yaitu sebuah gelas atau cangkir, sendok pengaduk, bubuk kopi, gula pasir, dan air mineral.',
    en: 'Step two... Prepare tools and ingredients. Cup, stirring spoon, coffee grounds, sugar, and pure water.',
  },
  3: {
    id: 'Langkah ketiga... Panaskan air hingga mencapai suhu ideal, sembilan puluh sampai sembilan puluh lima derajat Celsius.',
    en: 'Step three... Heat water until reaching optimal temperature, ninety to ninety-five degrees Celsius.',
  },
  4: {
    id: 'Langkah keempat... Masukkan bubuk kopi secukupnya ke dalam gelas.',
    en: 'Step four... Put coffee grounds into the glass.',
  },
  5: {
    id: 'Langkah kelima... Tuangkan air panas mendidih, secara perlahan ke dalam gelas.',
    en: 'Step five... Pour hot water gently into the glass.',
  },
  6: {
    id: 'Langkah keenam... Aduk seduhan kopi secara memutar hingga merata.',
    en: 'Step six... Stir coffee evenly in circular motion.',
  },
  7: {
    id: 'Langkah ketujuh... Pilihan rasa. Apakah ingin menambahkan gula? Pilih Ya jika ingin manis, atau Tidak untuk kopi hitam murni.',
    en: 'Step seven... Flavor decision. Add sugar? Choose Yes for sweet, or No for pure black coffee.',
  },
  8: {
    id: 'Langkah kedelapan... Masukkan gula pasir ke dalam cangkir kopi.',
    en: 'Step eight... Add sugar crystals into the coffee cup.',
  },
  9: {
    id: 'Langkah kesembilan... Aduk kembali secara perlahan hingga seluruh butiran gula larut sempurna.',
    en: 'Step nine... Stir slowly once more until all sugar dissolves completely.',
  },
  10: {
    id: 'Langkah kesepuluh... Kopi harum telah selesai diseduh, dan kini siap untuk diminum.',
    en: 'Step ten... Aromatic coffee has brewed, and is now ready to drink.',
  },
  11: {
    id: 'Langkah terakhir... Selesai. Selamat menikmati secangkir kopi hangat racikan Anda.',
    en: 'Final step... Finished. Enjoy your freshly brewed warm cup of coffee.',
  },
};

class MaleVoiceNarrator {
  private synth: SpeechSynthesis | null = null;
  public enabled: boolean = true;
  private maleVoice: SpeechSynthesisVoice | null = null;
  public isSpeaking: boolean = false;
  private currentAudio: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return;

    // Strict male voice identification
    // 1. Look for explicit male Indonesian voices (e.g. Microsoft Ardi)
    const idMale = voices.find(
      (v) =>
        (v.lang.startsWith('id') || v.lang.startsWith('in') || v.lang.includes('ID')) &&
        /ardi|male|pria|b\b|wavenet-b|standard-b|indra|agus|bambang/i.test(v.name) &&
        !/gadis|female|wanita|siti|zira|putri/i.test(v.name)
    );

    if (idMale) {
      this.maleVoice = idMale;
      return;
    }

    // 2. Look for global male voices (David, Mark, Guy, George, etc.)
    const anyMale = voices.find(
      (v) =>
        /male|david|george|james|guy|daniel|richard|mark/i.test(v.name) &&
        !/female|zira|susan|catherine|hazel|mary/i.test(v.name)
    );

    if (anyMale) {
      this.maleVoice = anyMale;
      return;
    }

    // 3. Fallback: filter out known female names
    const nonFemale = voices.find(
      (v) => !/gadis|female|wanita|siti|zira|putri|susan|catherine/i.test(v.name)
    );
    this.maleVoice = nonFemale || voices[0] || null;
  }

  public setEnabled(enable: boolean) {
    this.enabled = enable;
    if (!enable) {
      this.stop();
    }
  }

  public toggle(): boolean {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  public stop() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // safe guard
      }
      this.currentAudio = null;
    }
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {
        // safe guard
      }
    }
    this.isSpeaking = false;
  }

  // Play studio-grade male WAV file with fallback to Web Speech
  public narrateStep(
    step: number,
    branchDecision: 'ya' | 'tidak' | 'both',
    language: 'id' | 'en' | 'dual',
    onComplete?: () => void
  ) {
    if (!this.enabled) {
      onComplete?.();
      return;
    }

    this.stop();

    // Determine target audio file name
    let audioFile = `step_${step}.wav`;
    if (step === 7) {
      if (branchDecision === 'ya') audioFile = 'step_7_ya.wav';
      else if (branchDecision === 'tidak') audioFile = 'step_7_tidak.wav';
      else audioFile = 'step_7_decision.wav';
    }

    const audioUrl = `/audio/${audioFile}`;

    // Try studio master male audio first
    const audio = new Audio(audioUrl);
    this.currentAudio = audio;
    this.isSpeaking = true;

    let hasCompleted = false;
    const handleCompletion = () => {
      if (!hasCompleted) {
        hasCompleted = true;
        this.isSpeaking = false;
        onComplete?.();
      }
    };

    audio.onended = () => {
      handleCompletion();
    };

    audio.onerror = () => {
      // Audio file not yet generated or failed: fallback to Web Speech male engine
      this.speakFallback(step, branchDecision, language, handleCompletion);
    };

    audio.play().catch(() => {
      // Autoplay restriction or network error: fallback to Web Speech male engine
      this.speakFallback(step, branchDecision, language, handleCompletion);
    });
  }

  private speakFallback(
    step: number,
    branchDecision: 'ya' | 'tidak' | 'both',
    language: 'id' | 'en' | 'dual',
    onComplete?: () => void
  ) {
    if (!this.synth) {
      onComplete?.();
      return;
    }

    const script = STEP_NARRATIONS[step];
    if (!script) {
      onComplete?.();
      return;
    }

    let text = language === 'en' ? script.en : script.id;
    if (step === 7) {
      if (branchDecision === 'tidak') {
        text =
          language === 'en'
            ? 'Step seven... Decision. Without added sugar, continuing with pure black coffee.'
            : 'Langkah ketujuh... Pilihan rasa. Tanpa tambahan gula, kita nikmati aroma murni kopi hitam.';
      } else {
        text =
          language === 'en'
            ? 'Step seven... Decision. Yes, adding sugar for a rich sweet flavor.'
            : 'Langkah ketujuh... Pilihan rasa. Kita tambahkan gula pasir untuk sensasi rasa manis yang pas.';
      }
    }

    try {
      this.synth.cancel();
      if (!this.maleVoice) {
        this.initVoices();
      }

      const utterance = new SpeechSynthesisUtterance(text);

      // Deep resonant bass male profile
      utterance.pitch = 0.70;
      utterance.rate = 0.88;
      utterance.volume = 1.0;

      if (this.maleVoice) {
        utterance.voice = this.maleVoice;
        utterance.lang = this.maleVoice.lang || 'id-ID';
      } else {
        utterance.lang = 'id-ID';
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        onComplete?.();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        onComplete?.();
      };

      this.synth.speak(utterance);
    } catch {
      this.isSpeaking = false;
      onComplete?.();
    }
  }

  public speakTest(message: string) {
    if (!this.enabled || !this.synth) return;
    this.stop();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.pitch = 0.70;
    utterance.rate = 0.88;
    if (this.maleVoice) utterance.voice = this.maleVoice;
    this.synth.speak(utterance);
  }
}

export const maleNarrator = new MaleVoiceNarrator();
