# Pixel Presentation Rollout

## Current source of truth

Spend It All already ships the Firstlight Production Looper collection in
`public/assets/loopers/g1/`. `PixelPetSprite` is the single runtime gateway:
all normal companion, LOKDEX, card, starter, and collection surfaces should
use it rather than inventing a second character renderer. The existing
Classic/Legacy pixel sprites remain a selectable low-detail alternative.

Every purchasable or fundable option now passes through `PurchaseVisual`,
which uses `PixelPurchaseArt` as its no-download pixel-art fallback. The
shared renderer recognizes the subject from each stable item id/name (coffee,
yacht, home, mansion, town, store, work, investment, debt, infrastructure,
education, and card) and adds deterministic per-item pixel details. Its
visual tier progresses from Starter through Mythic according to the item
value, rarity, or an explicit data tier. This gives the existing Earn,
Business, Empire, Debt, housing, education, time, card, and customization
purchase surfaces a cohesive pixel picture immediately.

## Asset tiers

| Tier | Use | Current treatment |
| --- | --- | --- |
| Starter | everyday choices and early purchases | compact procedural preview |
| Polished | established upgrades | richer framing and color treatment |
| Premium / Elite | major business, property, card, and infrastructure goals | orbit, spark, and elevated surface treatment |
| Legendary / Mythic | landmark endgame and limited collectible work | crown/foil treatment and a priority slot for bespoke art |

New bespoke art should retain the same item ID as its `PurchaseVisual`. Add a
local, rights-cleared image path through `imageSrc`; the subject-aware pixel
renderer remains the safe fallback while an asset is missing. This is the
streamlined path for replacing generated silhouettes one item at a time
without any screen losing its picture.

## Rollout order

1. Keep Production Loopers as canonical for every character surface.
2. Replace the highest-tier purchase previews with bespoke Pixel+ scenes,
   beginning with properties, businesses, landmark infrastructure, and card
   products.
3. Add bespoke previews for each remaining purchasable category without
   changing price, rarity, rewards, or simulation logic.
4. Add alternate Classic, seasonal, and theme treatments as cosmetic choices,
   never as power upgrades.

## Future real-life / Google AI Studio image branch

Do not merge an image branch merely because it exists. Before it is merged
into `main`, the branch must include a small manifest for every image with:

- stable item ID and local file path;
- whether it is a real photo, a commissioned work, or a generated work;
- source/prompt ownership note and the commercial-use terms actually granted;
- an accessibility alt text and the intended UI surface;
- optimized dimensions and a procedural fallback.

Only use images that the project owns or has clear commercial permission to
use. Do not pull random web images, artist portfolios, or screenshots into
the game. Review the asset manifest and the source terms in the incoming PR,
then merge the image references into `PurchaseVisual` without replacing the
shared Looper renderer or changing game balance.

## Style Deck

After the player chooses their starter LokPet, the Style Deck opens with a
sidebar and lets them set rounded or boxed UI edges, More/Middle/Less
information, and the available Pixel collection. The Real-life Pictures card
is deliberately shown as unavailable until the verified image branch lands.
The preference schema already reserves `Potato`, `Mid`, and `High` as
performance-quality tiers; `Mid` is the current default. These values are
saved in HUD preferences, apply through root data attributes, and never alter
economy or progression.
