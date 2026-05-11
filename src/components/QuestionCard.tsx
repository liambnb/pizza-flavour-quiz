'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Question } from '@/lib/questions';
import CheckerBand from './ui/CheckerBand';
import Sparkle from './ui/Sparkle';

interface Props {
  question: Question;
  questionNumber: number;
  total: number;
  onAnswer: (answerId: string) => void;
}

export default function QuestionCard({ question, questionNumber, total, onAnswer }: Props) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.22 }}
      className="flex-1 flex flex-col bg-bnb"
    >
      {/* Progress header */}
      <div className="shrink-0">
        <CheckerBand height={24} />
        <div className="flex items-center justify-between px-6 py-3 border-b-4 border-ink">
          <span
            className="text-ink uppercase tracking-widest text-xs"
            style={{ fontFamily: 'var(--font-display-2)' }}
          >
            Question
          </span>
          <div className="flex items-center gap-2">
            <Sparkle size={10} />
            <span
              className="text-ink text-2xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {String(questionNumber).padStart(2, '0')}
              <span className="text-ink/40 text-lg"> / {String(total).padStart(2, '0')}</span>
            </span>
            <Sparkle size={10} />
          </div>
          {/* Progress dots */}
          <div className="flex gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'w-3 h-3 rounded-full border-2 border-ink',
                  i < questionNumber ? 'bg-ink' : 'bg-bnb'
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Question body */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-xl mx-auto w-full">
        {/* Small mascot corner decoration */}
        <div className="self-end mb-4 opacity-60">
          <span className="text-3xl">🍕</span>
        </div>

        <h2
          className="text-ink text-center mb-8 leading-tight"
          style={{
            fontFamily: 'var(--font-display-2)',
            fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
          }}
        >
          {question.text}
        </h2>

        <div className="flex flex-col gap-3 w-full">
          {question.answers.map((answer, i) => (
            <motion.button
              key={answer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => onAnswer(answer.id)}
              className={cn(
                'w-full text-left px-5 py-4 rounded-sm',
                'bg-cream text-ink font-semibold',
                'btn-retro',
                'text-sm md:text-base',
                'hover:bg-bnb-2'
              )}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {answer.text}
            </motion.button>
          ))}
        </div>
      </div>

      <CheckerBand height={24} />
    </motion.div>
  );
}
