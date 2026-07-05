# CLAUDE.md

This is a dyslexia-friendly KS2 SATs spelling revision app called Brightleap.

## First Steps
- Read `README.md` for what the app is, the tech stack, and how to run it locally
- Read `CONTRIBUTING.md` for the contribution workflow and the golden rules
- Database setup lives in `docs/supabase-setup.sql` / `docs/supabase-setup-v2.sql`

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
