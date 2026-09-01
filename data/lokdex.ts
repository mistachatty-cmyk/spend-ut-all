export type LokDexEntry = {
  number: number;
  petId: string;
  generation: number;
  origin: string;
  discoveryHint: string;
};

export const lokDexEntries: LokDexEntry[] = [
  { number: 1, petId: 'pet-lok-slime', generation: 1, origin: 'Spend It All', discoveryHint: 'Starter companion' },
  { number: 2, petId: 'pet-coin-cat', generation: 1, origin: 'Spend It All', discoveryHint: 'LOK shop' },
  { number: 3, petId: 'pet-espresso-bot', generation: 1, origin: 'Spend It All', discoveryHint: 'LOK shop' },
  { number: 4, petId: 'pet-wolf-pup', generation: 1, origin: 'Spend It All', discoveryHint: 'Wolf Boss mastery' },
  { number: 5, petId: 'pet-moon-gecko', generation: 1, origin: 'Spend It All', discoveryHint: 'Planetary progression' },
];
