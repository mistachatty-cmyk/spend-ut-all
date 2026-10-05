# Spend It All in the LOK universe

The shared guide lives in Lok-EcoSystsem (`LokToken EcoSystem/LOK_PLATFORMS.md`).
This file is Spend It All's own checklist; **work through whatever is open when
this game next gets a main-repo update.**

- [x] `lok.universe.json` (appKey `spendutall`, namespace `g6.spend-it-all`)
- [x] SDK vendored at `lib/lok-universe` -- never edit it here; change
      `Lok-EcoSystsem/universe-sdk` and run `sync-sdk.sh`
- [x] Card publisher: `npx tsx scripts/export-lok-registry.ts <outDir>` (24 Firstlight
      cards, each with its pixel sprite as the art recipe). Re-run after LOKdex changes.
      Not yet type-checked inside this Next project (no dependencies were installed
      when it was written); run `npm run typecheck` once.
- [ ] Binder + decks UI fed by the live registry (SDK `fetchRegistryCards`, `drawCardArt`)
- [ ] Publish editions/capsule releases as cards
- [ ] Public lore on gsix.online: write `scripts/export-public-lore.ts` (copy 616's), add
      the JSON to `Gsixhub/apps/hub/content/lore/`, register it in `apps/hub/lib/lore.ts`,
      set `publicLore` in `lok.universe.json`. The page will wear this game's own look.
- [ ] Reuse the Great Eclipse canon in any lore (it is the gateway between LOK apps)
