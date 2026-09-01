# Spend It All

Standalone browser-based incremental economic sandbox.

## Architecture

This repository owns the game itself: UI, simulation, content, scenarios, building systems, saves, and deployment.

LOK is intentionally external. The game connects to the broader LOK ecosystem through a modular adapter/API layer rather than living inside the ecosystem repository.

## Current playable slice

- Millionaire, Billionaire, and Trillionaire scenarios
- Simple and Advanced financial modes
- Data-driven purchases and unlocks
- Passive income and Advanced-mode upkeep
- Home progression toward town founding
- 1 LOK Token every 10 seconds of active runtime via the current local adapter
- Local save/load
- Light/Midnight theme hooks
- Responsive one-page UI

## Local development

```bash
npm install
npm run dev
```

## Vercel

Import `mistachatty-cmyk/spend-ut-all` directly. This is a standalone Next.js repository, so the Vercel Root Directory should remain the repository root (`.`).

No environment variables are required for the current MVP. Shared LOK wallet configuration will be added later through the integration layer.