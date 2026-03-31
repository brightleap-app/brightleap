// Generate MP3 audio files for all spelling words using OpenAI TTS
// Run: node scripts/generateAudio.js

const fs = require('fs');
const path = require('path');

const words = require('./wordlist.json');
const API_KEY = process.env.OPENAI_API_KEY || fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8').match(/OPENAI_API_KEY=(.*)/)?.[1];

if (!API_KEY) {
  console.error('No OPENAI_API_KEY found');
  process.exit(1);
}

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'audio', 'words');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function generateAudio(word) {
  const outputPath = path.join(OUTPUT_DIR, `${word}.mp3`);

  // Skip if already generated
  if (fs.existsSync(outputPath)) {
    return 'skipped';
  }

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1',
      input: word,
      voice: 'nova', // Clear, friendly, works well for single words
      speed: 0.85,   // Slightly slower for young learners
      response_format: 'mp3',
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed for "${word}": ${response.status} ${err}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);
  return 'generated';
}

async function main() {
  console.log(`Generating audio for ${words.length} words...`);
  let generated = 0;
  let skipped = 0;
  let failed = 0;

  // Process in batches of 5 to avoid rate limits
  for (let i = 0; i < words.length; i += 5) {
    const batch = words.slice(i, i + 5);
    const results = await Promise.all(
      batch.map(async (word) => {
        try {
          const result = await generateAudio(word);
          if (result === 'generated') generated++;
          else skipped++;
          return result;
        } catch (err) {
          console.error(err.message);
          failed++;
          return 'failed';
        }
      })
    );
    process.stdout.write(`\r  ${i + batch.length}/${words.length} (${generated} new, ${skipped} skipped, ${failed} failed)`);
  }

  console.log(`\nDone! Generated: ${generated}, Skipped: ${skipped}, Failed: ${failed}`);
}

main();
