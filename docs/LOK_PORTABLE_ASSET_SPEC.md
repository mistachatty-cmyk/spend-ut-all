# LOK Portable Asset Spec v1

## Purpose

This contract lets future G-Six games describe portable themes, palettes, HUDs, effects, pets, collectibles, and cards without tying ownership to one game's save format.

**No existing Spend It All assets are migrated by this document.** The current customization inventory remains unchanged. This is only the compatibility boundary future projects can adopt when ready.

## Core rules

1. Every portable asset has a stable namespaced ID: `namespace:slug`.
2. Asset definitions and owned instances are separate concepts.
3. Definitions are versioned. Ownership references the version originally acquired.
4. Provenance travels with collectible instances.
5. Transfer rules are explicit per asset.
6. Local play remains supported without an account.
7. Anything truly tradeable requires server authority later so local save editing cannot duplicate valuable collectibles.
8. Cosmetic portability never implies economic power inside a receiving game.

## Namespaces

Spend It All should use `g6.spend-it-all` for assets born here.

Examples:

- `g6.spend-it-all:theme-midnight`
- `g6.spend-it-all:pet-lok-slime`
- `g6.localingu:theme-study-glass`
- `g6.lokbook:palette-paper-ink`

The namespace is what prevents two unrelated projects from both creating `midnight` and colliding later.

## Manifest

A manifest contains:

- schema + schema version
- namespaced asset ID
- asset version
- kind
- display name / description
- rarity
- tags
- acquisition methods
- ownership/transfer policy
- provenance
- optional visual references
- optional game-agnostic metadata

The TypeScript contract lives in `integrations/lok/assets/types.ts`.

## Supported asset kinds

- theme
- palette
- HUD
- money counter
- background
- profile frame
- title style
- effect
- pet
- pet accessory
- collectible
- card

More kinds can be added through a future schema version.

## Definition vs owned instance

A **definition** describes what an asset is.

An **owned instance** describes a player's ownership of it.

This distinction becomes important for generated pets and cards. Ten players may all own the same normal theme definition, while a generated mythic pet may have one uniquely identifiable instance with its own seed and transfer history.

## Provenance

Portable provenance can record:

- source game
- source version
- creation/acquisition date
- generation number
- deterministic generation seed
- event
- achievement
- scenario
- original owner once accounts exist

This is intentionally enough for future `Gen 1` collectibles born in Spend It All to remain recognizable in another G-Six experience.

## Transfer policy

Assets declare one of:

- `soulbound` — never transferable
- `giftable` — can move but is not intended for open trading
- `tradeable` — eligible for player trading
- `server-controlled` — ownership movement always requires a trusted service

For the local-only era, no valuable collectible should be treated as securely transferable. A future G-Six ownership service must verify the source owner and atomically move an instance rather than copying it.

## Generated pets / collectible cards

The schema reserves metadata for:

- species
- generation
- variant
- personality
- traits
- card number
- evolution family
- future game-specific power profile

Generated visuals should preferably come from curated pixel components + deterministic seeds rather than arbitrary AI output. That keeps the collection stylistically coherent and reproducible.

A companion in Spend It All can later be interpreted as a card by another game without changing the original collectible identity.

## Themes and palettes

Portable theme/palette manifests should describe identity and references, not assume a specific React component tree or CSS implementation.

A receiving game decides whether it supports the theme and how to render it. Unsupported assets can remain owned without being equipable in that game.

This is especially important for themes already created separately in other applications: they do not need to be rewritten now. If migrated later, each project can create a manifest adapter around its existing implementation.

## Local-first ownership

For now:

- Spend It All saves remain local.
- LOK wallet remains local and persistent.
- Customization inventory remains local and persistent.
- Portable manifests are only a contract.

Later:

- Apple / Discord / GitHub / G-Six login can identify the player.
- G-Six servers can become authoritative for portable ownership and transfers.
- Local state can cache ownership for fast loading/offline use.

## Future card/trading service

A server-backed trade should eventually:

1. authenticate both owners;
2. verify each instance exists and belongs to the offered owner;
3. lock both sides of the trade;
4. atomically exchange ownership;
5. append transfer provenance;
6. return updated signed inventories.

Do not implement peer-to-peer ownership transfer using only local save files.

## Versioning

`schemaVersion` changes only when the cross-game contract itself changes.

`version` changes when a particular asset definition changes.

Receiving apps should preserve unknown metadata and avoid silently changing asset IDs.

## Immediate status

Implemented now:

- TypeScript manifest and ownership types
- namespaced ID helper
- basic manifest validator
- local owned-instance helper
- transfer-policy guard
- JSON serialization helper

Not implemented now:

- migration of existing cosmetics
- account/cloud ownership
- trading
- card gameplay
- generated pet factory
- cross-game imports

Those remain deliberately deferred.
