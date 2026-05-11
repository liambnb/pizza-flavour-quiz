'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMockWallet } from '@/lib/use-mock-wallet';
import { BNB_CHAIN, generateFakeBlockNumber, SIM_TIMINGS } from '@/lib/mock-wallet';
import CheckerBand from './ui/CheckerBand';
import Sparkle, { SparkleCluster } from './ui/Sparkle';
import Starburst from './ui/Starburst';
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
      const result = await mint({ flavourId: flavour.id, rarity }, forceReject);
      onToast({ id: `tx-sub-${Date.now()}`, type: 'info', title: 'Transaction submitted · Mint Pizza Card', subtitle: BNB_CHAIN.name });
      const bn = generateFakeBlockNumber();
      setBlockNumber(bn);
      onToast({ id: `tx-conf-${Date.now()}`, type: 'success', title: 'Transaction confirmed', subtitle: `Block ${bn}` });
      setStep('success');
      onMinted(result.txHash, result.tokenId);
    } catch {
      setRejected(true);
      onToast({ id: `tx-rej-${Date.now()}`, type: 'error', title: 'Transaction rejected in wallet' });
    }
  }, [mint, flavour.id, rarity, forceReject, onToast, onMinted]);

  useEffect(() => {
    if (txStatus === 'broadcasting') setStep('broadcasting');
    if (txStatus === 'confirming')   setStep('confirming');
    if (txStatus === 'success')      setStep('success');
  }, [txStatus]);

  useEffect(() => {
    if (step !== 'confirming') return;
    setConfirmCount(0);
    const iv = setInterval(() => {
      setConfirmCount((c) => { if (c >= 3) { clearInterval(iv); return 3; } return c + 1; });
    }, SIM_TIMINGS.confirming / 3);
    return () => clearInterval(iv);
  }, [step]);

  useEffect(() => {
    if (didStart.current) return;
    didStart.current = true;
    runMint();
  }, [runMint]);

  const rarityLabel = rarity.charAt(0).toUpperCase() + rarity.slice(1);
  const txHashShort = currentTxHash ? `${currentTxHash.slice(0, 10)}...${currentTxHash.slice(-6)}` : '';

  if (rejected) {
    return (
      /* Retro rejection panel */
      <div
        className="bg-cream border-4 border-ink p-6 text-center space-y-4"
        style={{ boxShadow: '6px 6px 0 #1A1A1A', borderRadius: 4 }}
      >
        <div className="text-4xl">❌</div>
        <p className="text-tomato font-black text-lg uppercase" style={{ fontFamily: 'var(--font-alfa-slab)' }}>Transaction Rejected</p>
        <p className="text-ink/70 text-sm">You rejected the request in your wallet.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={runMint} className="btn-retro bg-ink text-bnb px-5 py-2.5 text-sm uppercase font-black" style={{ fontFamily: 'var(--font-bungee)', borderRadius: 4 }}>Try again</button>
          <button onClick={onCancel} className="btn-retro bg-cream text-ink px-5 py-2.5 text-sm uppercase font-bold" style={{ fontFamily: 'var(--font-bungee)', borderRadius: 4 }}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {/* Step progress */}
      <div className="flex items-center gap-1 justify-between px-1">
        {(['signing', 'broadcasting', 'confirming', 'success'] as MintStep[]).map((s, i) => {
          const curIdx = ['signing','broadcasting','confirming','success'].indexOf(step);
          const done = i < curIdx || step === 'success';
          const active = s === step;
          return (
            <div key={s} className="flex items-center gap-1 flex-1 last:flex-none">
              <div className={`w-3 h-3 rounded-full border-2 border-ink transition-colors ${done ? 'bg-ink' : active ? 'bg-bnb animate-pulse' : 'bg-cream'}`} />
              {i < 3 && <div className="flex-1 h-0.5 bg-ink/20" />}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* ── SIGNING — deliberately looks like MetaMask (realistic, not retro) ── */}
        {step === 'signing' && (
          <motion.div key="signing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-[#1a1f27] rounded-2xl p-5 space-y-4 border border-[#2B3139]"
          >
            <div className="flex items-center gap-3 pb-3 border-b border-[#2B3139]">
              <span className="text-3xl">🦊</span>
              <div>
                <p className="text-white font-bold">Confirm in your wallet</p>
                <p className="text-[#848E9C] text-xs">MetaMask · BNB Smart Chain</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <MetaRow label="Action"        value="Mint Pizza Flavour Card" />
              <MetaRow label="Flavour"       value={flavour.name} />
              <MetaRow label="Rarity"        value={rarityLabel} />
              <MetaRow label="Estimated gas" value="0.00012 BNB" />
              <MetaRow label="Network"       value={BNB_CHAIN.name} />
            </div>
            <div className="flex items-center gap-2">
              <Spinner /><p className="text-[#848E9C] text-xs animate-pulse">Waiting for signature…</p>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-[#F0B90B] text-black font-bold py-2.5 rounded-lg text-sm cursor-not-allowed opacity-60">Confirm</button>
              <button className="flex-1 bg-[#2B3139] text-white font-semibold py-2.5 rounded-lg text-sm cursor-not-allowed opacity-40">Reject</button>
            </div>
          </motion.div>
        )}

        {/* ── BROADCASTING — realistic ── */}
        {step === 'broadcasting' && (
          <motion.div key="broadcasting" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-[#1a1f27] rounded-2xl p-5 space-y-3 border border-[#2B3139]"
          >
            <div className="flex items-center gap-3">
              <Spinner /><p className="text-white font-bold">Sending to network…</p>
            </div>
            {currentTxHash && (
              <div className="bg-[#0B0E11] rounded-lg p-3 text-xs">
                <p className="text-[#848E9C] mb-1">Tx hash</p>
                <a href={`${BNB_CHAIN.explorer}/tx/${currentTxHash}`} target="_blank" rel="noopener noreferrer" className="text-[#F0B90B] hover:underline font-mono break-all">{txHashShort} ↗</a>
              </div>
            )}
            <p className="text-[#848E9C] text-xs">Transaction submitted to {BNB_CHAIN.name}</p>
          </motion.div>
        )}

        {/* ── CONFIRMING — realistic ── */}
        {step === 'confirming' && (
          <motion.div key="confirming" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-[#1a1f27] rounded-2xl p-5 space-y-3 border border-[#2B3139]"
          >
            <div className="flex items-center gap-3">
              <Spinner /><p className="text-white font-bold">Waiting for confirmation…</p>
            </div>
            <div className="bg-[#0B0E11] rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#848E9C] text-xs">Confirmations</span>
                <span className="text-white font-bold text-sm">{confirmCount}/3</span>
              </div>
              <div className="h-1.5 bg-[#2B3139] rounded-full overflow-hidden">
                <motion.div className="h-full bg-green-400 rounded-full" animate={{ width: `${(confirmCount/3)*100}%` }} transition={{ duration: 0.5 }} />
              </div>
            </div>
          </motion.div>
        )}

        {/* ── SUCCESS — RETRO CELEBRATION ── */}
        {step === 'success' && (
          <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="relative bg-ink text-cream overflow-hidden"
            style={{ border: '4px solid #1A1A1A', boxShadow: '6px 6px 0 #F0B90B', borderRadius: 4 }}
          >
            <CheckerBand height={16} />
            <div className="relative px-5 py-6 text-center space-y-3">
              <SparkleCluster count={6} />
              <div className="relative inline-block">
                <span className="text-5xl">✅</span>
                <ConfettiBurst />
              </div>
              <p className="text-bnb uppercase text-2xl" style={{ fontFamily: 'var(--font-alfa-slab)' }}>Card Minted!</p>
              {tokenId && (
                <div className="inline-flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-bnb border-2 border-cream flex items-center justify-center">
                    <span className="text-ink font-black text-xs" style={{ fontFamily: 'var(--font-alfa-slab)' }}>#{tokenId % 100}</span>
                  </div>
                  <p className="text-bnb font-black text-sm uppercase" style={{ fontFamily: 'var(--font-bungee)' }}>
                    Token #{tokenId} · BNB Chain
                  </p>
                </div>
              )}
              {blockNumber && <p className="text-cream/50 text-xs uppercase tracking-widest">Block {blockNumber}</p>}
            </div>
            {currentTxHash && (
              <a
                href={`${BNB_CHAIN.explorer}/tx/${currentTxHash}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 mx-4 mb-4 px-4 py-2.5 text-bnb text-sm border-2 border-bnb hover:bg-bnb/10 transition-colors uppercase font-bold"
                style={{ fontFamily: 'var(--font-bungee)', borderRadius: 4 }}
              >
                View on BscScan ↗
              </a>
            )}
            <CheckerBand height={16} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[#848E9C]">{label}</span>
      <span className="text-white font-medium text-right">{value}</span>
    </div>
  );
}

function Spinner() {
  return <div className="w-4 h-4 rounded-full border-2 border-[#F0B90B] border-t-transparent animate-spin shrink-0" />;
}

function ConfettiBurst() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {Array.from({ length: 10 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            background: ['#F0B90B','#F8D12F','#43AA8B','#D6453D','#F4ECD8'][i % 5],
            top: '50%', left: '50%',
            '--cx': `${Math.cos((i/10)*Math.PI*2)*55}px`,
            '--cy': `${Math.sin((i/10)*Math.PI*2)*55}px`,
          } as React.CSSProperties}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0 }}
          animate={{ x: Math.cos((i/10)*Math.PI*2)*55, y: Math.sin((i/10)*Math.PI*2)*55, opacity: 0, rotate: 360, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}
