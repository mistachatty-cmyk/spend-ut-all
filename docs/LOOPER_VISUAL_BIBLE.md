# LOK Loopers — Visual & Animation Bible

Status: active production reference for Spend It All / LOK ecosystem.

## Purpose
Loopers of Knowledge are the canonical companion-creatures of the LOK ecosystem. This document defines how future humans and AI agents should design, animate, name, implement, and extend them without drifting away from the established visual language.

The current art direction is original creature-collector pixel art: readable silhouettes, expressive faces, distinct materials, strong personality, and a polished game-UI presentation. It may evoke the appeal of creature-collecting games, but designs must remain original and must not copy a specific existing creature, silhouette, palette, prop, or identifying feature.

## Canon rules
- Keep stable LOKDEX IDs and names unless a deliberate migration is approved.
- LOK Slime, Coin Cat, Espresso Bot, Tickstep Mouse, Charm Crow, Pixel Puffer, Sparkwing Sparrow, Leafline Lizard, Wirewhisk Ferret, Signalsilk Moth, Orbit Owl, Glassfang Cobra, Moon Gecko, and Singularity Sprite are priority visual anchors.
- LOKDEX character ownership, card ownership, and equippable companion ownership are separate concepts.
- Loopers may provide contextual information/personality benefits, but cosmetic acquisition must not grant direct hidden cash multipliers.
- Classic pixel designs remain supported as an optional visual style. Pixel+ is the preferred modern presentation.

## Pixel+ art standard
- Master logical canvas: 18×18 to 24×24 cells for normal characters. Large Legendary/Mythic silhouettes may extend to 26×26 internally, then fit the same viewport.
- Render nearest-neighbor only. Never blur pixel edges.
- Prefer 5–8 colors for Common/Uncommon, 7–10 for Rare/Epic, and up to 12 plus FX accents for Legendary/Mythic.
- Every character needs a dark outline family, a midtone body family, highlight/shadow values, eye color, and optional emissive accent.
- Silhouette must remain recognizable at 32 CSS pixels.
- Faces should be readable at 40–48 CSS pixels.
- Avoid visual noise in the center of the face/body; detail is concentrated around silhouette, materials, markings, props, and FX.

## Rarity language
Common: simple strong silhouette, 4–6 colors, one memorable feature.
Uncommon: extra markings/material changes and one small secondary detail.
Rare: richer shading, prop/accessory or glow, more expressive animation.
Epic: complex silhouette/material, persistent subtle FX, stronger signature reaction.
Legendary: premium silhouette, layered FX, larger celebration and environmental presence.
Mythic: may alter the visual space around the portrait with debris, distortion, orbit, aura, or holographic fragments.

## Animation contract
Every production Looper supports these semantic states, even if some reuse a shared motion profile:
- idle
- happy
- excited
- worried
- sleepy
- traveling
- celebrating

Recommended future expansion:
- notice
- tip
- moneyUp
- moneyDown
- purchaseReaction
- worldEvent
- signature

Animation is layered:
1. base sprite pose
2. body transform (bob/squash/hover/flutter/etc.)
3. expression or frame variant
4. accessory layer
5. character signature FX
6. global effects ceiling from the game Effects setting

Nothing/Static effects must show a clean still sprite. Animated enables standard loops. High/Uber/Absurd may add layered FX and larger reactions. Respect reduced-motion preferences.

## Motion archetypes
Slime: squash, stretch, internal mote drift.
Feline: tail sway, ear flick, coin reaction.
Robot: servo bob, blink panels, steam puff.
Rodent: fast notice twitch, clock/tail motion.
Bird: feather/wing hop, head tilt.
Puffer: inflate/deflate and spike pop.
Lizard: low crawl, tail curl, leaf/circuit pulse.
Ferret: long-body slink, whisker spark.
Moth: hover/flutter, signal ring pulse.
Owl: slow hover/head turn, orbital ring motion.
Snake: coil breathe, hood shimmer, glass highlight.
Cosmic/Mythic: hover plus independent orbit/debris/aura layers.

## Starter trio personalities
LOK Slime — Balanced Guide: general progression, milestones, risk, events.
Coin Cat — Money Watcher: purchases, cash flow, prices, value, deal alerts.
Espresso Bot — Work Coach: active earning, fatigue, schedule, work blocks, efficiency.

These are information advantages, not direct economic multipliers.

## Priority Pixel+ wave 1
1. LOK Slime — translucent emerald data-slime, internal square motes.
2. Coin Cat — warm gold/caramel cat, coin charm, expressive tail.
3. Espresso Bot — compact ceramic/steel service robot, cyan eyes, coffee/steam details.
4. Tickstep Mouse — workshop mouse, clockwork pack, timing motif.
5. Charm Crow — indigo-black crow, collected charm chain, reflective highlights.
6. Pixel Puffer — rounded digital puffer, blue block spikes, display-like patterning.
7. Sparkwing Sparrow — small brown/gold bird, electric wing tips.
8. Leafline Lizard — green lizard, leaf-vein/circuit markings, curled tail.
9. Wirewhisk Ferret — long dark ferret, conductive whiskers/cable accents.
10. Signalsilk Moth — soft violet/blue moth, radio-wave wing marks.
11. Orbit Owl — deep brown/navy owl, luminous eyes, independent orbital rings.
12. Glassfang Cobra — blue-violet translucent cobra, refractive hood/fang accents.

Wave 2 should prioritize Moon Gecko, Singularity Sprite, Wolf Pup, Scrapshine Raccoon, Rippledash Otter, Drift Duck, Brick Badger, Chime Cricket, Shadow Raven, Towerhorn Stag, Timeslip Jelly, and Lunar Moth.

## UI usage
- Companion HUD: 30–44 CSS px on phones, 40–56 px on tablet/desktop.
- Starter chooser: 72–96 px.
- LOKDEX tile: 56–80 px.
- Card art preview: 72–120 px in compact cards; larger detail panel may use 160+ px.
- Never use emoji as the primary representation when a production sprite exists.
- Undiscovered entries use a true silhouette of the canonical sprite, not a question-mark placeholder when a sprite exists.

## Card and companion separation
LOKDEX = encyclopedia identity.
Cards = collectible editions/copies representing a character.
Companions = curated equippable Loopers with advice/personality runtime behavior.
Owning a card does not automatically make a character a companion.

## Theme behavior
Classic themes keep sprites crisp and minimally animated.
Expressive themes may tint ambient FX, frames, shadows, and surrounding HUD treatment but should not recolor the canonical body palette enough to make the character unrecognizable.
Character FX obey the global animation/effects ceiling.

## Implementation rules
- Sprite definitions live in `data/pixel-pet-sprites.ts` for the current runtime, with aliases for both companion IDs and LOKDEX IDs.
- `PixelPetSprite` is the shared renderer for companions, LOKDEX tiles, starter selection, and card previews.
- Prefer semantic animation profile names over one-off CSS selectors.
- Add new characters by data first; avoid hardcoding them into UI components.
- Preserve backward compatibility with the original 10×10 classic sprites until a dedicated Classic/Pixel+ style toggle is finished.

## Quality gate
A new Looper is not production-ready until it has:
- stable ID mapping
- readable silhouette at 32 px
- production palette
- Pixel+ grid
- all seven semantic animation mappings
- proper discovered and silhouette rendering
- companion mapping if applicable
- LOKDEX usage
- card preview usage where relevant
- reduced-motion behavior
- mobile fit verification
