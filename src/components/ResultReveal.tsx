'use client';

import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import CollectorCard from './CollectorCard';
import ShareBar from './ShareBar';
import MintFlow from './MintFlow';
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
  const [mintTxHash, setMintTxHash] = useState<string | null>(null);
  const [mintTokenId, setMintTokenId] = useState<number | null>(null);

  const handleMintClick = useCallback(() => {
    if (!isConnected) {
      onConnectNeeded();
      return;
    }
    setResultState('minting');
  }, [isConnected, onConnectNeeded]);

  const handleMinted = useCallback((txHash: string, tokenId: number) => {
    setMintTxHash(txHash);
    setMintTokenId(tokenId);
    setResultState('minted');
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="text-center mb-6">
        <p className="text-[#848E9C] text-sm uppercase tracking-widest mb-2">Your flavour is</p>
        <h2 className="text-3xl md:text-5xl font-black text-white mb-1">
          {flavour.name} {flavour.emoji}
        </h2>
        <p className="text-[#EAECEF] text-lg" style={{ color: flavour.accentColor }}>
          {flavour.tagline}
        </p>
      </div>

      <div className={`flex flex-col ${resultState === 'minting' || resultState === 'minted' ? 'md:flex-row' : ''} items-start justify-center gap-8`}>
        {/* Card */}
        <div className="flex flex-col items-center gap-6 mx-auto">
          <motion.div
            initial={{ rotateY: 90, scale: 0.8 }}
            animate={{ rotateY: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ perspective: 1000 }}
          >
            <CollectorCard
              ref={cardRef}
              flavour={flavour}
              rarity={rarity}
              tokenId={mintTokenId}
            />
          </motion.div>

          {/* Share bar — always shown */}
          <ShareBar flavour={flavour} cardRef={cardRef} onToast={onToast} />

          {/* Mint CTA / status */}
          {resultState === 'idle' && (
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={handleMintClick}
                className="bg-[#F0B90B] hover:bg-[#FFD93D] text-black font-black text-lg px-8 py-3.5 rounded-lg transition-colors"
              >
                Mint to BNB Chain
              </button>
              <button
                onClick={onReset}
                className="text-[#848E9C] hover:text-white text-sm transition-colors underline underline-offset-2"
              >
                Take it again
              </button>
            </div>
          )}

          {resultState === 'minted' && (
            <div className="flex flex-col items-center gap-3">
              <button
                disabled
                className="bg-[#2B3139] text-[#848E9C] font-black text-lg px-8 py-3.5 rounded-lg cursor-not-allowed"
              >
                Minted ✓
              </button>
              <button
                onClick={onReset}
                className="text-[#848E9C] hover:text-white text-sm transition-colors underline underline-offset-2"
              >
                Take it again
              </button>
            </div>
          )}
        </div>

        {/* Mint flow panel */}
        {(resultState === 'minting' || resultState === 'minted') && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
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
    </motion.div>
  );
}
