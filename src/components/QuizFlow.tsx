'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUESTIONS } from '@/lib/questions';
import { scoreAnswers } from '@/lib/scoring';
import { rollRarity } from '@/lib/rarity';
import { getFlavourById } from '@/lib/flavours';
import QuestionCard from './QuestionCard';
import ResultReveal from './ResultReveal';
import ConnectWalletButton from './ConnectWalletButton';
import TxToast from './TxToast';
import { useMockWallet } from '@/lib/use-mock-wallet';
import type { Toast } from './TxToast';
import type { Flavour } from '@/lib/flavours';
import type { Rarity } from '@/lib/rarity';

type FlowState =
  | 'intro'
  | 'q0' | 'q1' | 'q2' | 'q3' | 'q4'
  | 'revealing'
  | 'result';

const Q_STATES: FlowState[] = ['q0', 'q1', 'q2', 'q3', 'q4'];

export default function QuizFlow() {
  const [flowState, setFlowState] = useState<FlowState>('intro');
  const [answers, setAnswers] = useState<string[]>([]);
  const [flavour, setFlavour] = useState<Flavour | null>(null);
  const [rarity, setRarity] = useState<Rarity>('normal');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { isConnected } = useMockWallet();
  const connectCallbackRef = useRef<(() => void) | null>(null);

  const addToast = useCallback((t: Toast) => {
    setToasts((prev) => [...prev, t]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleStart = useCallback(() => {
    setAnswers([]);
    setFlowState('q0');
  }, []);

  const handleAnswer = useCallback(
    (answerId: string) => {
      const qIndex = Q_STATES.indexOf(flowState);
      if (qIndex === -1) return;

      const newAnswers = [...answers, answerId];
      setAnswers(newAnswers);

      if (qIndex < QUESTIONS.length - 1) {
        setFlowState(Q_STATES[qIndex + 1]);
      } else {
        // All answered — score
        setFlowState('revealing');
        setTimeout(() => {
          const flavourId = scoreAnswers(newAnswers);
          const f = getFlavourById(flavourId) ?? getFlavourById('margherita')!;
          const r = rollRarity(flavourId);
          setFlavour(f);
          setRarity(r);
          setFlowState('result');
        }, 1200);
      }
    },
    [flowState, answers]
  );

  const handleReset = useCallback(() => {
    setFlowState('intro');
    setAnswers([]);
    setFlavour(null);
    setRarity('normal');
  }, []);

  const handleConnectNeeded = useCallback(() => {
    // Store a callback to auto-proceed after connect
    connectCallbackRef.current = null; // just need the connect modal
    // trigger via state — the ConnectWalletButton's onConnected will fire
    document.getElementById('connect-wallet-trigger')?.click();
  }, []);

  const qIndex = Q_STATES.indexOf(flowState);
  const currentQuestion = qIndex >= 0 ? QUESTIONS[qIndex] : null;

  return (
    <div className="min-h-screen bg-[#0B0E11] flex flex-col">
      {/* Top nav */}
      <header className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-[#2B3139] shrink-0">
        <button
          onClick={flowState !== 'intro' ? handleReset : undefined}
          className="flex items-center gap-2 group"
        >
          <span className="text-2xl">🍕</span>
          <span className="text-white font-black text-sm uppercase tracking-widest hidden sm:block group-hover:text-[#F0B90B] transition-colors">
            BNB Pizza Day
          </span>
        </button>
        <ConnectWalletButton onToast={addToast} />
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-16">
        <AnimatePresence mode="wait">
          {flowState === 'intro' && (
            <Intro key="intro" onStart={handleStart} />
          )}

          {currentQuestion && (
            <QuestionCard
              key={flowState}
              question={currentQuestion}
              questionNumber={qIndex + 1}
              total={QUESTIONS.length}
              onAnswer={handleAnswer}
            />
          )}

          {flowState === 'revealing' && (
            <Revealing key="revealing" />
          )}

          {flowState === 'result' && flavour && (
            <ResultReveal
              key="result"
              flavour={flavour}
              rarity={rarity}
              isConnected={isConnected}
              onToast={addToast}
              onReset={handleReset}
              onConnectNeeded={handleConnectNeeded}
            />
          )}
        </AnimatePresence>
      </main>

      <TxToast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
      className="text-center max-w-2xl"
    >
      <div className="text-7xl md:text-8xl mb-6">🍕</div>
      <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight tracking-tight">
        What slice of<br />
        <span style={{ color: '#F0B90B' }}>crypto</span> are you?
      </h1>
      <p className="text-[#848E9C] text-lg md:text-xl mb-10 max-w-md mx-auto leading-relaxed">
        Take the quiz, get your card, share it.
        <br />
        <span className="text-[#EAECEF] text-base">Bitcoin Pizza Day 2026 · @BNBCHAIN</span>
      </p>
      <button
        onClick={onStart}
        className="bg-[#F0B90B] hover:bg-[#FFD93D] text-black font-black text-xl px-10 py-4 rounded-lg transition-colors shadow-lg shadow-[#F0B90B]/20"
      >
        Start the slice test
      </button>
      <p className="text-[#848E9C] text-sm mt-6">5 questions · 10+ possible flavours</p>
    </motion.div>
  );
}

function Revealing() {
  return (
    <motion.div
      key="revealing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center gap-4 text-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="text-5xl"
      >
        🍕
      </motion.div>
      <p className="text-white font-bold text-xl">Slicing your card…</p>
      <p className="text-[#848E9C] text-sm">Determining your flavour</p>
    </motion.div>
  );
}
