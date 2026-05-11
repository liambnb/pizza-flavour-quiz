import { QUESTIONS } from './questions';

// Returns the winning flavour id given an array of selected answer ids (one per question)
export function scoreAnswers(selectedAnswerIds: string[]): string {
  const totals: Record<string, number> = {};

  selectedAnswerIds.forEach((answerId, qIndex) => {
    const question = QUESTIONS[qIndex];
    if (!question) return;
    const answer = question.answers.find((a) => a.id === answerId);
    if (!answer) return;
    answer.scores.forEach((flavourId) => {
      totals[flavourId] = (totals[flavourId] ?? 0) + 1;
    });
  });

  // Check bnb_supreme special condition:
  // Q5 = "Builder" (q5a0) AND any answer that gave margherita or four_cheese in Q1 or Q3
  const q1Answer = selectedAnswerIds[0];
  const q3Answer = selectedAnswerIds[2];
  const q5Answer = selectedAnswerIds[4];

  const q1GivesMargOrFour =
    q1Answer === 'q1a0' || // diamond hand → four_cheese
    q1Answer === 'q1a1'; // DCA → margherita

  const q3GivesMargOrFour =
    q3Answer === 'q3a0'; // stables → margherita + four_cheese

  if (q5Answer === 'q5a0' && (q1GivesMargOrFour || q3GivesMargOrFour)) {
    return 'bnb_supreme';
  }

  // Find max score
  const maxScore = Math.max(...Object.values(totals));
  const winners = Object.entries(totals)
    .filter(([, score]) => score === maxScore)
    .map(([id]) => id);

  if (winners.length === 0) return 'margherita';
  return winners[Math.floor(Math.random() * winners.length)];
}
