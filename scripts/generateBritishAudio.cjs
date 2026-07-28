// Generate MP3 audio files using ElevenLabs British voice (Charlotte)
// Run: node scripts/generateBritishAudio.cjs

const fs = require('fs');
const path = require('path');

const words = require('./wordlist.json');
const sentences = require('./sentencelist.json');
const API_KEY = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8').match(/ELEVENLABS_API_KEY=(.*)/)?.[1];

if (!API_KEY) {
  console.error('No ELEVENLABS_API_KEY found');
  process.exit(1);
}

const VOICE_ID = 'XB0fDUnXU5powFXDhCwa'; // Charlotte - British female
const WORD_DIR = path.join(__dirname, '..', 'public', 'audio', 'words');
const SENTENCE_DIR = path.join(__dirname, '..', 'public', 'audio', 'sentences');

fs.mkdirSync(WORD_DIR, { recursive: true });
fs.mkdirSync(SENTENCE_DIR, { recursive: true });

async function generate(text, outputPath) {
  if (fs.existsSync(outputPath)) {
    return 'skipped';
  }

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      // speed 1.0, not 0.85. At 0.85 the voice drags out sibilant endings, which
      // made -tion and -sion words ("navigation", "question", "television") sound
      // robotic and hold onto the final syllable. Compared against slower
      // variants by ear before settling here.
      voice_settings: { stability: 0.7, similarity_boost: 0.8, speed: 1.0 },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`${response.status}: ${err}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);
  return 'generated';
}

async function processBatch(items, label) {
  let generated = 0, skipped = 0, failed = 0;

  // Process one at a time to avoid rate limits
  for (let i = 0; i < items.length; i++) {
    const { text, outputPath } = items[i];
    try {
      const result = await generate(text, outputPath);
      if (result === 'generated') generated++;
      else skipped++;
    } catch (err) {
      console.error(`\nFailed: ${err.message}`);
      failed++;
      // Wait on rate limit
      if (err.message.includes('429')) {
        console.log('Rate limited, waiting 10s...');
        await new Promise(r => setTimeout(r, 10000));
        i--; // Retry
        failed--;
        continue;
      }
    }
    process.stdout.write(`\r  ${label}: ${i + 1}/${items.length} (${generated} new, ${skipped} exist, ${failed} failed)`);
  }
  console.log('');
  return { generated, skipped, failed };
}

async function main() {
  // Wiping everything is destructive and expensive: it deletes all ~680 files
  // and regenerates them, which takes a long time and costs real ElevenLabs
  // credit. It is therefore opt-in. By default generate() skips files that
  // already exist, so a plain run only fills in what is missing — to replace
  // specific words, delete just those files first, then run this.
  if (process.argv.includes('--force-regenerate-all')) {
    console.log('Clearing ALL audio files (--force-regenerate-all)...');
    for (const file of fs.readdirSync(WORD_DIR)) {
      fs.unlinkSync(path.join(WORD_DIR, file));
    }
    for (const file of fs.readdirSync(SENTENCE_DIR)) {
      fs.unlinkSync(path.join(SENTENCE_DIR, file));
    }
  } else {
    console.log('Filling in missing audio only. Pass --force-regenerate-all to rebuild every file.');
  }

  // Generate words
  const wordItems = words.map(word => ({
    text: word,
    outputPath: path.join(WORD_DIR, `${word}.mp3`),
  }));

  console.log(`\nGenerating ${wordItems.length} words...`);
  const wordResult = await processBatch(wordItems, 'Words');

  // Generate sentences
  const sentenceItems = sentences.map(({ word, sentence }) => ({
    text: sentence,
    outputPath: path.join(SENTENCE_DIR, `${word}.mp3`),
  }));

  console.log(`\nGenerating ${sentenceItems.length} sentences...`);
  const sentenceResult = await processBatch(sentenceItems, 'Sentences');

  console.log('\n=== DONE ===');
  console.log(`Words: ${wordResult.generated} generated, ${wordResult.skipped} skipped, ${wordResult.failed} failed`);
  console.log(`Sentences: ${sentenceResult.generated} generated, ${sentenceResult.skipped} skipped, ${sentenceResult.failed} failed`);
}

main();
