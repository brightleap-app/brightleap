// Web Speech API wrapper
// Prefer high-quality en-GB voice, with iOS-specific fallbacks

let preferredVoice = null;
let voicesLoaded = false;

// Known high-quality voices by platform
const PREFERRED_VOICES = [
  // iOS / macOS high-quality voices
  'Daniel',           // en-GB, best quality on Apple
  'Kate',             // en-GB
  'Serena',           // en-GB
  'Martha',           // en-GB
  // Desktop Chrome / Edge
  'Google UK English Female',
  'Google UK English Male',
  'Microsoft Libby Online (Natural)',
  'Microsoft Ryan Online (Natural)',
  // Fallback — Samantha is common on iOS and less robotic
  'Samantha',
];

function findBestVoice() {
  if (!window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // First pass: look for our preferred voices (in priority order)
  for (const name of PREFERRED_VOICES) {
    const match = voices.find((v) =>
      v.name.includes(name) && v.lang.startsWith('en')
    );
    if (match) return match;
  }

  // Second pass: any en-GB voice, prefer non-local (cloud) voices
  const enGBCloud = voices.find((v) => v.lang === 'en-GB' && !v.localService);
  if (enGBCloud) return enGBCloud;

  const enGB = voices.find((v) => v.lang === 'en-GB');
  if (enGB) return enGB;

  // Third pass: any English voice, prefer cloud
  const enCloud = voices.find((v) => v.lang.startsWith('en') && !v.localService);
  if (enCloud) return enCloud;

  const en = voices.find((v) => v.lang.startsWith('en'));
  if (en) return en;

  return null;
}

function ensureVoice() {
  if (!preferredVoice || !voicesLoaded) {
    preferredVoice = findBestVoice();
    voicesLoaded = true;
  }
  return preferredVoice;
}

// Voices load asynchronously — re-evaluate when they arrive
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    voicesLoaded = false;
    preferredVoice = null;
    ensureVoice();
  };
  // Try immediately too (some browsers have voices ready synchronously)
  ensureVoice();
}

function speak(text, rate = 0.82) {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error('Speech synthesis not available'));
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = ensureVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = 1.05;
    utterance.lang = 'en-GB';

    // iOS workaround: speechSynthesis can pause indefinitely
    // Resume it if it gets stuck
    let resumeTimer = null;
    const startResumeCycle = () => {
      resumeTimer = setInterval(() => {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) return;
        if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      }, 300);
    };

    utterance.onstart = () => startResumeCycle();
    utterance.onend = () => {
      clearInterval(resumeTimer);
      resolve();
    };
    utterance.onerror = (e) => {
      clearInterval(resumeTimer);
      if (e.error === 'canceled') resolve();
      else reject(e);
    };

    window.speechSynthesis.speak(utterance);
  });
}

export function speakWord(word) {
  return speak(word, 0.75);
}

export function speakSentence(sentence) {
  return speak(sentence, 0.82);
}

export function isSpeechAvailable() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}
