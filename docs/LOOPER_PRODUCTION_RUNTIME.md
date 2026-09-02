# Looper Production Runtime

## Purpose
Pixel+ is now the production Looper presentation. Classic Pixel Art remains the legacy/lightweight option. The production runtime must always render from canonical Firstlight character recipes rather than unrelated emoji or generic placeholders.

## Canonical roster
All 24 Firstlight LOKDEX characters have a production recipe in `data/looper-hd-recipes.ts`. Each recipe carries stable IDs/aliases, creature archetype, palette, material/accent language, glow and motif. Companion aliases map the same canonical character into the live advisor system.

## Runtime renderer
`app/components/LooperProductionSprite.tsx` is the production sprite generator. It renders deterministic high-detail SVG creature art from the canonical recipe and exposes the same component contract already used by the game: `petId`, `mood`, `size`, `animated`, and `silhouette`.

`app/components/PixelPetSprite.tsx` is the compatibility gateway:
- Pixel+ -> `LooperProductionSprite`
- Classic -> preserved compact grid sprites / legacy fallback

That means Starter Companion selection, live companion HUD, LOKDEX, Card Shop pulls, Binder, recycling and other existing `PixelPetSprite` surfaces automatically use the production renderer without duplicating character implementations.

## Animation contract
Supported game moods remain:
- `idle`
- `happy`
- `excited` (notice / alert)
- `worried`
- `sleepy`
- `traveling`
- `celebrating`

Production motion lives in `app/looper-hd.css`. It combines body motion and species/motif layers such as wing movement, tail movement, steam, signal pulses, orbit rotation, glints, sparks, shards, alert marks, worry drops, sleep marks and celebration particles.

Animations obey the global Effects / Micro Motion ceiling. Effects level 0-1 is still/static. Level 2+ enables Looper motion. `prefers-reduced-motion` disables motion.

## Visual standard
The target is the approved Looper concept direction: expressive creature-collector silhouettes, readable at phone HUD size, richer color/value separation than the Classic sprites, strong personalities, motif-driven accessories/materials, restrained but distinctive FX, and no dependency on third-party copyrighted character assets.

Every future Looper must:
1. Have a stable LOKDEX ID and canonical name.
2. Resolve through the production recipe registry.
3. Be recognizable in silhouette.
4. Have at least base/light/dark/accent/glow palette roles.
5. Have a unique motif tied to its description/personality.
6. Render all game moods without falling back to emoji.
7. Respect Effects level and reduced-motion settings.
8. Remain usable in Starter, HUD, LOKDEX, cards and collection surfaces through the shared renderer.

## Future asset export
The production renderer is deliberately deterministic and local/free. A future export tool can render each recipe/mood into PNG/WebP sprite sheets for other LOK games or native clients without changing IDs or gameplay data. Generated art files should be treated as derived build artifacts; the recipe remains the canonical editable source.

## Do not regress
Do not replace production Loopers with affinity emoji, generic icons, or 16x16 placeholders on primary character surfaces. Classic is an explicit player-selected compatibility style only.
