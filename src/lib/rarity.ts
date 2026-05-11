export type Rarity = 'normal' | 'silver' | 'gold';

export function rollRarity(flavourId?: string): Rarity {
  if (flavourId === 'bnb_supreme') return 'gold';
  const r = Math.random();
  if (r < 0.05) return 'gold';
  if (r < 0.30) return 'silver';
  return 'normal';
}
