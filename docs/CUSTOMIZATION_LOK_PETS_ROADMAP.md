# Spend It All — Customization, Themes, UI Packs & LOK Pets Roadmap

## Product rule

Customization should make long-term play feel personal without making the core game pay-to-win. LOK remains a persistent cross-run currency earned from active playtime. Cosmetics may be starter items, achievement rewards, scenario rewards, secret unlocks, LOK purchases, future LOK Pass items, event items, or supporter items.

LOK Pets can be visually helpful and emotionally reactive, but they should not directly multiply income, reduce costs, improve investment odds, or invalidate challenge integrity. Their “helpfulness” should be presentation and quality-of-life: reminders, reactions, tips, summaries, celebrations, status callouts, and contextual animations.

---

## 1. One ownership system

Every cosmetic should use the same inventory/entitlement model.

Acquisition methods:
- Starter — free defaults available to everyone.
- Achievement — permanent reward for earning a specific badge or mastery.
- Scenario — completing a scenario or custom challenge family.
- LOK — purchased with the persistent LOK wallet.
- LOK Pass — included in the future $2.99 supporter/ad-free entitlement.
- Event — limited or seasonal earnable content.
- Secret — hidden discoveries and unusual combinations.
- Supporter — optional supporter cosmetics without gameplay power.

The game should store the ownership record separately from an active run. Resetting, bankruptcy, or switching scenarios must never remove owned cosmetics or pets.

Future cloud sync should move the same inventory to G-Six servers. Apple, Discord, GitHub, or first-party G-Six identities authenticate the player; G-Six remains the authority for cloud wallet balances and owned entitlements.

---

## 2. Customization categories

### Themes
Full visual treatments that swap design tokens rather than rewriting components.

Initial concepts:
- Classic Ledger — current clean light interface.
- Midnight — current dark interface evolved into a full theme.
- Cozy Café — warm desk, paper, espresso, soft ambient motion.
- Executive Glass — dark glass, premium office feel, restrained blur.
- Market Terminal — compact finance-terminal treatment and ticker details.
- Retro Tycoon — late-90s/early-2000s management game inspired layout.
- Pixel Fortune — pixel-inspired icons, counters, and surfaces.
- Paper Empire — receipts, ledgers, stamps, folders, newspaper textures.
- Neon Economy — futuristic finance dashboard styling.
- Lunar Office — space-economy theme unlocked around lunar progression.
- Planetary Command — extreme late-game world-management interface.

Themes should define CSS/design tokens such as surface, border, spacing density, radius, animation feel, and visualization treatment. Business logic must never know which theme is equipped.

### HUD packs
HUD packs alter the presentation of the persistent top information area.

Ideas:
- Minimal HUD
- Compact Mobile HUD
- Executive Dashboard
- Trading Desk
- Arcade HUD
- Cozy Desk
- Planetary Command Bar

A HUD pack may reposition or visually restyle money, net worth, LOK, run clock, day/time, risk status, current event, and companion anchor points, but it must preserve the same underlying information APIs.

### Money counter styles
The money counter is one of the strongest collectible visual surfaces in the game.

Ideas:
- Smooth rolling digits
- Mechanical flip board
- Odometer
- Stock ticker
- Bank vault counter
- Receipt printer
- Terminal digits
- Gold-number luxury counter
- Holographic planetary counter
- “Danger” counter that becomes increasingly unstable in debt

Counter styles should react to positive, negative, debt, bankruptcy-warning, and victory states.

### Backgrounds / environments
Initially these can be CSS/SVG/illustration layers. Later they can become actual visual world scenes.

Examples:
- Bedroom desk
- Tiny apartment
- Coffee shop
- Startup office
- Penthouse
- Corporate HQ
- Trading floor
- Mansion study
- City skyline
- Private jet cabin
- Yacht office
- Lunar office
- Orbital station
- Planetary command center

Long-term, the current environment can be partly derived from player progression while still allowing cosmetic skins over it.

### Profile and collection cosmetics
- Profile frames
- Achievement card frames
- Title treatments
- Trophy Room plinths
- Museum wall styles
- Collection shelf styles
- Discovery animations
- Cursor/tap effects
- Purchase animations
- Victory confetti/effects
- Bankruptcy effects

---

## 3. LOK Pets

### Core concept
LOK Pets are persistent companions that can sit in the HUD, sidebar, bottom edge, future room scene, or a free-position companion layer. A player equips one primary pet and can later customize it with accessories.

Pets should have moods such as idle, happy, excited, worried, sleepy, traveling, and celebrating.

They react to game events rather than changing game math.

### Reaction hooks
A pet can respond to:
- Money increasing quickly
- Money falling
- Entering debt
- Bankruptcy countdown
- Recovering from debt
- Large purchase
- Achievement unlock
- Scenario victory
- Secret discovery
- New business
- City upgrade
- Travel
- Jet lag
- Coffee/espresso activity
- Day/night cycle
- Long play session
- Returning after offline time

### Helpful, non-pay-to-win behavior
Pets can:
- Point at a newly unlocked tab.
- Surface a short tip when a system is first encountered.
- Remind the player that an activity is about to become unavailable.
- Call out “your costs are now higher than income.”
- Celebrate a new personal record.
- Summarize a completed work block or travel period.
- Show a tiny thought bubble for market events.
- Warn visually when the bankruptcy timer starts.
- Fall asleep during late game-night hours.
- React to espresso/coffee without granting hidden economic bonuses.

Optional pet advice should be muteable independently from pet visuals.

### Starter pet concepts
- Coin Cat — curls up near the money counter; paws at rapidly changing digits.
- Ledger Dog — friendly office companion that reacts to milestones and completed work blocks.
- Byte Fox — technology-themed companion for software/automation players.
- Orbit Owl — late-game space companion that sleeps by day and wakes during night cycles.
- Espresso Bot — tiny coffee robot that gets excited when the player buys coffee or uses an espresso break.
- Bull Pup — reacts strongly to positive market events and new highs.
- Bear Cub — reacts to downturns, debt, and recoveries.
- Wolf Pup — tied to Wolf Boss achievements and Risk Mode mastery.
- Moon Gecko — lunar progression unlock.
- LOK Slime — simple mascot that visibly grows or changes form with long-term LOK milestones.

### Pet accessories
- Hats
- Glasses
- Ties
- Hoodies
- Space helmets
- Tiny briefcases
- Coffee mugs
- Headphones
- Achievement pins
- Seasonal accessories
- Mini crowns
- Company-branded accessories generated from future player-company customization

Pet accessories should be independently owned/equipped and should not require a separate pet-specific currency.

---

## 4. Earnable / buyable / unlockable balance

A healthy first catalog should not make every desirable item a LOK purchase.

Recommended mix for launch of the customization layer:
- ~35% free / progression / achievement unlocks
- ~30% LOK shop
- ~15% secret and mastery unlocks
- ~10% future LOK Pass library
- ~10% event/supporter/seasonal experiments

These percentages are planning targets, not hard rules.

Examples:
- First Millionaire achievement → unlock a gold counter accent.
- Self-Made Millionaire → unlock “Bootstrapped” profile frame.
- Wolf Boss mastery → unlock Wolf Pup.
- Resurrected Empire → unlock Phoenix-style recovery effect.
- SPENDUTALL → unlock an absurd mythic counter animation or Trophy Room monument.
- 24-hour active-play milestone → unlock a sleepy companion accessory.
- Reach lunar economy → unlock Moon Gecko and Lunar Office theme.
- Spend LOK → buy optional alternate skins, pet accessories, HUDs, and backgrounds.

---

## 5. LOK storefront design

The LOK store should be a browseable cosmetic catalog, not a pressure funnel.

Store sections:
- Featured
- Themes
- HUDs
- Counters
- Pets
- Pet Accessories
- Effects
- Profile
- Earnable This Run
- Achievement Rewards
- Secrets / ???

Each item card should clearly say one of:
- Owned
- Equipped
- Earn with achievement
- Complete scenario
- Secret
- Included with LOK Pass
- Buy for ◈ X LOK

Do not show fake scarcity timers. If an item is actually seasonal, clearly show the real availability rule.

A preview mode should let players temporarily preview a theme/HUD/pet before spending LOK.

---

## 6. LOK Pass relationship

Future LOK Pass price target: $2.99.

Primary value:
- Removes side/bottom ads.
- Supporter status.
- A rotating or permanent small library of cosmetic items.
- Optional exclusive supporter profile treatment.

Avoid:
- Income multipliers.
- Better investment odds.
- Faster LOK accrual.
- Reduced scenario requirements.
- Leaderboard advantages.

LOK Pass should be an entitlement stored separately from the active run. Later it becomes server-authoritative after payment verification.

---

## 7. Future direct purchases

If direct purchases are added later, keep them separated into two concepts:

1. Cosmetic/supporter purchases — safe for normal profile ownership.
2. Optional in-run money purchases — mark the run as assisted/purchased so competitive achievements and ranked challenge boards can distinguish it.

A player buying in-game cash should never silently earn “Self-Made” or competitive speedrun accomplishments from purchased value.

---

## 8. Visual companion layer architecture

Do not render pets directly inside the simulation engine.

Suggested layers:
- Simulation emits semantic events: money-up, money-down, purchase, achievement, travel, etc.
- Companion controller converts events into temporary pet moods/reactions.
- Pet renderer displays sprite/SVG/animation state.
- Theme/HUD defines where pet anchors exist.
- Reduced-motion setting swaps motion-heavy reactions for static expressions.

This lets pets survive future UI redesigns and prevents cosmetics from contaminating economy code.

---

## 9. Future visualizations

Later visualization phases can make companions part of a physical progression scene:

Apartment desk → home office → corporate office → HQ → mansion → city tower → private jet/yacht → orbital office → lunar base.

The pet can occupy the environment while the player’s collectibles, awards, purchases, and business scale become visible around them.

Potential visual systems:
- Desk scene with money counter and companion.
- Trophy Room with pet roaming between exhibits.
- City skyline that changes with business/property ownership.
- Travel transition where the pet packs a bag or boards the jet.
- Day/night lighting tied to game-world time.
- Weather and event overlays later.

---

## 10. Persistence plan

Phase 1:
- Local customization inventory.
- Local equipped loadout.
- Local LOK wallet.

Phase 2:
- Export/import includes inventory references and run-independent collection state.

Phase 3:
- G-Six account sync.
- Server wallet and entitlement authority.
- Account linking through Apple, Discord, GitHub, and/or first-party G-Six identity.

Phase 4:
- Cross-game LOK inventory where selected cosmetics/pets can appear in other compatible G-Six games.

---

## 11. Suggested build order

1. Persistent customization inventory system.
2. Theme token engine beyond Light/Midnight.
3. Cosmetic catalog + preview mode.
4. LOK store transactions using the local persistent wallet.
5. Money counter skins.
6. HUD layouts.
7. First three LOK Pets with simple CSS/SVG reactions.
8. Pet accessories.
9. Achievement/scenario cosmetic unlock hooks.
10. LOK Pass entitlement shell (no payment integration until server verification exists).
11. Rich room/environment visualization.
12. Server/cloud ownership migration.

The next implementation phase should begin with the inventory/theme architecture, because every later visual item, pet, store purchase, unlock, or account sync depends on a stable ownership model.
