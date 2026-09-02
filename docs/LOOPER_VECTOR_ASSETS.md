# Looper Vector Asset Standard

## Purpose
The Firstlight Loopers are now preserved as reusable, resolution-independent SVG masters in addition to the live in-app Production renderer. These files are intended to remain usable for game UI, cards, marketing, social graphics, print, future LOK applications, merchandise mockups, motion graphics and later raster exports without redrawing the character from scratch.

## Canonical location
`public/assets/loopers/g1/<number>-<slug>/master.svg`

Example:
`public/assets/loopers/g1/004-coin-cat/master.svg`

The public path is:
`/assets/loopers/g1/004-coin-cat/master.svg`

`public/assets/loopers/g1/index.json` is the machine-readable catalog. `data/looper-vector-assets.ts` is the application-side lookup table and preserves companion aliases.

## Resolution and scaling
Every master is SVG and declares a 1024 × 1024 presentation size while retaining a compact vector `viewBox`. The art is therefore not tied to 1024 pixels; it can be rendered much smaller for a phone HUD or much larger for posters and marketing without a raster upscaling step.

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

## Relationship to live animation
`app/components/LooperProductionSprite.tsx` remains the live state-aware renderer because it can react to game moods and Effects settings. The standalone SVG master is the reusable art source/export surface. The live renderer and master assets must stay visually aligned.

Current semantic animation states are:
- idle
- happy
- excited / notice
- worried
- sleepy
- traveling
- celebrating

Future animation exports should be derived from these vector masters and keep those state names.

## Marketing and cross-project use
When another LOK project needs a character, prefer the canonical master path/catalog rather than recreating the creature independently. A future shared asset package can copy these SVGs unchanged because they do not depend on the Spend It All economic save format.

## Quality bar
The approved Firstlight concept sheet is the visual target: expressive creature-collector silhouettes, readable faces, material/motif detail, deliberate highlight/shadow separation, recognizable personalities and scalable animation-friendly construction. Common characters should still look finished; rarity controls spectacle and FX rather than whether a character receives quality art.

## Future export work
Planned derivatives can include:
- animated SVG exports
- transparent PNG/WebP portrait sizes
- card crops
- HUD crops
- social/marketing compositions
- motion-graphics layer exports
- print-safe vector variants

Those are derivatives. `master.svg` remains the canonical portable vector master.
