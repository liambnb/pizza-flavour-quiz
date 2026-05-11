export interface Flavour {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  accentColor: string;
  hidden?: boolean;
}

export const FLAVOURS: Flavour[] = [
  {
    id: 'margherita',
    name: 'Margherita',
    emoji: '🍕',
    tagline: 'The Purist',
    description:
      'Clean lines, blue chips, on-chain since the testnet days. You don\'t chase pumps because you\'ve already done the math.',
    accentColor: '#E63946',
  },
  {
    id: 'pepperoni',
    name: 'Pepperoni',
    emoji: '🌶️',
    tagline: 'The Loyalist',
    description:
      'You found your tribe and you ride or die. Every group chat has one of you and frankly the chat would collapse without them.',
    accentColor: '#FF595E',
  },
  {
    id: 'hawaiian',
    name: 'Hawaiian',
    emoji: '🍍',
    tagline: 'The Contrarian',
    description:
      'Wild, unusual, divisive — and somehow always early. People said it wouldn\'t work. You minted it anyway.',
    accentColor: '#FFCA3A',
  },
  {
    id: 'meat_feast',
    name: 'Meat Feast',
    emoji: '🥓',
    tagline: 'The Maximalist',
    description:
      'Your portfolio has 47 positions and you can name all of them. Restraint is for chains with low throughput.',
    accentColor: '#8B4513',
  },
  {
    id: 'veggie',
    name: 'Veggie Supreme',
    emoji: '🥦',
    tagline: 'The Yield Farmer',
    description:
      'Every APY, every airdrop, every points programme. You read the docs. You actually read the docs.',
    accentColor: '#43AA8B',
  },
  {
    id: 'bbq_chicken',
    name: 'BBQ Chicken',
    emoji: '🍗',
    tagline: 'The Vibes Trader',
    description:
      'You don\'t do TA. You do feelings. Astonishingly, the feelings are usually right.',
    accentColor: '#F3722C',
  },
  {
    id: 'four_cheese',
    name: 'Four Cheese',
    emoji: '🧀',
    tagline: 'The Stacker',
    description:
      'Quietly accumulating since the last cycle. No tweets, no Discord, just receipts.',
    accentColor: '#FFD166',
  },
  {
    id: 'diavolo',
    name: 'Diavolo',
    emoji: '🔥',
    tagline: 'The Degen',
    description:
      '100x leverage, 3am liquidations, back at it by lunch. You are the reason funding rates exist.',
    accentColor: '#D62828',
  },
  {
    id: 'truffle_shuffle',
    name: 'Truffle Shuffle',
    emoji: '🍄',
    tagline: 'The Lurker',
    description:
      'Read-only mode. You see every alpha leak and tell nobody. Including yourself, apparently.',
    accentColor: '#6A4C93',
  },
  {
    id: 'bnb_supreme',
    name: 'BNB Supreme',
    emoji: '👑',
    tagline: 'The Native',
    description:
      'You were on BNB Chain before it was cool. Gas fees so low you forgot they existed. Welcome home.',
    accentColor: '#F0B90B',
    hidden: true,
  },
];

export function getFlavourById(id: string): Flavour | undefined {
  return FLAVOURS.find((f) => f.id === id);
}
