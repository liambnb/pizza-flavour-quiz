'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUESTIONS } from '@/lib/questions';
import { scoreAnswers } from '@/lib/scoring';
import { rollRarity } from '@/lib/rarity';
import { getFlavourById } from '@/lib/flavours';
import QuestionCard from './QuestionCard';
import ResultReveal from './ResultReveal';
import ConnectWalletButton from './ConnectWalletButton';
import TxToast from './TxToast';
import CheckerBand from './ui/CheckerBand';
import Sparkle, { SparkleCluster } from './ui/Sparkle';
import Starburst from './ui/Starburst';
import PizzaMascot from './ui/PizzaMascot';
import WalletPill from './WalletPill';
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

  const addToast = useCallback((t: Toast) => setToasts((p) => [...p, t]), []);
  const dismissToast = useCallback((id: string) => setToasts((p) => p.filter((t) => t.id !== id)), []);

  const handleStart = useCallback(() => { setAnswers([]); setFlowState('q0'); }, []);

  const handleAnswer = useCallback(
    (answerId: string) => {
      const qIndex = Q_STATES.indexOf(flowState);
      if (qIndex === -1) return;
      const newAnswers = [...answers, answerId];
      setAnswers(newAnswers);
      if (qIndex < QUESTIONS.length - 1) {
        setFlowState(Q_STATES[qIndex + 1]);
      } else {
        setFlowState('revealing');
        setTimeout(() => {
          const flavourId = scoreAnswers(newAnswers);
          const f = getFlavourById(flavourId) ?? getFlavourById('margherita')!;
          setFlavour(f);
          setRarity(rollRarity(flavourId));
          setFlowState('result');
        }, 1400);
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

  const qIndex = Q_STATES.indexOf(flowState);
  const currentQuestion = qIndex >= 0 ? QUESTIONS[qIndex] : null;

  return (
    <div className="min-h-screen flex flex-col bg-bnb text-ink" style={{ fontFamily: 'var(--font-body)' }}>
      {/* ── NAV ── */}
      <header className="flex items-center justify-between px-4 md:px-8 py-3 border-b-4 border-ink shrink-0 bg-bnb">
        <button
          onClick={flowState !== 'intro' ? handleReset : undefined}
          className="flex items-center gap-2 group"
        >
          <span className="text-2xl">🍕</span>
          <span
            className="text-ink font-display text-sm uppercase tracking-widest hidden sm:block group-hover:opacity-70 transition-opacity"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            BNB Pizza Day
          </span>
        </button>
        {isConnected ? <WalletPill /> : <ConnectWalletButton onToast={addToast} />}
      </header>

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {flowState === 'intro' && (
            <IntroScreen key="intro" onStart={handleStart} />
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
          {flowState === 'revealing' && <RevealingScreen key="revealing" />}
          {flowState === 'result' && flavour && (
            <ResultReveal
              key="result"
              flavour={flavour}
              rarity={rarity}
              isConnected={isConnected}
              onToast={addToast}
              onReset={handleReset}
              onConnectNeeded={() => {}}
            />
          )}
        </AnimatePresence>
      </main>

      {/* ── FOOTER ── */}
      {flowState === 'intro' && (
        <footer className="shrink-0">
          <CheckerBand height={24} />
          <div className="bg-bnb py-3 flex items-center justify-center gap-3">
            <Sparkle size={12} />
            <span
              className="text-ink text-xs uppercase tracking-[0.2em]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Bitcoin Pizza Day · 2026 · From BNB Chain
            </span>
            <Sparkle size={12} />
          </div>
        </footer>
      )}

      <TxToast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

/* ─── Landing / Intro ─── */
function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col"
    >
      {/* Top checker band */}
      <CheckerBand height={24} />

      {/* Hero */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 px-6 py-10 relative overflow-hidden">
        <SparkleCluster count={8} />

        {/* Text side */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-lg z-10">
          <p
            className="text-ink text-sm uppercase tracking-[0.3em] mb-2"
            style={{ fontFamily: 'var(--font-body)', fontWeight: 700 }}
          >
            Happy Bitcoin Pizza Day
          </p>

          <h1
            className="text-ink leading-none mb-4 uppercase"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 10vw, 6rem)',
              letterSpacing: '-0.01em',
              fontWeight: 900,
            }}
          >
            What
            <br />
            Slice
            <br />
            Are You?
          </h1>

          <p
            className="text-ink text-base mb-8 max-w-xs"
            style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.9rem' }}
          >
            Take the quiz. Get your card. Mint the slice.
          </p>

          <button
            onClick={onStart}
            className="btn-retro bg-ink text-bnb px-8 py-4 text-xl uppercase rounded-sm"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Start the Slice Test
          </button>

          <p className="text-ink/60 text-xs mt-4 uppercase tracking-widest">
            5 questions · 10+ possible flavours
          </p>
        </div>

        {/* Mascot + starbursts */}
        <div className="relative z-10 flex items-center justify-center">
          {/* Speech bubbles */}
          <div className="absolute -left-4 top-8 rotate-[-8deg]">
            <Starburst size={90} rotate={-10}>
              MAXIMIZE
              YOUR BTC!
            </Starburst>
          </div>
          <div className="absolute -right-2 top-6 rotate-[6deg]">
            <Starburst size={84} variant="b" rotate={5}>
              #BNB
              PIZZADAY
            </Starburst>
          </div>

          <PizzaMascot width={200} className="drop-shadow-lg" />

          {/* Year badges */}
          <div className="absolute -left-10 bottom-8">
            <div
              className="w-14 h-14 rounded-full bg-ink flex items-center justify-center"
              style={{ border: '3px solid #1A1A1A' }}
            >
              <span
                className="text-bnb font-display text-2xl leading-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                20
              </span>
            </div>
          </div>
          <div className="absolute -right-10 bottom-8">
            <div
              className="w-14 h-14 rounded-full bg-ink flex items-center justify-center"
              style={{ border: '3px solid #1A1A1A' }}
            >
              <span
                className="text-bnb font-display text-2xl leading-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                26
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom checker band */}
      <CheckerBand height={24} />
    </motion.div>
  );
}

/* ─── Revealing loader ─── */
function RevealingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col items-center justify-center gap-6"
    >
      <CheckerBand height={24} className="w-full" />
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="text-6xl"
        >
          🍕
        </motion.div>
        <p
          className="text-ink text-3xl uppercase"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Slicing Your Card…
        </p>
        <p className="text-ink/60 text-sm uppercase tracking-widest">
          Determining your flavour
        </p>
      </div>
      <CheckerBand height={24} className="w-full" />
    </motion.div>
  );
}
