# LOK Card Exchange Protocol v1

## What this is

`docs/LOK_PORTABLE_ASSET_SPEC.md` describes the general contract for any
portable LOK asset (themes, palettes, pets, cards, ...). This document is
the narrower, concrete recipe for the one asset kind that is actually wired
up end to end today: `kind: 'card'`. It exists so a second, third, or
Nth G-Six game can move a collectible card into or out of Spend It All's
LOKdex without importing this repository, sharing a database, or coordinating
a release — the contract is plain JSON.

Read this before building an importer/exporter in another game. Read
`LOK_PORTABLE_ASSET_SPEC.md` first if you haven't — this document assumes its
vocabulary (namespace, manifest, provenance, transfer policy).

## The envelope

A `lok.card-exchange` file is one JSON object:

```json
{
  "format": "lok.card-exchange",
  "formatVersion": 1,
  "manifest": {
    "schema": "lok.asset",
    "schemaVersion": 1,
    "id": "g6.spend-it-all:lokdex-g1-004",
    "namespace": "g6.spend-it-all",
    "slug": "lokdex-g1-004",
    "kind": "card",
    "version": 1,
    "name": "Coin Cat",
    "description": "Sleeps beside anything round and shiny until the room gets interesting.",
    "rarity": "uncommon",
    "tags": ["coin", "cat", "lucky", "firstlight"],
    "acquisition": ["lok", "pack"],
    "ownership": {
      "transferPolicy": "giftable",
      "uniqueInstance": true,
      "stackable": false,
      "requiresServerAuthorityForTransfer": true,
      "survivesRunReset": true
    },
    "provenance": {
      "sourceGame": "g6.spend-it-all",
      "createdAt": 1732000000000
    },
    "metadata": {
      "species": "cat",
      "generation": 1,
      "cardNumber": "004",
      "powerProfile": { "power": 36, "wit": 58, "hustle": 43, "luck": 71, "resilience": 46 }
    }
  },
  "owned": {
    "instanceId": "g6.spend-it-all:lokdex-g1-004#lokcard-1732000000000-ab12cde",
    "assetId": "g6.spend-it-all:lokdex-g1-004",
    "assetVersion": 1,
    "acquiredAt": 1732000000000,
    "acquisitionMethod": "lok",
    "ownerId": null,
    "sourceGame": "g6.spend-it-all",
    "quantity": 1,
    "provenance": { "sourceGame": "g6.spend-it-all", "createdAt": 1732000000000 },
    "transferCount": 0
  },
  "printVariant": "standard"
}
```

Two things live outside `manifest`/`owned` (which come straight from the
generic portable-asset spec):

- `format`/`formatVersion` identify this as a card-exchange envelope
  specifically, separate from `schema`/`schemaVersion` on the manifest
  itself (which identify the generic `lok.asset` contract). A receiving game
  should reject anything where either pair doesn't match what it supports.
- `printVariant` (`standard`/`foil`/`holo`/`negative`/`glitch`/`gold`/`event`)
  is LOKdex-specific print-finish data. It rides alongside the generic
  envelope instead of inside `LokOwnedAsset`, which is meant to serve every
  asset kind, not just cards.

## Sending a card (export)

1. Build a `namespace:slug` id for the card using **your own game's
   namespace** (`g6.<your-game>`), never `g6.spend-it-all`. If your existing
   internal character id already has that shape, reuse it as-is; otherwise
   derive a slug deterministically (Spend It All turns `lokdex:g1:004` into
   `lokdex-g1-004` by replacing `:` with `-`, since its native ids use a
   dex-style two-colon format that isn't a valid single-colon portable id).
2. Fill in `rarity`, `tags`, `acquisition`, and `provenance.sourceGame` (your
   namespace) honestly — a receiving game trusts these for display only, not
   for granting power.
3. Set `ownership.transferPolicy` and
   `ownership.requiresServerAuthorityForTransfer`. Until your game has a real
   authenticated ownership service, keep
   `requiresServerAuthorityForTransfer: true` regardless of policy — this is
   what stops a save-file edit from being mistaken for a secure trade. See
   "Transfer policy" in `LOK_PORTABLE_ASSET_SPEC.md`.
4. Put whatever collectible flavor you have into `metadata`
   (`LokPetCardMetadata`: species, generation, variant, personality, traits,
   cardNumber, evolutionFamily, powerProfile). Unknown/absent fields are
   fine — a receiving game must tolerate missing metadata, not require it.
5. **Do not put real gameplay-affecting stats in `powerProfile`** if your
   game has actual card-battle mechanics. Nothing on the receiving side
   trusts this field for balance; treat it as flavor a receiving game may
   ignore entirely (Spend It All currently does — imported cards get a flat
   neutral stat line, never the sender's numbers).
6. Wrap it in the envelope above and hand it to the player as copyable text
   or a downloadable file. There is no server in this protocol version —
   the player is the courier, the same way a local save file already is.

## Receiving a card (import)

1. Parse the envelope. Reject anything where `format`/`formatVersion` or
   `manifest.schema`/`manifest.schemaVersion` don't match what you support —
   don't guess at an unknown version's shape.
2. Reject `manifest.namespace === <your own namespace>`. A card whose
   namespace is your own game was never a foreign asset in the first place;
   treat that as "nothing to import," not an error to route around.
3. Reject anything where `manifest.kind !== 'card'` (or whichever kinds your
   game has decided to accept — this protocol only defines `card` so far).
4. Deduplicate on `owned.instanceId`: if you've already recorded that exact
   instance, treat re-import as a no-op success, not a duplicate grant.
5. Cache the manifest as a **local, foreign character definition** — separate
   from your own native roster, the same "definition vs. owned instance"
   split the portable spec calls for. Never let an imported id collide with
   or overwrite a native one; namespacing already prevents this by
   construction as long as step 2 is honored.
6. Grant one local owned-card record referencing that foreign definition,
   with `acquisition: 'trade'` and `sourceGame` copied from
   `manifest.provenance.sourceGame` — never rewritten to your own game.
7. Never auto-grant gameplay power, a companion/advisor slot, or any other
   privileged status from the mere fact of import. An imported card is
   cosmetic collection identity only, exactly like a locally-pulled pack
   card without a curated companion profile (see
   `LOKDEX_COMPANION_MODEL.md`).

## Spend It All's implementation

- `game/systems/lok-card-exchange.ts` — `exportOwnedCardAsPortable`,
  `serializeLokCardExport`, `parseLokCardExport`, `importLokCardExport`.
- `game/systems/lokdex.ts` — `resolveLokDexCharacter` (checks the native
  Firstlight roster first, then `LokDexCollection.foreignCharacters`) and
  `upsertForeignLokDexCharacter`.
- `app/components/CardShopView.tsx` — the Universe Exchange tab on `/cards`:
  pick an owned card → generate + copy its export; paste an export from
  elsewhere → import it as a visiting card in the binder.

## Worked example: a second game joins

616 Survivor (`artifacts/survivor-616/`) already generates its own
short-lived collectible companions ("LokPets" — see that repo's
`docs/lokpets.md`). To participate in this exchange, that game's own code
(independently implemented in its own codebase, not by depending on this
one) would:

1. Pick its namespace, e.g. `g6.616-survivor`.
2. For an archived LokPet variant, build a manifest with
   `id: "g6.616-survivor:<variant-id>"`, `kind: 'card'`, and metadata drawn
   from that variant's family/silhouette/palette — never the literal
   pixel-rig art itself, since that game's own rules keep rendering
   restricted to its procedural rig system. `metadata.variant` or `tags` is
   enough for a receiving game to know roughly what it looked like without
   shipping bitmaps.
3. Export that as the envelope above and let a player paste it into Spend
   It All's `/cards` → Universe Exchange import box.
4. To receive a card going the other direction, 616 Survivor's own importer
   would follow the "Receiving a card" steps, rendering an imported card as
   a placeholder/visiting entry through its own procedural rig system
   (never displaying another game's raw art), and never letting it affect
   combat balance.

Nothing in this protocol requires that second implementation to be
TypeScript, React, or even a web app — only that it produces and accepts the
same JSON shape.
