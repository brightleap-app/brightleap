// Web Speech API wrapper
// Prefer en-GB voice, slightly slower rate for young learners

let preferredVoice = null;

function findBritishVoice() {
  if (preferredVoice) return preferredVoice;
  if (!window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();
  // Prefer en-GB voices
  preferredVoice =
    voices.find((v) => v.lang === 'en-GB' && v.localService) ||
    voices.find((v) => v.lang === 'en-GB') ||
    voices.find((v) => v.lang.startsWith('en')) ||
    null;

  return preferredVoice;
}

// Voices load asynchronously in some browsers
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    preferredVoice = null;
    findBritishVoice();
  };
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
    const voice = findBritishVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = 1.05;
    utterance.lang = 'en-GB';

    utterance.onend = () => resolve();
    utterance.onerror = (e) => {
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
  return 'speechSynthesis' in window;
}
