// Generate MP3 audio files for all sentences using OpenAI TTS
// Run: node scripts/generateSentences.cjs

const fs = require('fs');
const path = require('path');

const entries = require('./sentencelist.json');
const API_KEY = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8').match(/OPENAI_API_KEY=(.*)/)?.[1];

if (!API_KEY) {
  console.error('No OPENAI_API_KEY found');
  process.exit(1);
}

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'audio', 'sentences');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function generateAudio(word, sentence) {
  const outputPath = path.join(OUTPUT_DIR, `${word}.mp3`);

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
      input: sentence,
      voice: 'nova',
      speed: 0.85,
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
  console.log(`Generating sentence audio for ${entries.length} words...`);
  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < entries.length; i += 5) {
    const batch = entries.slice(i, i + 5);
    await Promise.all(
      batch.map(async ({ word, sentence }) => {
        try {
          const result = await generateAudio(word, sentence);
          if (result === 'generated') generated++;
          else skipped++;
        } catch (err) {
          console.error(err.message);
          failed++;
        }
      })
    );
    process.stdout.write(`\r  ${Math.min(i + 5, entries.length)}/${entries.length} (${generated} new, ${skipped} skipped, ${failed} failed)`);
  }

  console.log(`\nDone! Generated: ${generated}, Skipped: ${skipped}, Failed: ${failed}`);
}

main();
