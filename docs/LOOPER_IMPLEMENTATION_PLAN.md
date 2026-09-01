# Looper Implementation Plan

This is the execution companion to `docs/LOOPER_VISUAL_BIBLE.md`.

## Current build state

Completed in the first production pass:
- canonical Pixel+ registry architecture
- 24 Firstlight LOKDEX character sprite coverage
- preserved Classic companion sprite set
- Pixel+ / Classic preference stored with HUD preferences
- Settings-only visual control surface for switching Looper art style
- semantic animation mappings for every production sprite
- actual pixel-frame animation generation for all semantic moods
- shared Pixel+ movement library
- signature FX layers for Firstlight characters
- global Effects ceiling integration
- reduced-motion support
- starter companion prompt uses the shared sprite renderer
- companion HUD uses the shared sprite renderer
- LOKDEX uses canonical sprites and real silhouettes
- Card Shop latest pulls use Looper art instead of character emoji
- Card Shop Binder uses Looper art instead of character emoji
- Card Shop duplicate recycler uses Looper art
- Card District includes a Pixel+ showcase strip

## Runtime architecture

`data/pixel-pet-sprites.ts`
Wave 1 and shared sprite/motion types.

`data/pixel-pet-sprites-wave2.ts`
Second production batch.

`data/pixel-pet-sprites-wave3.ts`
Final Gen 1 completion batch.

`data/looper-sprite-registry.ts`
Single lookup registry used by runtime UI.

`data/classic-pet-sprites.ts`
Preserved legacy compact companion art.

`game/systems/looper-frame-animation.ts`
Generates real pixel-frame sequences from canonical grids for idle, happy, excited, worried, sleepy, traveling, and celebrating states.

`app/components/PixelPetSprite.tsx`
Shared runtime renderer. This is the only component normal UI code should need to render a Looper. It combines frame animation, body motion, art-style selection, signature FX, and the global Effects ceiling.

`app/looper-animations.css`
Shared motion archetypes and first signature FX set.

`app/looper-signature-fx.css`
Additional character-specific FX layers.

`app/looper-card-art.css`
Card/Binder presentation.

## Animation quality stages

Stage A — complete
Every Looper has semantic moods mapped to body animation plus optional signature FX.

Stage B — complete
Every Looper now receives actual pixel-grid frame changes in addition to transforms. Static/Nothing effects remain still.

Stage C — next polish pass
Add bespoke hand-authored pose frames for the starter trio on top of the shared generator:
- LOK Slime: blink, squash, internal mote pop, celebrate burst
- Coin Cat: blink, ear flick, tail curl, coin toss/catch
- Espresso Bot: eye panel expressions, servo arm, steam puff, coffee reaction

Stage D
Add bespoke signature poses to Rare/Epic/Legendary/Mythic characters, prioritizing Orbit Owl, Signalsilk Moth, Glassfang Cobra, Moon Gecko, Wolf Pup, and Singularity Sprite.

Stage E
Add event-specific semantic reactions: moneyUp, moneyDown, purchaseReaction, worldEvent, notice, tip, signature.

## Art quality stages

Pixel+ v1 is implemented as structured pixel data so it ships immediately, remains crisp at every device size, and is editable by future agents without binary tooling.

Future Pixel+ v2 may replace selected canonical grids with externally authored PNG/WebP sprite sheets. If that happens:
- preserve stable IDs
- preserve palette identity and silhouette
- retain structured-grid fallback
- do not remove Classic mode
- use transparent assets
- export nearest-neighbor safe sizes
- keep all semantic animation state names

## Card Shop migration

Already migrated:
- latest opening cards
- Binder
- recycler
- top Looper showcase

Still optional for later polish:
- replace pack/deck emoji with original illustrated product icons
- add large character detail drawer
- edition-specific alternate art
- foil/holo shader overlays on the actual Looper portrait
- rarity-specific portrait environments

## Companion migration

Current starter trio is production-integrated.
Next companion polish:
- unique speech cadence/personality copy pools
- signature notice animation when advice changes
- small event icon beside important warnings
- companion detail page in Style
- animation preview control in Style

## Performance rules

- Static/Nothing effects never run character frame or FX loops.
- Animated is the normal production target.
- High/Uber/Absurd may layer additional global particles, but core character readability comes first.
- Avoid more than one expensive filter/backdrop effect per portrait.
- Keep mobile portrait sizes compact.
- Respect reduced motion.
- Classic art remains the lowest-load fallback.

## Future unlock plan

Simple UI remains permanent.
Advanced Command UI is temporarily available to everyone while in development.
Later, meaningful progression can unlock Advanced UI as a discovery/reveal, but it must remain toggleable off forever.

Looper Pixel+ art is presentation, not an economic advantage. Classic and Pixel+ must remain gameplay-equivalent.

## Validation checklist for future AI agents

Before changing Looper visuals:
1. Read `LOOPER_VISUAL_BIBLE.md`.
2. Preserve stable IDs.
3. Check phone, tablet, and desktop sizing.
4. Check Nothing/Static animation levels.
5. Check reduced-motion behavior.
6. Check LOKDEX silhouette rendering.
7. Check starter selection.
8. Check companion HUD clipping.
9. Check Card Shop pull and Binder layouts.
10. Never replace canonical characters with unrelated generated designs without an explicit migration decision.
