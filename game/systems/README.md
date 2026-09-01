# Spend It All — Game Systems

This folder contains isolated gameplay systems. Each system owns one concern and exposes small pure functions so bugs can be traced without rewriting the whole simulation.

## Rules

- Keep systems deterministic where possible.
- Do not access React, DOM, localStorage, or Vercel APIs from system modules.
- Systems receive state/data and return results or updated state.
- Persisted save migrations belong in `save.ts`.
- External feeds (future Living Economy) enter through adapters/modifiers, not directly inside the core engine.
- UI imports system selectors/actions through the engine facade where practical.

## Planned modules

- `economy.ts` — gross income, upkeep, multipliers, net cash flow.
- `market-events.ts` — event scheduling and active event modifiers.
- `offline.ts` — capped offline earnings.
- `progression.ts` — house, town, region advancement.
- `upgrades.ts` — empire upgrade pricing/effects.
- `achievements.ts` — badge/achievement evaluation.
- `collectibles.ts` — collectible discovery, sets, rarity, rewards.
- `save.ts` — normalization/migrations for old saves.
- `world-modifiers.ts` — normalized scenario/historical/real-world economy modifiers.

The goal is for any system to be testable and debuggable in isolation.