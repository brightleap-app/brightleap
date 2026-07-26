# Contributing to Brightleap

Thank you for considering a contribution! Brightleap is a learning tool for children — many of them dyslexic or neurodivergent — so kindness, clarity, and accessibility matter here even more than usual. This guide explains how to help.

## Ways to contribute

You don't need to be a developer to help:

- **📝 Add practice content** — new spelling words or maths questions. This is the highest-value, lowest-friction contribution (see below).
- **♿ Improve accessibility** — better ARIA, keyboard navigation, colour contrast, screen-reader support.
- **🐛 Report or fix bugs** — open an issue, or send a pull request.
- **🧪 Add tests** — the engine currently has none; pure functions in `src/engine/` are a great place to start.
- **📖 Improve docs** — fix anything unclear or out of date.
- **💡 Suggest features** — open a feature request and let's discuss it first.

Browse the [good first issue](../../issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) label for a gentle way in.

## The golden rules

These keep the app coherent, accessible, and safe. Please follow them:

1. **Audio-first, never display-first.** Words are *spoken* before the child types them — never shown first.
2. **Accessibility via CSS custom properties.** Never hardcode fonts or sizes; use the existing custom properties so the accessibility panel keeps working.
3. **Use the storage abstraction.** Go through `src/storage/progress.js` — never call `localStorage` or Supabase directly from screens or features.
4. **Add new files rather than modifying the core engine.** New features should be new modules under `features/`, `screens/`, or `data/`. Avoid changing files in `engine/` unless you're fixing a genuine bug there.
5. **Warm, encouraging language only.** No punitive wording, no "Wrong!", no red crosses. Mistakes should teach.
6. **Touch targets are at least 48px** and the UI must work on both laptop and phone.
7. **No justified text.** Left-align, keep line lengths short, keep spacing generous.

## Adding practice content (no coding needed)

Content lives as JSON in `src/data/`. The maths banks are self-documenting — open an existing file (e.g. `src/data/maths/fractions/identifying.json`) and copy the shape of an existing question:

```json
{
  "id": "unique-id",
  "module": "fractions",
  "topic": "identifying",
  "difficulty": 1,
  "question_text": "What fraction is shaded?",
  "question_display": "…",
  "correct_answer": "1/2",
  "hint": "Count the shaded parts out of the total.",
  "worked_solution_steps": ["…"],
  "analogy": "Think of a pizza cut into equal slices."
}
```

Add your items to the relevant file, keep IDs unique, and open a pull request. Please double-check answers carefully — this is content children will trust.

## Development setup

See [README.md](README.md#getting-started) for full setup. In short: Node 20+, `npm install`, copy `.env.example` to `.env.local`, then `npm run dev`.

## The workflow

**You don't need to ask permission first — just fork and open a pull request.** There's no need to comment asking to be assigned an issue, and issues aren't reserved for anyone. If you'd like to work on something, go ahead. For anything large or open-ended, it's worth opening an issue to discuss the approach before you write much code, so your effort isn't wasted.

If an issue already has a linked pull request, someone is likely on it — pick another, or offer to help review theirs.

1. **Fork** the repository and create a branch from `main` (e.g. `add-decimals-questions`).
2. Make your change, keeping commits focused and clearly described.
3. Run it locally (`npm run dev`) and check your change works.
4. **Open a pull request** against `main`.
5. A maintainer will review and merge. `main` is protected, so nothing goes live without review.

**A note on timing:** this project is maintained in spare time around other work, so reviews may take a little while — please don't read silence as disinterest. Because the app is used by real children, content and logic changes get read carefully rather than merged quickly. Thank you for your patience.

**About preview builds:** the live site rebuilds automatically when a pull request is merged. Note that Cloudflare does not generate preview URLs for pull requests from forks (a deliberate security measure), so please test locally and include a screenshot for any visual change.

### Pull request checklist

- [ ] The app builds (`npm run build`) and runs (`npm run dev`) without errors.
- [ ] I followed the golden rules above.
- [ ] UI changes work on both desktop and a phone-sized viewport.
- [ ] Any new content has been checked for correctness.
- [ ] I described *what* changed and *why*.

## Style

Match the surrounding code. This is a React + Vite + Tailwind project; keep components small and readable, and prefer clarity over cleverness. (Linting and formatting config are on the roadmap — until then, please keep diffs tidy.)

## Code of Conduct

All participation is covered by our [Code of Conduct](CODE_OF_CONDUCT.md). Be kind.

## Questions

Not sure about something? Open a [discussion or issue](../../issues) and ask — no question is too small.
