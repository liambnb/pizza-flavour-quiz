'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMockWallet } from '@/lib/use-mock-wallet';
import { BNB_CHAIN, generateFakeBlockNumber } from '@/lib/mock-wallet';
import { SIM_TIMINGS } from '@/lib/mock-wallet';
import type { Flavour } from '@/lib/flavours';
import type { Rarity } from '@/lib/rarity';
import type { Toast } from './TxToast';

interface Props {
  flavour: Flavour;
  rarity: Rarity;
  onToast: (t: Toast) => void;
  onMinted: (txHash: string, tokenId: number) => void;
  onCancel: () => void;
}

type MintStep = 'signing' | 'broadcasting' | 'confirming' | 'success';

export default function MintFlow({ flavour, rarity, onToast, onMinted, onCancel }: Props) {
  const { mint, txStatus, currentTxHash, tokenId } = useMockWallet();
  const [step, setStep] = useState<MintStep>('signing');
  const [confirmCount, setConfirmCount] = useState(0);
  const [blockNumber, setBlockNumber] = useState('');
  const [rejected, setRejected] = useState(false);
  const didStart = useRef(false);

  const [forceReject, setForceReject] = useState(false);
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setForceReject(p.get('fail') === 'mint');
  }, []);

  const runMint = useCallback(async () => {
    setRejected(false);
    setStep('signing');
    setConfirmCount(0);

    try {
      // signing -> broadcasting -> confirming -> success handled by hook timing
      // We watch txStatus to update our local step for UI
      const result = await mint({ flavourId: flavour.id, rarity }, forceReject);

      onToast({
        id: `tx-sub-${Date.now()}`,
        type: 'info',
        title: 'Transaction submitted · Mint Pizza Card',
        subtitle: BNB_CHAIN.name,
      });

      const bn = generateFakeBlockNumber();
      setBlockNumber(bn);

      onToast({
        id: `tx-conf-${Date.now()}`,
        type: 'success',
        title: 'Transaction confirmed',
        subtitle: `Block ${bn}`,
      });

      setStep('success');
      onMinted(result.txHash, result.tokenId);
    } catch {
      setRejected(true);
      onToast({
        id: `tx-rej-${Date.now()}`,
        type: 'error',
        title: 'Transaction rejected in wallet',
      });
    }
  }, [mint, flavour.id, rarity, forceReject, onToast, onMinted]);

  // Sync step with txStatus from hook
  useEffect(() => {
    if (txStatus === 'broadcasting') setStep('broadcasting');
    if (txStatus === 'confirming') setStep('confirming');
    if (txStatus === 'success') setStep('success');
  }, [txStatus]);

  // Confirmation counter
  useEffect(() => {
    if (step !== 'confirming') return;
    setConfirmCount(0);
    const interval = setInterval(() => {
      setConfirmCount((c) => {
        if (c >= 3) { clearInterval(interval); return 3; }
        return c + 1;
      });
    }, SIM_TIMINGS.confirming / 3);
    return () => clearInterval(interval);
  }, [step]);

  // Auto-start
  useEffect(() => {
    if (didStart.current) return;
    didStart.current = true;
    runMint();
  }, [runMint]);

  const rarityLabel = rarity.charAt(0).toUpperCase() + rarity.slice(1);
  const txHashShort = currentTxHash
    ? `${currentTxHash.slice(0, 10)}...${currentTxHash.slice(-6)}`
    : '';

  if (rejected) {
    return (
      <div className="bg-[#1a1f27] border border-red-500/40 rounded-2xl p-6 text-center space-y-4">
        <div className="text-4xl">❌</div>
        <p className="text-red-400 font-bold">Transaction rejected</p>
        <p className="text-[#848E9C] text-sm">You rejected the request in your wallet.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => runMint()}
            className="bg-[#F0B90B] text-black font-bold px-5 py-2.5 rounded-lg hover:bg-[#FFD93D] transition-colors text-sm"
          >
            Try again
          </button>
          <button
            onClick={onCancel}
            className="bg-[#2B3139] text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-[#3B4149] transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {/* Step indicators */}
      <div className="flex items-center justify-between mb-4">
        {(['signing', 'broadcasting', 'confirming', 'success'] as MintStep[]).map((s, i) => {
          const idx = ['signing', 'broadcasting', 'confirming', 'success'].indexOf(step);
          const sIdx = i;
          const done = sIdx < idx || step === 'success';
          const active = s === step;
          return (
            <div key={s} className="flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full transition-colors ${
                  done ? 'bg-green-400' : active ? 'bg-[#F0B90B] animate-pulse' : 'bg-[#2B3139]'
                }`}
              />
              {i < 3 && <div className="w-8 h-px bg-[#2B3139]" />}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {step === 'signing' && (
          <SigningCard
            key="signing"
            flavourName={flavour.name}
            rarityLabel={rarityLabel}
          />
        )}
        {step === 'broadcasting' && (
          <BroadcastingCard key="broadcasting" txHash={currentTxHash} txHashShort={txHashShort} />
        )}
        {step === 'confirming' && (
          <ConfirmingCard key="confirming" confirmCount={confirmCount} />
        )}
        {step === 'success' && (
          <SuccessCard
            key="success"
            txHash={currentTxHash}
            txHashShort={txHashShort}
            tokenId={tokenId}
            blockNumber={blockNumber}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StepCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
      className="bg-[#12161c] border border-[#2B3139] rounded-2xl p-5 space-y-4"
    >
      {children}
    </motion.div>
  );
}

function SigningCard({ flavourName, rarityLabel }: { flavourName: string; rarityLabel: string }) {
  return (
    <StepCard>
      <div className="flex items-center gap-3 pb-3 border-b border-[#2B3139]">
        <span className="text-3xl">🦊</span>
        <div>
          <p className="text-white font-bold">Confirm in your wallet</p>
          <p className="text-[#848E9C] text-xs">MetaMask · BNB Smart Chain</p>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <Row label="Action" value="Mint Pizza Flavour Card" />
        <Row label="Flavour" value={flavourName} />
        <Row label="Rarity" value={rarityLabel} />
        <Row label="Estimated gas" value="0.00012 BNB" />
        <Row label="Network" value={BNB_CHAIN.name} />
      </div>
      <div className="flex items-center gap-2 pt-1">
        <Spinner />
        <p className="text-[#848E9C] text-xs animate-pulse">Waiting for signature…</p>
      </div>
      <div className="flex gap-2 pt-1">
        <button className="flex-1 bg-[#F0B90B] text-black font-bold py-2.5 rounded-lg text-sm cursor-not-allowed opacity-60">
          Confirm
        </button>
        <button className="flex-1 bg-[#2B3139] text-white font-semibold py-2.5 rounded-lg text-sm cursor-not-allowed opacity-40">
          Reject
        </button>
      </div>
    </StepCard>
  );
}

function BroadcastingCard({ txHash, txHashShort }: { txHash: string | null; txHashShort: string }) {
  return (
    <StepCard>
      <div className="flex items-center gap-3">
        <Spinner />
        <p className="text-white font-bold">Sending to network…</p>
      </div>
      {txHash && (
        <div className="bg-[#0B0E11] rounded-lg p-3 text-xs">
          <p className="text-[#848E9C] mb-1">Tx hash</p>
          <a
            href={`${BNB_CHAIN.explorer}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F0B90B] hover:underline font-mono break-all"
          >
            {txHashShort} ↗
          </a>
        </div>
      )}
      <p className="text-[#848E9C] text-xs">Transaction submitted to {BNB_CHAIN.name}</p>
    </StepCard>
  );
}

function ConfirmingCard({ confirmCount }: { confirmCount: number }) {
  return (
    <StepCard>
      <div className="flex items-center gap-3">
        <Spinner />
        <p className="text-white font-bold">Waiting for confirmation…</p>
      </div>
      <div className="bg-[#0B0E11] rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[#848E9C] text-xs">Confirmations</span>
          <span className="text-white font-bold text-sm">{confirmCount}/3</span>
        </div>
        <div className="h-1.5 bg-[#2B3139] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-green-400 rounded-full"
            animate={{ width: `${(confirmCount / 3) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </StepCard>
  );
}

function SuccessCard({
  txHash,
  txHashShort,
  tokenId,
  blockNumber,
}: {
  txHash: string | null;
  txHashShort: string;
  tokenId: number | null;
  blockNumber: string;
}) {
  return (
    <StepCard>
      <div className="text-center space-y-3">
        <div className="relative inline-block">
          <span className="text-5xl">✅</span>
          <Confetti />
        </div>
        <p className="text-white font-black text-xl">Card minted!</p>
        {tokenId && (
          <p className="text-[#F0B90B] font-bold">
            Token #{tokenId} on BNB Smart Chain
          </p>
        )}
        {blockNumber && (
          <p className="text-[#848E9C] text-xs">Block {blockNumber}</p>
        )}
      </div>
      {txHash && (
        <a
          href={`${BNB_CHAIN.explorer}/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#0B0E11] border border-[#2B3139] rounded-lg px-4 py-2.5 text-[#F0B90B] text-sm hover:border-[#F0B90B]/40 transition-colors"
        >
          View on BscScan ↗
        </a>
      )}
    </StepCard>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[#848E9C]">{label}</span>
      <span className="text-white font-medium text-right">{value}</span>
    </div>
  );
}

function Spinner() {
  return (
    <div className="w-4 h-4 rounded-full border-2 border-[#F0B90B] border-t-transparent animate-spin shrink-0" />
  );
}

function Confetti() {
  const pieces = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {pieces.map((i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            background: ['#F0B90B', '#FFD93D', '#43AA8B', '#E63946', '#6A4C93'][i % 5],
            top: '50%',
            left: '50%',
          }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0 }}
          animate={{
            x: (Math.cos((i / 12) * Math.PI * 2) * 60),
            y: (Math.sin((i / 12) * Math.PI * 2) * 60),
            opacity: 0,
            rotate: 360,
            scale: 1,
          }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}
