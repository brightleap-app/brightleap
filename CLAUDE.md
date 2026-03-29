# CLAUDE.md

This is a dyslexia-friendly KS2 SATs spelling revision app called Brightleap.

## First Steps
- Read `PROJECT_BRIEF.md` for full context, architecture, and design principles
- Read `docs/PHASE_PLAN.md` for the implementation sequence
- Read `docs/research.md` if you need background on pedagogy, accessibility, or GDPR

## Tech Stack
- React (Vite) + Tailwind CSS
- Web Speech API for pronunciation
- localStorage (Phase 1), Supabase (Phase 2+)
- Deployed to Cloudflare Pages from GitHub

## Critical Rules
1. Audio-first: words are SPOKEN before the child types them, never displayed first
2. Accessibility settings must use CSS custom properties — no hardcoded fonts or sizes
3. Use the storage abstraction layer (`storage/progress.js`) — never call localStorage directly
4. Adding features = adding new files. Do NOT modify core engine files.
5. All feedback must be warm and encouraging. No punitive language.
6. Touch targets minimum 48px. Responsive for laptop and iPhone.
7. No justified text. Left-aligned, short line lengths, generous spacing.

## Testing
- Test speech API in Chrome and Safari
- Test on both desktop and mobile viewport sizes
- Handle speechSynthesis being unavailable gracefully
