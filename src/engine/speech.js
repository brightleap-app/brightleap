// Speech engine — uses pre-generated MP3 audio files first,
// falls back to Web Speech API if audio file not available.
// MP3 files generated via OpenAI TTS (Nova voice, en-GB style)

let preferredVoice = null;
let voicesLoaded = false;

// --- Pre-generated audio playback ---

function getAudioUrl(word) {
  return `/audio/words/${word.toLowerCase()}.mp3`;
}

function playAudioFile(word, rate = 1.0) {
  return new Promise((resolve, reject) => {
    const audio = new Audio(getAudioUrl(word));
    audio.playbackRate = rate;
    audio.onended = () => resolve();
    audio.onerror = () => reject(new Error('Audio file not found'));
    audio.play().catch(reject);
  });
}

function playSentenceAudio(word) {
  return new Promise((resolve, reject) => {
    const audio = new Audio(`/audio/sentences/${word.toLowerCase()}.mp3`);
    audio.onended = () => resolve();
    audio.onerror = () => reject(new Error('Sentence audio not found'));
    audio.play().catch(reject);
  });
}

// --- Web Speech API fallback ---

const PREFERRED_VOICES = [
  'Daniel', 'Kate', 'Serena', 'Martha',
  'Google UK English Female', 'Google UK English Male',
  'Microsoft Libby Online (Natural)', 'Microsoft Ryan Online (Natural)',
  'Samantha',
];

function findBestVoice() {
  if (!window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  for (const name of PREFERRED_VOICES) {
    const match = voices.find((v) => v.name.includes(name) && v.lang.startsWith('en'));
    if (match) return match;
  }

  return (
    voices.find((v) => v.lang === 'en-GB' && !v.localService) ||
    voices.find((v) => v.lang === 'en-GB') ||
    voices.find((v) => v.lang.startsWith('en') && !v.localService) ||
    voices.find((v) => v.lang.startsWith('en')) ||
    null
  );
}

function ensureVoice() {
  if (!preferredVoice || !voicesLoaded) {
    preferredVoice = findBestVoice();
    voicesLoaded = true;
  }
  return preferredVoice;
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    voicesLoaded = false;
    preferredVoice = null;
    ensureVoice();
  };
  ensureVoice();
}

function speakWithWebAPI(text, rate = 0.82) {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error('Speech synthesis not available'));
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = ensureVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = 1.05;
    utterance.lang = 'en-GB';

    let resumeTimer = null;
    utterance.onstart = () => {
      resumeTimer = setInterval(() => {
        if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      }, 300);
    };
    utterance.onend = () => { clearInterval(resumeTimer); resolve(); };
    utterance.onerror = (e) => {
      clearInterval(resumeTimer);
      if (e.error === 'canceled') resolve();
      else reject(e);
    };

    window.speechSynthesis.speak(utterance);
  });
}

// --- Safety net ---

// An <audio> element that stalls mid-download fires neither 'ended' nor 'error',
// and speechSynthesis can silently stop firing 'end' altogether. Either case
// would leave a caller awaiting forever, stranding the UI on "Listening...".
// Always settle: resolve once the speech finishes, or after a ceiling, or on
// failure — callers treat all three the same and simply carry on.
function alwaysSettles(promise, timeoutMs) {
  let timer;
  const ceiling = new Promise((resolve) => {
    timer = setTimeout(resolve, timeoutMs);
  });
  return Promise.race([
    Promise.resolve(promise).catch(() => {}),
    ceiling,
  ]).finally(() => clearTimeout(timer));
}

const WORD_TIMEOUT_MS = 8000;
const SENTENCE_TIMEOUT_MS = 20000;

// --- Public API ---

export function speakWord(word) {
  // Try pre-generated MP3 first, fall back to Web Speech API
  return alwaysSettles(
    playAudioFile(word).catch(() => speakWithWebAPI(word, 0.75)),
    WORD_TIMEOUT_MS,
  );
}

export function speakSentence(sentence, word) {
  // Try pre-generated sentence MP3 (keyed by word), fall back to Web Speech API
  const speech = word
    ? playSentenceAudio(word).catch(() => speakWithWebAPI(sentence, 0.82))
    : speakWithWebAPI(sentence, 0.82);
  return alwaysSettles(speech, SENTENCE_TIMEOUT_MS);
}

export function isSpeechAvailable() {
  // Always true now — we have MP3 files as primary
  return true;
}
