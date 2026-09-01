# LOKverse Releases, Character Editions & Micro-Motion System

## 1. Product separation

The LOKdex should feel like its own collectible universe, not a database of finance jokes.

Spend It All is one place where LOKdex characters can originate and be discovered, but the base character language should remain broad enough to travel into future G-Six games, a standalone card experience, events, or other apps.

Use three distinct layers:

1. **Core LOKdex character** — canonical identity, number, species, base art, personality, affinity, archetype and card stats.
2. **Character edition** — a named creative spin on that character, such as a tie-wearing business version, seasonal outfit, strange-world version, or collaboration treatment.
3. **Card finish** — standard, foil, holo, negative, glitch, gold, event, etc. A finish applies to a physical/digital card copy and is independent of the character edition.

Example:

- Core character: Coin Cat
- Named edition: Ticker-Tie Coin Cat
- Release: Spinbot's Boardroom Breakout
- Card finish: Holo

That is one Holo copy of the Ticker-Tie Coin Cat edition, still connected to canonical Coin Cat.

## 2. Release language

### Core sets

Core releases define the broad LOKverse. Their names should sound like places, phenomena, eras, discoveries, or events from the collectible universe rather than game mechanics.

Current direction:

- **Firstlight** — Gen 1 broad origin set.
- **Sparkstep** — an energetic sub-pool/build identity inside Firstlight.
- **Wildsignal** — strange, unpredictable characters and signals.
- **Starwell / Starpath** — travelers and cosmic characters.
- **Prismwake** — finish/visual-variant capsule.

The underlying pack odds can still bias Work, Tech, Risk, Coin, Cosmic, etc. Those are mechanical affinities, not necessarily the public-facing lore name.

### Capsules

Capsules can deliberately lean into Spend It All, companies, a holiday, a city, another G-Six game, or a one-off joke.

Example:

**Spinbot's Boardroom Breakout — Business Capsule 01**

Possible editions:

- Ticker-Tie Coin Cat
- Executive Blend Espresso Bot
- Pitchwing Sparrow
- Quartermaster Ledger Lizard
- Pinstripe Credit Cricket

Later capsules can have new characters, alternate editions of old characters, or both.

### Event / secret releases

Keep room for:

- anniversary sets
- seasonal drops
- challenge rewards
- hidden packs
- location/world packs
- crossover/collaboration releases
- generated-character events
- numbered collector releases

## 3. Companion rule remains strict

The LOKdex can grow to hundreds or thousands of characters and editions.

Only a curated subset receives a **Companion Profile** for Spend It All. A card or edition never becomes an advisor automatically.

A companion profile adds:

- sprite animation set
- advisor role
- speech/commentary rules
- preferred HUD anchor
- reactions to semantic game events
- accessory anchors

This keeps companion quality high while the collectible universe expands quickly.

## 4. Card economy rules

Current Card Credits remain local and in-game only.

Sources can include:

- starter grant
- free sample pack loop
- new-discovery bonuses
- binder milestones
- duplicate recycling
- future card quests
- future NPC battles/tournaments
- event rewards

Sinks can include:

- core packs
- capsule packs
- deck kits
- future crafting
- future specialty vendors
- future cosmetic card sleeves/binders

Do not make random packs directly purchasable with real money until a separate product/legal/platform review is intentionally done. Current randomized packs should remain an in-game collection loop.

## 5. Micro-motion architecture

Micro-motion is a presentation system, never economy logic.

The simulation/action changes a value first. UI then emits a semantic motion event describing what changed.

### Event contract

Each event carries:

- target counter (`cash`, `lok`, `card-credits`, `debt`, `reward`)
- signed amount
- display text
- optional symbol
- tone (`positive`, `negative`, `debt`, `reward`, `neutral`)
- event kind (`currency`, `purchase`, `card`, `debt`, `reward`, `system`)
- optional source position/element
- optional duration/delay
- optional palette key

### Target contract

Counters expose `data-motion-target` attributes.

Current targets:

- cash
- LOK
- Card Credits
- debt

New currencies should add a target rather than create a new animation engine.

### Example flow

Player recycles a card:

1. recycler calculates +28 Card Credits
2. Card Shop state becomes the new authoritative amount
3. recycler button emits a `card` micro-motion event
4. `+◫ 28` flies from the button toward the Card Credit wallet
5. the wallet number animates from its old displayed value to the new authoritative value
6. the particle disappears

The animation does not delay the actual economy transaction.

## 6. Motion preferences

Micro motion is local presentation state, not a challenge rule.

Settings include:

- all micro animations on/off
- flying value trails on/off
- counter count animation on/off
- palette-reactive color on/off
- respect OS reduced-motion preference
- motion intensity
- symbol treatment: auto / minimal / burst

These settings should never alter achievement eligibility or challenge codes.

## 7. Palette and theme integration

When palette-reactive motion is enabled, the renderer can sample the destination counter's computed color. This automatically lets themes influence motion without hard-coding every theme into the event bus.

Future visual customization assets can override:

- token/symbol glyph
- particle shape
- trail style
- arrival burst
- easing curve
- duration range
- number-chip style
- glow/outline
- card-recycle effect
- purchase effect
- debt effect
- achievement effect

Recommended portable asset kind later: `motion-pack` or `effect`, using the existing LOK portable asset manifest.

Examples:

- Pixel Coins
- Receipt Scraps
- Neon Sparks
- Hologram Orbs
- Tiny LOK Slimes
- Falling Stars
- Coffee Beans
- Market Ticks

Cosmetic motion packs must not change amounts, timing of game actions, odds, or rewards.

## 8. Spam and performance rules

Do not animate every passive-income engine tick.

Recommended behavior:

- direct player actions: animate immediately
- passive income: aggregate into occasional pulses, e.g. every 2–5 seconds, or only at meaningful thresholds
- high-frequency purchases: coalesce repeated events into one larger amount
- cap active flying elements (currently renderer is designed around a small bounded list)
- no canvas/WebGL requirement for normal mode
- use transform/opacity only where possible
- reduced-motion disables flight animation
- page hidden/background state should suppress presentation events

## 9. Source-aware events

Where possible, event source should be the UI control or card that caused the change.

Examples:

- job button → cash counter
- sold asset card → cash counter
- card recycler → Card Credit counter
- pack purchase → Card Credit counter
- lender button → debt counter and cash counter
- repayment button → cash counter and debt counter
- achievement toast → reward/LOK destination if it grants something
- business revenue milestone → business card to cash counter

When no source is visible, the renderer can use a safe fallback origin near the destination.

## 10. Debt motion plan

Debt needs two coordinated motions because borrowing affects two sides of the balance sheet.

Borrow $100,000:

- `+$100,000` → cash
- `+$100,000 debt` → debt

Repay $10,000:

- `-$10,000` → cash
- `-$10,000 debt` → debt, visually signaling the liability shrank

Interest accrual should normally be aggregated rather than flying every simulation tick.

Default/court/seizure should use semantic alert effects, not misleading currency particles.

## 11. Card-specific micro motion

Pack opening can use the same engine plus specialized card presentation:

- pack tear/open animation
- card fan/reveal sequence
- NEW discovery ping
- edition badge reveal
- finish shimmer
- duplicate marker
- recycle animation into Card Credits
- binder slot fill animation
- milestone reward travels to wallet

The core motion event should remain generic. Card-specific reveal animation belongs in Card Shop components.

## 12. Next integrations

Priority order:

1. Card recycle/purchase/collection rewards — implemented first.
2. Active earnings and direct income-stream purchases — initial integration.
3. Borrowing and debt repayment.
4. Marketplace purchases and sales.
5. Business founding/upgrades.
6. Home/property purchases and mortgages.
7. Achievements and cosmetic unlocks.
8. LOK earning tick — use occasional milestone pulse, not one particle every ten seconds forever unless the player opts in.
9. Passive-income aggregation.
10. Companion reactions to motion events.

## 13. Future companion interaction

Companions can observe semantic motion events without controlling them.

Examples:

- Coin Cat watches a large cash trail.
- Espresso Bot celebrates a work payout.
- a risk advisor reacts to a large debt trail.
- a collector companion jumps when a new edition enters the binder.

The event bus can therefore become a safe bridge between economy actions and companion reactions without importing pet logic into financial systems.

## 14. Long-term collection features worth reserving now

- release/set IDs on every card instance
- character edition ID separate from finish
- serial numbers
- provenance/source game
- acquisition method
- trade lock
- transfer count
- generated seed
- favorite/locked copy protection
- binder by character, edition, release and finish
- duplicate counts
- future condition/grade field only if actually useful
- server-authoritative ownership before player-to-player trading

The important rule is: **the LOKverse can expand creatively without requiring Spend It All to expand its companion roster or economy systems at the same speed.**
