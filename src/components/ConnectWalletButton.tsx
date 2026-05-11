'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMockWallet } from '@/lib/use-mock-wallet';
import { MOCK_WALLETS } from '@/lib/mock-wallet';
import WalletPill from './WalletPill';
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

  const handleConnect = useCallback(
    async (walletId: string) => {
      setConnecting(walletId);
      try {
        await connect(walletId, forceReject);
        setOpen(false);
        onToast?.({
          id: `conn-${Date.now()}`,
          type: 'success',
          title: 'Wallet connected',
          subtitle: 'BNB Smart Chain',
        });
        onConnected?.();
      } catch {
        setOpen(false);
        onToast?.({
          id: `conn-err-${Date.now()}`,
          type: 'error',
          title: 'You rejected the connection request',
        });
      } finally {
        setConnecting(null);
      }
    },
    [connect, forceReject, onToast, onConnected]
  );

  if (isConnected) return <WalletPill />;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-[#F0B90B] text-black font-bold text-sm px-4 py-2 rounded-full hover:bg-[#FFD93D] transition-colors"
      >
        Connect Wallet
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ duration: 0.18 }}
              className="bg-[#12161c] border border-[#2B3139] rounded-2xl w-full max-w-sm overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-[#2B3139]">
                <h2 className="text-white font-bold text-lg">Connect Wallet</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-[#848E9C] hover:text-white transition-colors text-xl leading-none"
                >
                  ✕
                </button>
              </div>
              <div className="p-3">
                {MOCK_WALLETS.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => handleConnect(w.id)}
                    disabled={!!connecting}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#2B3139] transition-colors group disabled:opacity-60"
                  >
                    <span className="text-2xl">{w.icon}</span>
                    <span className="text-white font-medium flex-1 text-left">{w.name}</span>
                    {w.popular && (
                      <span className="text-[10px] font-bold bg-[#F0B90B] text-black px-1.5 py-0.5 rounded">
                        POPULAR
                      </span>
                    )}
                    {connecting === w.id && (
                      <span className="text-[#F0B90B] text-xs animate-pulse">Connecting…</span>
                    )}
                  </button>
                ))}
              </div>
              {connecting && (
                <div className="px-5 pb-4 text-center">
                  <p className="text-[#848E9C] text-sm animate-pulse">
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
