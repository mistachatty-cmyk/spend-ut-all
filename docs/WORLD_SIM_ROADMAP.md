# Spend It All — World Atlas and simulation roadmap

## Vision

The player's personal spending and business choices lead into a grounded settlement simulation. A town grows into a city; cities form a civilization, country, and empire; a mature empire coordinates a planet and establishes outposts on other worlds. The game zooms from a detailed active place to summarized remote places. It does not treat economic influence as literal ownership until the player establishes an explicit charter or outpost.

The prior “Glow” concept can remain a cosmetic or morale theme. **Globe** is the geographic scale the player requested.

## What is playable in the first slice

- **World Atlas** is available beside Town & Community. The local map is drawn from the actual capital's building counts and the Atlas's funded districts.
- Fund the Sound Booth, Lokpet Sanctuary, Card Quarter, Garden, Workshop, Commons, Rail, Archive, and Observatory. Funding uses run cash, counts toward total spent, and raises town goodwill. Required town buildings and earlier milestones gate later projects.
- Select one of six civilization focuses and change it as the society evolves.
- Establish up to 12 named satellite cities after reaching Metropolis and Metro Region. Select each city's specialty, develop its four tiers, and watch population and jobs grow with in-game days. The capital remains the existing detailed town simulation. Satellite population and jobs are summaries, with no second cash income stream.
- Claim Civilization, Country, Empire, and Planet milestones in order, with existing town and region tiers plus explicit project and city requirements.
- Establish one outpost at each of three designed destinations after Planet Stewardship and an Orbital Observatory. They appear in the Universe view. Their deeper settlement systems are future work.
- New world state is stored in the current run save and normalized for older saves. It resets with a new run, like the current town. The Atlas can preview future scales before unlock.

## Progression and gates

| Scale | Existing game gate | New action | Immediate result |
| --- | --- | --- | --- |
| Town | Found settlement | Fund local projects | Districts appear; goodwill rises |
| City | Town tier 4 | Focus and build | City view and capital identity |
| Civilization | Town tier 4, three projects, focus | Civilization Charter | Society identity recorded |
| Regional network | Town tier 5, region tier 1 | Found satellite cities | Named cities with specialties and four development tiers |
| Country | Region tier 3, civilization, satellite city | Country Charter | Connected country view |
| Empire | Region tier 4, country | Empire Accord | Global network view |
| Planet | Region tier 5, empire, regional rail | Planet Stewardship | Home world view |
| Universe | Planet, observatory | Outpost expedition | Other world appears in star map |

## Next development passes

### 1. District visits and resident stories

Make each Atlas district a destination with a specific action. The Card Quarter should link into the existing card shop. Sound Booth should play unlocked tracks; Lokpet Sanctuary should show the selected companion, care and training. The Commons should surface existing petitions and festivals. Add six to ten named residents with request chains; derive requests from the town's housing, jobs, happiness and project state.

### 2. City planning

Give the capital a lot-placement mode on the same data used by Town & Community. Each lot references a building instance, so placing or moving it never creates free capacity or income. Add road adjacency, transit reach and neighborhood styles. Use a compact grid and deterministic seeds so a phone only renders visible lots. Satellite cities get a smaller project and policy set, then a city visit mode.

### 3. Country and diplomacy

Create regions with terrain and resource specialties, assign cities to regions, and add rail, road and shipping links. Introduce neighboring simulated countries, trade offers and treaties. Let federation, commerce, research, culture and conflict be distinct paths. Keep treaties and ownership explicit so the world map never implies control of places the player has merely influenced.

### 4. Planet and universe

Use a seeded planet descriptor (biomes, continents, resources, species, civilization history) and a sparse map. Each outpost starts with a settlement and uses the same town rules under a different biome modifier. Add expeditions and Lokpet roles, then asynchronous trade and diplomacy between worlds. Restrict detailed simulation to the active place; advance distant cities and planets by capped game-day ticks and store summarized outcomes.

## Engineering guardrails

- The capital's housing, jobs, tax and happiness come from `cityEconomySnapshot`; avoid a parallel capital economy.
- Every purchase must check current cash and prerequisites in a pure game action before modifying state. No UI-only unlocks.
- Normalize old saves and cap collection sizes. Never grant an owned planet or city merely because a legacy run has a high `regionLevel`.
- World projects spend the existing run balance. Avoid adding premium currency or token issuance to civic simulation.
- Late-scale simulations should be seeded and summarized. Render only active lots and named characters. Add bounded offline progression when those systems have gameplay effects.
- Test migrations, milestone gates, duplicate city names, insufficient funds, and capped population as those systems expand.

## Major expansion: living-world systems

The Atlas now includes the first simulation layer above construction:

- **Civic resources:** Culture, Knowledge, Care, Influence and Discovery persist in the run. Projects, city development, diplomacy and events earn them. Charters spend them, so later scales are tied to meaningful development rather than cash alone.
- **Policy board:** Open Studios, Green Covenant, Learning Guarantee, Trade Compact, Frontier Charter and Public Works are reversible civic priorities. Eligible policies create a small bounded economic bonus for the existing game economy.
- **Civic events:** A district or world stage can surface a daily event with three outcomes: support people, build balance or take a venture. Each produces a different resource profile; support also raises local goodwill.
- **Satellite city initiatives:** Each linked city can open a Night Market, Civic Clinic and Maker Exchange alongside its four development tiers. Their simulation is summarized by game-day population, jobs and prosperity.
- **Diplomacy:** Four simulated partners have trust tracks and can form compacts. Two compacts are required for the Empire Accord, making a global network an earned relationship system.
- **Planet development:** Outposts retain biome, traits, stability and four development levels. Developed worlds add a small bounded contribution to world economy.

All new state normalizes safely for earlier saves and is capped so the browser only simulates the active capital in detail.
