# LOKdex Card Shop & Collection Economy

## Current product rule

The LOKdex is a large collectible/card universe. Spend It All companions are only a small curated subset of LOKdex characters.

The Card Shop is deliberately able to operate as its own local loop. A player should be able to visit `/cards`, open packs, fill a binder, chase variants, recycle duplicates, and work toward deck builds without needing to play the wealth simulation first.

Random packs are currently purchased only with local in-game Card Credits. Do not connect randomized packs to Stripe, real-money purchases, or purchased LOK without a separate product/legal review and server authority.

## Current local economy

- 350 starter Card Credits once per local profile.
- Free 3-card Sample Pack every 20 minutes.
- Discovery bonuses when a new LOKdex character is pulled.
- Binder milestones at 5 / 10 / 15 / 20 / 24 discovered characters.
- Duplicate recycling returns Card Credits.
- A player's final copy of a character is protected from the recycler.
- Packs and deck kits are sinks for Card Credits.
- The system stores lifetime spend, cards pulled, free packs, recycling, and collection rewards.

## Current products

### Packs
- Street Pack
- Hustle Pack
- Risk & Market Pack
- Cosmic Pack
- Holo Vault
- Origin Collector Box

### Deck kits / build blueprints
- Cashflow Crew
- Hustle Shift
- Market Mischief
- Cosmic Expansion

Deck blueprints are collection/build goals today. Their card-game rules are intentionally dormant until a separate card-play engine exists.

## Variants

Current card instances can carry:
- Standard
- Foil
- Holo
- Negative
- Glitch
- Gold
- Event

Variants are instance-level data. This is important for future trading because two copies of the same LOKdex character can remain different owned objects.

## Recommended next shop families

Do not put every product in one giant storefront forever. Future districts can include:

### General Card Shop
Always-available core packs, starter kits, binder tools, and collection supplies.

### Specialty Vendor
Rotates affinities such as Work, Risk, Cosmic, Market, Tech, or Coin. Rotation can initially be date-seeded locally.

### Collector's Vault
High Card-Credit cost. Focuses on variants and old sets rather than stronger gameplay cards.

### Event Booth
Seasonal/event cards with explicit availability dates. No fake urgency timers.

### Secret Dealer
Unlocked by hidden achievements, unusual play, or rare LOKdex discoveries. Primarily cosmetics, strange variants, and mystery characters.

### Card Recycler / Craft Bench
Duplicates can become Card Credits now. Later add crafting materials that let collectors target a missing common/uncommon without relying entirely on packs.

### Auction House — future server phase
Must not be built as local-only trading. Requires server accounts, authoritative ownership, listing locks, transaction history, anti-duplication checks, rate limits, and fraud controls.

## Future card economy systems

1. Set releases and generations.
2. Pack rotation schedule.
3. Pity / duplicate-protection options for some pack families.
4. Collection quests and binder pages.
5. Card grading / condition only if it adds fun without manufactured scarcity.
6. Crafting from duplicates.
7. Favorite cards and protected cards.
8. Deck builder with saved deck slots.
9. Solo card battles against NPC decks.
10. Card-shop NPC personalities and vendor dialogue.
11. Daily/weekly card challenges.
12. Local tournament ladder against generated NPC opponents.
13. Server account ownership.
14. Player-to-player trade offers.
15. Secure auction/listing system.
16. Separate card game using the same LOKdex asset/instance IDs.

## Economy principles

- Do not promise real-world monetary value.
- Do not let card rarity change Spend It All financial simulation math.
- Keep card stats dormant until actual card gameplay exists.
- Publish pack guarantees and material odds clearly.
- Protect the user's last copy by default.
- Keep rare pulls exciting through art, animation, provenance, variants, and collection meaning rather than pay-to-win power.
- Server authority is required before ownership can safely move between users.

## Standalone direction

`/cards` is the first bridge toward a card-focused experience. Over time it can become a fuller card district with its own navigation, achievements, quests, collection profile, deck builder, NPC battles, and storefront while still sharing the same local/server LOKdex ownership layer with Spend It All and future G-Six experiences.
