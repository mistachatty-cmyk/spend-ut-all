# Looper Implementation Plan

This is the execution companion to `docs/LOOPER_VISUAL_BIBLE.md` and `docs/LOOPER_PRODUCTION_RUNTIME.md`.

## Current build state

The first full Production Looper runtime is implemented.

Completed:
- all 24 canonical Firstlight characters have stable Production recipes
- Classic compact pixel art is preserved as a permanent fallback
- Production / Classic preference persists locally
- one-time Production rollout migration for existing saves
- canonical seven-state animation contract
- a production animation manifest for every Firstlight character
- shared mood/body animation system
- character-specific motion for all 24 characters
- motif-specific visual detail overlays
- global Effects ceiling integration
- one-time Animated rollout so old Static installs can see the release
- reduced-motion support
- starter trio uses Production renderer
- live companion HUD uses Production renderer
- live companions react to important game/micro-motion events
- LOKDEX uses Production characters and silhouettes
- Card Shop pulls, Binder and duplicate recycler use the shared Looper renderer
- local deterministic Looper Forge backend
- `/loopers` Production Lab with all 24 characters and all semantic states
- seeded Forge preview in the Production Lab
- TypeScript / production build verification workflow

## Runtime architecture

### Canonical visual source

`data/looper-hd-recipes.ts`
The editable Firstlight visual recipe roster: stable aliases, archetype, palette, glow and motif.

`app/components/LooperProductionSprite.tsx`
Canonical high-detail live renderer. This is code-native SVG, not a generic emoji layer or the old 10/16-pixel grid. It renders anatomy, faces, motif detail, material highlights, silhouettes and mood FX.

`app/components/PixelPetSprite.tsx`
Compatibility gateway. Normal UI should continue calling this component:
- Production -> `LooperProductionSprite`
- Classic -> legacy compact pixel sprites

### Production animation

`game/looper-production-types.ts`
Stable seven-state animation contract and signature-motion vocabulary.

`data/looper-production-manifests.ts`
Manifest coverage for every Firstlight character.

`app/looper-hd.css`
Shared semantic mood movement and structural animation.

`app/looper-character-motion.css`
Character-specific animation layer for all 24 Firstlight characters.

`game/systems/looper-behavior.ts`
Reusable event/reaction state vocabulary.

`app/components/PetCompanion.tsx`
Live advisor behavior and transient reactions to debt, rewards, cards, purchases and LOK activity.

### Forge

`integrations/lok/collectibles/pet-generator.ts`
Seeded metadata blueprint generator.

`integrations/lok/collectibles/looper-forge.ts`
Turns a blueprint into a playable Production recipe and animation manifest without requiring a paid runtime API.

`app/components/LooperProductionLab.tsx`
Developer visual QA and Forge preview.

`app/loopers/page.tsx`
Route: `/loopers`.

## Production quality contract

The approved creature-sheet direction remains the target quality bar. “Production” must mean:
- expressive readable silhouette
- face/personality that reads immediately
- deliberate material and value separation
- canonical palette
- recognizable motif/accessories
- at least one character-specific motion family
- all seven semantic states
- clean phone-size rendering
- attractive card/detail-size rendering
- no unrelated emoji as the primary character image

Common rarity is allowed to be simpler, but not low-quality. Higher rarity adds complexity, layers and FX rather than merely increasing saturation.

## Implemented animation states

Every Production Looper supports:
1. Idle
2. Happy
3. Notice / Excited
4. Worried
5. Sleep
6. Travel
7. Celebrate

The current runtime composes state-specific face/FX with species- and character-specific body motion. Future hand-authored raster atlases may replace or supplement the renderer without changing these state names.

## Starter trio standard

LOK Slime
- liquid/squash body language
- internal/floating cube detail
- bright milestone/reward reactions

Coin Cat
- coin/value motif
- tail motion and coin shine
- alert/happy reactions that fit the Money Watcher role

Espresso Bot
- service-robot anatomy
- screen/servo details
- coffee and steam behavior
- energetic Work Coach presentation

All later canonical character upgrades must meet or exceed the readability/personality of these three.

## Firstlight character-specific motion coverage

Wave A:
- Scrapshine Raccoon — scavenging/slink
- Tickstep Mouse — tick-step
- Leafline Lizard — tail/crawl
- Rippledash Otter — ripple glide
- Charm Crow — wing/charm motion
- Sparkwing Sparrow — spark jitter
- Pixel Puffer — inflate/pulse

Wave B:
- Wirewhisk Ferret — wire-tail slink
- Signalsilk Moth — signal-wing pulse
- Drift Duck — gentle drift
- Brick Badger — stomp
- Chime Cricket — chime/wing tick
- Shadow Raven — shadow pulse
- Wolf Pup — expressive tail

Wave C:
- Glassfang Cobra — glass glint/coil
- Towerhorn Stag — heavy stomp
- Timeslip Jelly — time distortion
- Orbit Owl — orbital ring
- Lunar Moth — lunar wing
- Moon Gecko — lunar tail/crawl
- Singularity Sprite — shard/orbit void motion

## Card / LOKDEX integration

Primary character surfaces already use the shared Production gateway:
- latest Card Shop pulls
- Binder
- duplicate recycler
- LOKDEX
- undiscovered silhouettes
- starter selection
- live companion HUD

Still optional art polish after the core runtime:
- illustrated pack/deck product art instead of emoji
- large character detail drawer
- edition-specific alternate art
- foil/holo shaders on the character portrait
- rarity-specific portrait environments

These are card-product/presentation upgrades, not blockers for the live Looper runtime.

## Classic compatibility

Classic Pixel Art is intentionally retained. It must remain gameplay-equivalent and selectable after Production is unlocked/rolled out. Static/Nothing Effects modes must also remain available.

## Generated characters

The Forge may create preview/generated collectibles, but:
- canonical names/IDs are curated
- generated previews cannot overwrite canon
- generated characters are collectible-first
- companion promotion remains an explicit design decision
- deterministic seed + generation must reproduce the same blueprint

## Raster export / future authored sprite atlases

The shipped Production renderer is code-native SVG so the whole Firstlight roster is editable and local in the repository. The previously generated concept/sprite-sheet images are references and source material, not automatically trustworthy frame atlases.

A future raster export/import pass may add PNG/WebP atlases under a stable asset directory. If added, preserve:
- IDs
- state names
- frame registration
- silhouette
- palette identity
- Classic fallback
- reduced-motion behavior

Do not block the live game on an image-generation API.

## Validation checklist

For every future Looper change:
1. Run the Looper coverage validator.
2. Run TypeScript.
3. Run the production build.
4. Open `/loopers`.
5. Test all seven states.
6. Check Production and Classic.
7. Check Effects Nothing/Static/Animated.
8. Check reduced motion.
9. Check starter selection on a narrow phone.
10. Check live companion clipping.
11. Check LOKDEX silhouettes.
12. Check Card Shop pulls and Binder.
13. Confirm all 24 canonical IDs still resolve.
14. Confirm generated preview IDs cannot collide with canon.

## Status

Core Production Looper phases A-D are implemented: canonical art runtime, all-24 animation coverage, live integration, and local Forge/QA surface.

The remaining work is iterative art-direction refinement based on live screenshots and future raster/edition assets, not missing core infrastructure.
