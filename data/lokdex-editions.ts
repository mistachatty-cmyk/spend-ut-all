import type { LokDexCharacterEdition, LokDexReleaseKind } from '@/game/lokdex-types';

export type LokDexRelease = {
  id: string;
  name: string;
  subtitle: string;
  kind: LokDexReleaseKind;
  description: string;
  visualKey: string;
};

/**
 * Core LOKdex releases should feel like they belong to their own fictional universe.
 * Business/economy concepts are capsules layered on top of that universe, not the base identity.
 */
export const lokDexReleases: LokDexRelease[] = [
  {
    id: 'lok-gen1-firstlight',
    name: 'Firstlight',
    subtitle: 'Gen 1 Core Set',
    kind: 'core-set',
    description: 'The first broad look at the LOKverse: odd creatures, little machines, travelers, dreamers, collectors, and mysteries.',
    visualKey: 'firstlight',
  },
  {
    id: 'lok-capsule-spinbot-boardroom',
    name: "Spinbot's Boardroom Breakout",
    subtitle: 'Business Capsule 01',
    kind: 'capsule',
    description: 'A playful special-release capsule where familiar LOKdex characters dress up, rebrand themselves, and take business far too seriously.',
    visualKey: 'spinbot-boardroom',
  },
  {
    id: 'lok-capsule-prismwake',
    name: 'Prismwake',
    subtitle: 'Finish & Variant Capsule',
    kind: 'capsule',
    description: 'A color-shifting release built around unusual finishes, strange reflections, and harder-to-find visual treatments.',
    visualKey: 'prismwake',
  },
];

export const lokDexEditions: LokDexCharacterEdition[] = [
  {
    id: 'edition-coin-cat-ticker-tie',
    baseCharacterId: 'lokdex:g1:004',
    releaseId: 'lok-capsule-spinbot-boardroom',
    name: 'Ticker-Tie Coin Cat',
    description: 'Coin Cat in a tiny tie, watching an imaginary ticker like the entire board meeting depends on it.',
    artKey: 'coin-cat-ticker-tie',
    acquisition: ['pack'],
    tags: ['business-capsule','tie','boardroom','coin-cat'],
  },
  {
    id: 'edition-espresso-bot-executive-blend',
    baseCharacterId: 'lokdex:g1:008',
    releaseId: 'lok-capsule-spinbot-boardroom',
    name: 'Executive Blend Espresso Bot',
    description: 'Espresso Bot wearing a badge and carrying a schedule nobody asked for.',
    artKey: 'espresso-bot-executive-blend',
    acquisition: ['pack'],
    tags: ['business-capsule','coffee','executive','espresso-bot'],
  },
  {
    id: 'edition-startup-sparrow-pitchwing',
    baseCharacterId: 'lokdex:g1:009',
    releaseId: 'lok-capsule-spinbot-boardroom',
    name: 'Pitchwing Sparrow',
    description: 'Startup Sparrow with a miniature presentation folder and unstoppable pitch energy.',
    artKey: 'startup-sparrow-pitchwing',
    acquisition: ['pack'],
    tags: ['business-capsule','pitch','founder','sparrow'],
  },
  {
    id: 'edition-ledger-lizard-quartermaster',
    baseCharacterId: 'lokdex:g1:005',
    releaseId: 'lok-capsule-spinbot-boardroom',
    name: 'Quartermaster Ledger Lizard',
    description: 'Ledger Lizard with a vest, stamped notebook, and an unreasonable number of tiny tabs.',
    artKey: 'ledger-lizard-quartermaster',
    acquisition: ['pack'],
    tags: ['business-capsule','ledger','vest','lizard'],
  },
  {
    id: 'edition-credit-cricket-pinstripe',
    baseCharacterId: 'lokdex:g1:015',
    releaseId: 'lok-capsule-spinbot-boardroom',
    name: 'Pinstripe Credit Cricket',
    description: 'Credit Cricket in pinstripes, chirping approvingly at neat little stacks of paperwork.',
    artKey: 'credit-cricket-pinstripe',
    acquisition: ['pack'],
    tags: ['business-capsule','pinstripe','credit','cricket'],
  },
];

export function lokDexEditionById(id: string | null | undefined) {
  return id ? lokDexEditions.find((edition) => edition.id === id) ?? null : null;
}

export function lokDexReleaseById(id: string | null | undefined) {
  return id ? lokDexReleases.find((release) => release.id === id) ?? null : null;
}
