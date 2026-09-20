# Secondary AI Intake Promotion

The companion intake repository is `mistachatty-cmyk/Spend-it-all-secondary-`.

## Purpose

Google AI Studio, Gemini, Codex, and similar builders may work in the intake repository. Production remains this repository. The Vercel production project deploys from this repository's `main` branch only.

## Promotion sequence

1. Intake work updates `handoff-manifest.json` and passes its validation workflow.
2. Codex compares the declared changed paths with this repository's current `main`.
3. Codex ports compatible modules and migrations; it does not replace the app shell or save model wholesale.
4. A Vercel preview must be `READY`.
5. Codex fast-forwards or merges the verified commit into `main`.
6. Vercel deploys `main` to `https://spend.gsix.online`.

## Compatibility boundaries

- Preserve the current purchase-visual system, Pixel / Real-life choice, and Potato / Mid / High settings.
- Keep Spend It All standalone. LOK integration stays modular under `integrations/lok/`.
- Bring real-life image assets only when the intake manifest records their local source and rights.
- Use additive migrations for `GameState` and local saves.
- Do not promote failing, unvalidated, or UI-shell replacement changes.
