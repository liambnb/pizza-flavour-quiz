const FLAVOUR_LINES: Record<string, string> = {
  margherita: 'Classic, composed, and always right.',
  pepperoni: 'Ride or die. The chat needs you.',
  hawaiian: 'Controversial. Early. Correct.',
  meat_feast: 'All positions, zero regrets.',
  veggie: 'You actually read the docs. Respect.',
  bbq_chicken: 'Vibes-based trading. Astonishingly effective.',
  four_cheese: 'Quiet accumulation. Loud receipts.',
  diavolo: '3am liquidations, back by lunch.',
  truffle_shuffle: 'You saw the alpha. You told no one.',
  bnb_supreme: 'OG BNB builder. You were here first.',
};

export function buildCaption(
  flavourName: string,
  flavourId: string,
  emoji: string,
  appUrl: string
): string {
  const line = FLAVOUR_LINES[flavourId] ?? 'Diamond hands, questionable life choices.';
  return `I got ${flavourName} ${emoji} for @BNBCHAIN #BNBPizzaDay 🍕\n\n${line}\n\nWhat flavour are you? → ${appUrl}`;
}
