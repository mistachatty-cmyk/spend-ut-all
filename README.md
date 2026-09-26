# Spend It All

Standalone browser-based incremental economic sandbox.

## Architecture

This repository owns the game itself: UI, simulation, content, scenarios, building systems, saves, and deployment.

LOK is intentionally external. The game connects to the broader LOK ecosystem through a modular adapter/API layer rather than living inside the ecosystem repository. The current adapter lives under `integrations/lok/` and can later be replaced with the authoritative shared wallet/ledger service.

LOKdex cards are portable across the G-Six universe: any owned card can be exported as a `lok.card-exchange` JSON file from `/cards` → Universe Exchange, and a card exported by another LOK game can be imported back in as a visiting card. See `docs/LOK_CARD_EXCHANGE_PROTOCOL.md` for the exact contract another game implements to participate, and `docs/LOK_PORTABLE_ASSET_SPEC.md` for the broader portable-asset contract this specializes.

## Changelog — read this before shipping a player-visible change

`data/changelog.ts` is the single source of truth behind the persistent
"see what's new" link at the bottom of every page and the one-time update
popup (`app/components/UpdateCenter.tsx`, mounted in `app/layout.tsx`) —
same pattern as 616 Survivor's changelog/update popup, kept consistent
across the LOK ecosystem. **Appending an entry there is part of shipping
any real update or hotfix, the same way running `npm run typecheck` is —
not an optional chore, for every contributor or AI agent working in this
repo.** The file's own header comment has the exact convention (bump MINOR
for a real update, PATCH for a hotfix, just append — `CURRENT_VERSION`
derives from the array automatically). If you touch `app/layout.tsx`,
don't let the `<UpdateCenter />` mount get edited away as collateral
damage from an unrelated change — that exact regression happened to 616
Survivor's equivalent feature and went unnoticed for over a week.

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

See `DEPLOYMENT.md` for the preview verification checklist.