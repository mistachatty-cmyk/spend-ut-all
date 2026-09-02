# Looper Production Runtime

## Purpose

Production Looper Art is the canonical live character presentation for Spend It All. Classic Pixel Art remains a permanent lightweight/legacy option. The production runtime renders from stable Firstlight character recipes and never substitutes unrelated emoji or generic character placeholders on primary Looper surfaces.

The approved visual quality target is the detailed creature-collector concept direction: expressive silhouettes, readable faces, richer material/value separation, personality-specific motifs, strong rarity presentation, and animation that communicates game state.

## Canonical Firstlight roster

All 24 Firstlight LOKDEX characters have a canonical production recipe in `data/looper-hd-recipes.ts`. Each recipe carries stable IDs/aliases, creature archetype, palette, material/accent language, glow and motif. Companion aliases map the same canonical character into the live advisor system.

Production coverage:
1. LOK Slime
2. Scrapshine Raccoon
3. Tickstep Mouse
4. Coin Cat
5. Leafline Lizard
6. Rippledash Otter
7. Charm Crow
8. Espresso Bot
9. Sparkwing Sparrow
10. Pixel Puffer
11. Wirewhisk Ferret
12. Signalsilk Moth
13. Drift Duck
14. Brick Badger
15. Chime Cricket
16. Shadow Raven
17. Wolf Pup
18. Glassfang Cobra
19. Towerhorn Stag
20. Timeslip Jelly
21. Orbit Owl
22. Lunar Moth
23. Moon Gecko
24. Singularity Sprite

## Production renderer

`app/components/LooperProductionSprite.tsx` is the canonical live renderer. It creates deterministic high-detail SVG character art locally from each approved recipe. It supports:
- stable character identity and aliases
- transparent/scalable art
- responsive HUD/card/collection sizes
- mood-dependent faces
- species-specific anatomy
- motif-specific detail overlays
- signature FX layers
- silhouettes for undiscovered LOKDEX entries
- optional recipe override for locally forged preview characters

`app/components/PixelPetSprite.tsx` is the compatibility gateway used by normal game UI:
- Production -> `LooperProductionSprite`
- Classic -> preserved compact grid sprites

Starter selection, the live companion HUD, LOKDEX, Card Shop pulls, Binder, recycler and other existing `PixelPetSprite` surfaces therefore share one identity instead of duplicating art implementations.

## Art rollout and save compatibility

`game/systems/hud-preferences.ts` stores the art mode. `production` is the default. A one-time migration key (`spend-it-all-looper-production-art-v2`) moves existing installs to Production once so older local saves actually see the new release. After that migration, a player's Classic/Production choice persists normally.

Classic must never be deleted. It is the low-load, nostalgia and accessibility fallback.

## Animation contract

Every Production Looper supports the same semantic states:
- `idle`
- `happy`
- `excited` / notice
- `worried`
- `sleepy`
- `traveling`
- `celebrating`

`game/looper-production-types.ts` defines the stable animation contract and `data/looper-production-manifests.ts` provides a complete Firstlight manifest with a signature motion assignment for all 24 characters.

`app/looper-hd.css` provides shared body/mood animation. `app/looper-character-motion.css` adds character-specific behavior such as LOK Slime squash, Coin Cat tail/coin motion, Espresso Bot servo/steam, Signalsilk wing pulses, Orbit Owl rotation, Glassfang glints and Singularity shard/orbit motion.

Animations obey the global Effects / Micro Motion ceiling. Effects level 0-1 is still/static. Level 2+ enables normal Production motion. A one-time rollout upgrades existing Static installs to Animated once so the Production release is visible; the player can immediately select Static/Nothing afterward. `prefers-reduced-motion` disables Looper movement.

## Live reactions

`app/components/PetCompanion.tsx` combines simulation-aware status with transient event reactions. A live companion can react to:
- bankruptcy/debt pressure
- negative cash flow
- world events
- travel
- fatigue/jet lag
- major progression
- rewards
- purchases
- card activity
- LOK movement

The visual state changes with the communication state rather than running an unrelated decorative loop.

`game/systems/looper-behavior.ts` defines the reusable event/reaction vocabulary and priorities for future surfaces.

## Local Looper Forge

The original `integrations/lok/collectibles/pet-generator.ts` remains the deterministic metadata blueprint generator.

`integrations/lok/collectibles/looper-forge.ts` converts that blueprint into:
- a stable preview ID
- a Production Looper visual recipe
- palette/material roles
- a motif
- a signature animation family
- a complete production animation manifest

This is local, deterministic and free at runtime. No external image API is required for a generated collectible to receive a playable preview. Canonical named Firstlight characters remain curated and are never silently replaced by generated designs.

`/loopers` is the production verification lab. It shows all 24 canonical characters, lets a developer switch every semantic animation state, and includes a seeded Forge preview. This is intentionally a development/QA surface rather than a new game mode.

## Visual standard

Every future canonical Looper must:
1. Have a stable LOKDEX ID and canonical name.
2. Resolve through the Production recipe registry.
3. Be recognizable in silhouette.
4. Have base/light/dark/accent/glow color roles.
5. Have a distinct motif tied to description/personality.
6. Render every semantic game mood without emoji fallback.
7. Have character-specific movement in addition to shared mood motion.
8. Respect the Effects level and reduced-motion settings.
9. Remain readable at live HUD size and attractive at card/detail size.
10. Work through the shared renderer in starter, HUD, LOKDEX, cards and collection contexts.

## Raster/sprite-sheet export

The canonical shipped renderer is deliberately code-native SVG so all characters are local, editable, deterministic, lightweight and available in the repository without an image-generation service at runtime. Raster PNG/WebP animation atlases may be exported later as derived assets for native clients or alternate renderers. Stable IDs, states and manifests must not change when adding those derived exports.

Generated concept sheets are art-direction references; they are not silently treated as shippable frame atlases. Any future raster replacement must be deliberately cut/cleaned, preserve canonical identity and pass the same state/size checks.

## QA

Before changing Looper production code:
- run `npm run typecheck`
- run `npm run build`
- open `/loopers`
- test all seven mood buttons
- test Production and Classic
- test Effects 0, 1, 2 and at least one high level
- test reduced motion
- check starter onboarding
- check live companion clipping
- check LOKDEX undiscovered silhouettes
- check Card Shop pulls and Binder
- verify all 24 manifests still resolve

## Do not regress

Do not replace Production Loopers with affinity emoji, generic icons, or old 10/16-pixel placeholders on primary character surfaces. Do not make Production art mandatory for low-power/reduced-motion users. Do not let the Forge overwrite canon IDs. Do not give visual rarity or companion choice hidden economic power.
