# Looper Vector Asset Standard

## Purpose
The Firstlight Loopers are preserved as reusable, resolution-independent SVG masters in addition to the live in-app Production renderer. These files are intended to remain usable for game UI, cards, marketing, social graphics, print, future LOK applications, merchandise mockups, motion graphics and later raster exports without redrawing the character from scratch.

## Canonical locations
Each Firstlight character has two portable vector files:

- `public/assets/loopers/g1/<number>-<slug>/master.svg`
- `public/assets/loopers/g1/<number>-<slug>/animated.svg`

Example:
- `public/assets/loopers/g1/004-coin-cat/master.svg`
- `public/assets/loopers/g1/004-coin-cat/animated.svg`

The public URLs follow the same structure under `/assets/loopers/g1/...`.

`public/assets/loopers/g1/index.json` is the machine-readable catalog. `data/looper-vector-assets.ts` is the application-side lookup table and preserves companion aliases.

## Resolution and scaling
Every master and animated wrapper is SVG and declares a 1024 × 1024 presentation size while retaining a compact vector `viewBox`. The art is therefore not tied to 1024 pixels; it can be rendered much smaller for a phone HUD or much larger for posters and marketing without a raster upscaling step.

Do not replace these masters with screenshots or flattened low-resolution PNG files. PNG/WebP exports are derivatives. SVG stays the editable/scalable source.

## Transparency
Masters have no baked rectangular background. Aura/shadow elements belong to the character presentation and remain transparent outside their shapes. This allows the same character to sit on Classic, Midnight, Market Terminal, Gilded Empire and future theme treatments.

## Stable identity
The filename, LOKDEX ID and canonical character name are stable. Art can be improved over time, but future agents should preserve:
- LOKDEX ID
- canonical name
- silhouette family
- primary palette identity
- motif/personality cues
- companion alias mapping

## Live animation vs portable animation
`app/components/LooperProductionSprite.tsx` remains the richer live state-aware renderer because it can react to game moods, gameplay events and the global Effects setting.

`animated.svg` is a portable, self-contained vector animation derived from `master.svg`. It provides a character-specific signature idle motion and respects `prefers-reduced-motion`. Because it references the master in the same folder, improvements to the master automatically propagate to the portable animated presentation.

Current semantic live-game animation states are:
- idle
- happy
- excited / notice
- worried
- sleepy
- traveling
- celebrating

Those state names remain the contract for future state-specific SVG exports and sprite/video derivatives.

## Marketing and cross-project use
When another LOK project needs a character, prefer the canonical master path/catalog rather than recreating the creature independently. Static compositions should start from `master.svg`; lightweight motion compositions may use `animated.svg`. A future shared asset package can copy these folders unchanged because they do not depend on the Spend It All economic save format.

## Quality bar
The approved Firstlight concept sheet is the visual target: expressive creature-collector silhouettes, readable faces, material/motif detail, deliberate highlight/shadow separation, recognizable personalities and scalable animation-friendly construction. Common characters should still look finished; rarity controls spectacle and FX rather than whether a character receives quality art.

## Future derivative work
Additional derivatives can include:
- state-specific animated SVG exports
- transparent PNG/WebP portrait sizes
- card crops
- HUD crops
- social/marketing compositions
- motion-graphics layer exports
- print-safe vector variants

Those are derivatives. `master.svg` remains the canonical portable vector master.
