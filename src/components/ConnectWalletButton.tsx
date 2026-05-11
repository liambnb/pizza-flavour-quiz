'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMockWallet } from '@/lib/use-mock-wallet';
import { MOCK_WALLETS } from '@/lib/mock-wallet';
import WalletPill from './WalletPill';
import CheckerBand from './ui/CheckerBand';
import type { Toast } from './TxToast';

interface Props {
  onToast?: (t: Toast) => void;
  onConnected?: () => void;
}

export default function ConnectWalletButton({ onToast, onConnected }: Props) {
  const { isConnected, connect } = useMockWallet();
  const [open, setOpen] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [forceReject, setForceReject] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setForceReject(p.get('fail') === 'connect');
  }, []);

  const handleConnect = useCallback(async (walletId: string) => {
    setConnecting(walletId);
    try {
      await connect(walletId, forceReject);
      setOpen(false);
      onToast?.({ id: `conn-${Date.now()}`, type: 'success', title: 'Wallet connected', subtitle: 'BNB Smart Chain' });
      onConnected?.();
    } catch {
      setOpen(false);
      onToast?.({ id: `conn-err-${Date.now()}`, type: 'error', title: 'You rejected the connection request' });
    } finally {
      setConnecting(null);
    }
  }, [connect, forceReject, onToast, onConnected]);

  if (isConnected) return <WalletPill />;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn-retro bg-ink text-bnb font-black px-5 py-2 text-sm uppercase"
        style={{ fontFamily: 'var(--font-alfa-slab)', borderRadius: 4 }}
      >
        Connect Wallet
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ background: 'rgba(26,26,26,0.82)', zIndex: 50 }}
            onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 12 }}
              transition={{ duration: 0.18 }}
              className="bg-cream w-full max-w-sm overflow-hidden"
              style={{ border: '4px solid #1A1A1A', boxShadow: '8px 8px 0 #1A1A1A', borderRadius: 4 }}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <h2
                  className="text-ink uppercase text-xl"
                  style={{ fontFamily: 'var(--font-alfa-slab)' }}
                >
                  Connect Wallet
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center border-2 border-ink bg-bnb hover:bg-bnb-2 transition-colors font-black text-ink"
                  style={{ borderRadius: 4 }}
                >
                  ✕
                </button>
              </div>

              <CheckerBand height={16} />

              {/* Wallet list */}
              <div className="p-3 flex flex-col gap-2">
                {MOCK_WALLETS.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => handleConnect(w.id)}
                    disabled={!!connecting}
                    className="flex items-center gap-3 px-4 py-3 border-2 border-ink bg-bnb hover:bg-bnb-2 transition-colors disabled:opacity-50 text-left"
                    style={{ boxShadow: '3px 3px 0 #1A1A1A', borderRadius: 4 }}
                  >
                    <span className="text-2xl">{w.icon}</span>
                    <span
                      className="text-ink font-bold flex-1"
                      style={{ fontFamily: 'var(--font-bungee)', fontSize: '0.9rem' }}
                    >
                      {w.name}
                    </span>
                    {w.popular && (
                      <span
                        className="text-[10px] font-black bg-ink text-bnb px-1.5 py-0.5"
                        style={{ borderRadius: 2 }}
                      >
                        POPULAR
                      </span>
                    )}
                    {connecting === w.id && (
                      <span className="text-ink/60 text-xs animate-pulse" style={{ fontFamily: 'var(--font-bungee)' }}>
                        Connecting…
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {connecting && (
                <div className="px-5 pb-4 text-center">
                  <p
                    className="text-ink/60 text-sm animate-pulse"
                    style={{ fontFamily: 'var(--font-bungee)' }}
                  >
                    Waiting for {MOCK_WALLETS.find((w) => w.id === connecting)?.name}…
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
