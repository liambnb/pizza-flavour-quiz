export interface Answer {
  id: string;
  text: string;
  scores: string[]; // flavour ids that get +1
}

export interface Question {
  id: string;
  text: string;
  answers: Answer[];
}

export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: "It's 3am and your portfolio is down 40%. You:",
    answers: [
      {
        id: 'q1a0',
        text: 'Diamond hand. The dip is a feature.',
        scores: ['meat_feast', 'diavolo', 'four_cheese'],
      },
      {
        id: 'q1a1',
        text: 'Quietly DCA more in. This is the way.',
        scores: ['margherita', 'veggie'],
      },
      {
        id: 'q1a2',
        text: 'Tweet a thousand-yard-stare meme and log off.',
        scores: ['hawaiian', 'bbq_chicken'],
      },
      {
        id: 'q1a3',
        text: 'Open the trade and revenge-trade a memecoin.',
        scores: ['diavolo', 'truffle_shuffle'],
      },
    ],
  },
  {
    id: 'q2',
    text: 'Pick your favourite chain energy:',
    answers: [
      {
        id: 'q2a0',
        text: 'Established blue chips, slow and steady.',
        scores: ['margherita', 'four_cheese'],
      },
      {
        id: 'q2a1',
        text: 'Yield farms, airdrops, points programmes.',
        scores: ['veggie', 'bbq_chicken'],
      },
      {
        id: 'q2a2',
        text: 'Memecoins, NFTs, anything with a frog.',
        scores: ['hawaiian', 'truffle_shuffle'],
      },
      {
        id: 'q2a3',
        text: 'Whatever the group chat shilled this morning.',
        scores: ['pepperoni', 'diavolo'],
      },
    ],
  },
  {
    id: 'q3',
    text: 'Your wallet history is mostly:',
    answers: [
      {
        id: 'q3a0',
        text: "Stables and majors. I'm here for the long game.",
        scores: ['margherita', 'four_cheese'],
      },
      {
        id: 'q3a1',
        text: '70 different tokens, half of them rugs.',
        scores: ['meat_feast', 'truffle_shuffle'],
      },
      {
        id: 'q3a2',
        text: 'PFPs, mints, and gas burned on failed txs.',
        scores: ['hawaiian', 'bbq_chicken'],
      },
      {
        id: 'q3a3',
        text: "One whale-sized bag I refuse to discuss.",
        scores: ['diavolo', 'pepperoni'],
      },
    ],
  },
  {
    id: 'q4',
    text: 'The group chat says "ape in." You:',
    answers: [
      {
        id: 'q4a0',
        text: 'Read the contract first. Verify the dev.',
        scores: ['margherita', 'veggie'],
      },
      {
        id: 'q4a1',
        text: 'Send it. Fortune favours the brave.',
        scores: ['diavolo', 'pepperoni'],
      },
      {
        id: 'q4a2',
        text: 'Wait 15 minutes. Watch it pump. Cry.',
        scores: ['hawaiian', 'truffle_shuffle'],
      },
      {
        id: 'q4a3',
        text: '"Is this a rug?" — then ape in anyway.',
        scores: ['bbq_chicken', 'meat_feast'],
      },
    ],
  },
  {
    id: 'q5',
    text: 'Your crypto vibe in one word:',
    answers: [
      {
        id: 'q5a0',
        text: 'Builder.',
        scores: ['margherita', 'four_cheese'],
      },
      {
        id: 'q5a1',
        text: 'Degenerate.',
        scores: ['diavolo', 'pepperoni'],
      },
      {
        id: 'q5a2',
        text: 'Lurker.',
        scores: ['veggie', 'truffle_shuffle'],
      },
      {
        id: 'q5a3',
        text: 'Chaos.',
        scores: ['hawaiian', 'bbq_chicken', 'meat_feast'],
      },
    ],
  },
];
