# Brightleap

**A dyslexia-friendly revision app for UK KS2 (Year 6) children preparing for their SATs.**

🌐 Live at **[brightleap.co.uk](https://brightleap.co.uk)**

Brightleap helps children revise **spelling** and **maths** through short, warm, game-like sessions designed to work well for dyslexic and neurodivergent learners. It is audio-first (words are spoken before they're typed), accessible by default, and deliberately free of ads, leaderboards, and manipulative "engagement" patterns.

## Project status

Brightleap was built for one child, who has since sat her SATs — so it isn't being actively developed by its original author any more. It works, it's live, and it's open source so that it can carry on rather than quietly disappear.

**Help is welcome, and so is a bigger role.** To contribute, start with the [open issues](../../issues). If you're interested in taking the project further, or forking it into something of your own, there's [an open discussion about exactly that](../../discussions/9) — do say hello.

---

## What's inside

- **Spelling practice** — audio-first retrieval practice with a spaced-repetition engine that brings tricky words back more often and spaces out mastered ones.
- **Maths practice** — topic trails covering fractions, decimals and percentages, with hints, worked solutions, and plain-English analogies.
- **Mock SATs & a diagnostic** — timed-style practice and a starting assessment that points children at the right topics.
- **Arcade** — short mini-games earned as rewards, never as an infinite loop.
- **Avatars & themes** — light personalisation to make it feel like the child's own.
- **Elizabeth, the helper** — a friendly guide character who reacts and encourages during play.
- **Accessibility panel** — adjustable font (including OpenDyslexic), text size, line spacing, and background colour, applied through CSS custom properties.
- **Accounts & guest mode** — play instantly with no account (progress saved locally), or sign in to sync progress across devices via Supabase.

## Design principles

1. **Audio-first, never display-first** — words are spoken before the child attempts them.
2. **Dyslexia-friendly by default, customisable by choice.**
3. **Warm and encouraging, never punitive** — mistakes explain the pattern; there are no red crosses.
4. **Short sessions with natural endpoints** — roughly 5–10 minutes.
5. **Ethically designed** — no ads, no dark patterns, no public leaderboards; built with GDPR and the ICO Children's Code in mind.

## Tech stack

- **[React 19](https://react.dev/)** with **[Vite](https://vite.dev/)**
- **[Tailwind CSS](https://tailwindcss.com/)**
- **[React Router](https://reactrouter.com/)**
- **Web Speech API** (`SpeechSynthesis`) for pronunciation
- **[Supabase](https://supabase.com/)** for auth and progress sync (with a localStorage fallback for guest mode)
- Hosted on **[Cloudflare Pages](https://pages.cloudflare.com/)**

## Getting started

You'll need **[Node.js](https://nodejs.org/) 20 or newer** and npm.

```bash
# 1. Clone your fork
git clone https://github.com/brightleap-app/brightleap.git
cd brightleap

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# then open .env.local and add your Supabase values (see below)

# 4. Start the dev server
npm run dev
```

### Environment variables

Brightleap reads two variables at build time (see [`.env.example`](.env.example)):

| Variable | What it is |
| --- | --- |
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | The Supabase **publishable / anon** key (safe to expose — protected by Row Level Security) |

You can create a free Supabase project and paste its URL and anon key in. The SQL to set up the tables lives in [`docs/`](docs/).

> **Heads-up for first-time contributors:** the app currently expects these variables to be present and will error on start if they're missing, even though guest mode is designed to work without an account. Making it degrade gracefully is a great [good first issue](../../issues) — see [CONTRIBUTING.md](CONTRIBUTING.md).

### Available scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Start the local dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build locally |

## Project structure

```
src/
├── engine/      # Framework-agnostic logic: quiz, speech, spaced repetition, maths validation
├── data/        # All content as JSON (spelling lists, maths questions) — separated from logic
├── screens/     # Route-level pages (spelling, maths, mock SATs, home, settings…)
├── features/    # Bolt-on modules: arcade, avatars, accessibility panel
├── themes/      # Theme skins + ThemeContext
├── auth/        # Account system (does not touch engine/)
├── storage/     # progress.js — the storage abstraction (localStorage ↔ Supabase)
├── lib/         # supabase.js client
├── App.jsx      # Routing
└── main.jsx
```

## How it's deployed

Pushing to `main` triggers an automatic build on Cloudflare Pages, which publishes to [brightleap.co.uk](https://brightleap.co.uk). **Every pull request also gets its own live preview URL** (`https://<branch>.brightleap.pages.dev`), so changes can be seen running before they're merged.

## Contributing

Contributions are very welcome — especially **new practice content** (spelling words and maths questions), accessibility improvements, and tests. Please read **[CONTRIBUTING.md](CONTRIBUTING.md)** first; it explains the golden rules (audio-first, accessibility, and "add new files rather than modifying the core engine") and the review workflow.

By taking part you agree to our [Code of Conduct](CODE_OF_CONDUCT.md).

## Privacy & safeguarding

Brightleap is built for children. It collects as little as possible — no date of birth, surname, school, or location — and follows GDPR and the ICO Children's Code. Security concerns can be reported privately: see [SECURITY.md](SECURITY.md).

## Licence and reuse

The code is [MIT licensed](LICENSE) — you're free to use it, modify it, and build on it, including commercially, without asking permission.

Two things worth saying plainly:

- **If you're planning something commercial, please get in touch first as a courtesy.** That isn't a legal condition of the licence — just good manners, and I'd genuinely like to know what you're building.
- **The Brightleap name and the brightleap.co.uk domain aren't covered by the licence.** If you fork this into a product of your own, please give it a name of your own too.

Built with care by a parent and child. If it helps your child as well, that's the whole point.
