'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Question } from '@/lib/questions';

interface Props {
  question: Question;
  questionNumber: number;
  total: number;
  onAnswer: (answerId: string) => void;
}

export default function QuestionCard({ question, questionNumber, total, onAnswer }: Props) {
  const progress = ((questionNumber - 1) / total) * 100;

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-xl mx-auto"
    >
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-[#848E9C] mb-2">
          <span>Question {questionNumber} of {total}</span>
          <span>{questionNumber - 1}/{total} complete</span>
        </div>
        <div className="h-1 bg-[#2B3139] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#F0B90B] rounded-full"
            initial={{ width: `${((questionNumber - 2) / total) * 100}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-tight">
        {question.text}
      </h2>

      <div className="flex flex-col gap-3">
        {question.answers.map((answer, i) => (
          <motion.button
            key={answer.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => onAnswer(answer.id)}
            className={cn(
              'w-full text-left px-5 py-4 rounded-lg border text-white font-medium',
              'border-[#2B3139] bg-[#12161c]',
              'hover:border-[#F0B90B] hover:bg-[#F0B90B]/5 transition-all duration-150',
              'focus:outline-none focus:border-[#F0B90B]'
            )}
          >
            {answer.text}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
