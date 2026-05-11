'use client';

import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import CollectorCard from './CollectorCard';
import ShareBar from './ShareBar';
import MintFlow from './MintFlow';
import CheckerBand from './ui/CheckerBand';
import Sparkle, { SparkleCluster } from './ui/Sparkle';
import Starburst from './ui/Starburst';
import type { Flavour } from '@/lib/flavours';
import type { Rarity } from '@/lib/rarity';
import type { Toast } from './TxToast';

interface Props {
  flavour: Flavour;
  rarity: Rarity;
  isConnected: boolean;
  onToast: (t: Toast) => void;
  onReset: () => void;
  onConnectNeeded: () => void;
}

type ResultState = 'idle' | 'minting' | 'minted';

export default function ResultReveal({
  flavour,
  rarity,
  isConnected,
  onToast,
  onReset,
  onConnectNeeded,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [resultState, setResultState] = useState<ResultState>('idle');
  const [mintTokenId, setMintTokenId] = useState<number | null>(null);

  const handleMintClick = useCallback(() => {
    if (!isConnected) { onConnectNeeded(); return; }
    setResultState('minting');
  }, [isConnected, onConnectNeeded]);

  const handleMinted = useCallback((_txHash: string, tokenId: number) => {
    setMintTokenId(tokenId);
    setResultState('minted');
  }, []);

  const isMintDone = resultState === 'minted';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col bg-cream"
    >
      <CheckerBand height={24} />

      {/* Result headline */}
      <div className="py-6 px-4 text-center border-b-4 border-ink bg-cream relative">
        <SparkleCluster count={6} />
        <p
          className="text-ink/60 text-xs uppercase tracking-[0.3em] mb-1"
          style={{ fontFamily: 'var(--font-display-2)' }}
        >
          Your flavour is
        </p>
        <h2
          className="text-ink uppercase leading-tight"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 8vw, 3.5rem)' }}
        >
          {flavour.name} {flavour.emoji}
        </h2>
        <p
          className="text-ink/70 mt-1 uppercase tracking-widest text-sm"
          style={{ fontFamily: 'var(--font-display-2)', color: flavour.accentColor, WebkitTextStroke: '0.5px #1A1A1A' }}
        >
          {flavour.tagline}
        </p>

        {/* Rarity callout starburst */}
        {rarity !== 'normal' && (
          <div className="absolute top-4 right-4">
            <Starburst
              size={72}
              bg={rarity === 'gold' ? '#F0B90B' : '#1A1A1A'}
              textColor={rarity === 'gold' ? '#1A1A1A' : '#C0C0C0'}
              rotate={12}
            >
              {rarity === 'gold' ? '✦ HOLO ✦' : 'SILVER!'}
            </Starburst>
          </div>
        )}
      </div>

      {/* Card + controls */}
      <div className="flex-1 flex flex-col md:flex-row items-start justify-center gap-8 px-4 py-8">
        {/* Card column */}
        <div className="flex flex-col items-center gap-5 mx-auto">
          <motion.div
            initial={{ rotateY: 90, scale: 0.85 }}
            animate={{ rotateY: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ perspective: 1000 }}
          >
            <CollectorCard
              ref={cardRef}
              flavour={flavour}
              rarity={rarity}
              tokenId={mintTokenId}
            />
          </motion.div>

          <ShareBar flavour={flavour} cardRef={cardRef} onToast={onToast} />

          {resultState === 'idle' && (
            <div className="flex flex-col items-center gap-3 w-full">
              <button
                onClick={handleMintClick}
                className="btn-retro bg-ink text-bnb px-8 py-3.5 text-lg uppercase w-full max-w-xs"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Mint to BNB Chain
              </button>
              <button
                onClick={onReset}
                className="text-ink/50 hover:text-ink text-sm transition-colors underline underline-offset-2"
              >
                Take it again
              </button>
            </div>
          )}

          {isMintDone && (
            <div className="flex flex-col items-center gap-3 w-full">
              <button
                disabled
                className="btn-retro bg-ink/30 text-ink px-8 py-3.5 text-lg uppercase w-full max-w-xs cursor-not-allowed"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Minted ✓
              </button>
              <button
                onClick={onReset}
                className="text-ink/50 hover:text-ink text-sm transition-colors underline underline-offset-2"
              >
                Take it again
              </button>
            </div>
          )}
        </div>

        {/* Mint flow panel */}
        {(resultState === 'minting' || resultState === 'minted') && (
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-80 shrink-0"
          >
            <MintFlow
              flavour={flavour}
              rarity={rarity}
              onToast={onToast}
              onMinted={handleMinted}
              onCancel={() => setResultState('idle')}
            />
          </motion.div>
        )}
      </div>

      <CheckerBand height={24} />
    </motion.div>
  );
}
