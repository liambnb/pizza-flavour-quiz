'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  createElement,
} from 'react';
import {
  generateFakeAddress,
  generateFakeTxHash,
  generateFakeTokenId,
  SIM_TIMINGS,
} from './mock-wallet';
import type { Rarity } from './rarity';

export type TxStatus =
  | 'idle'
  | 'signing'
  | 'broadcasting'
  | 'confirming'
  | 'success'
  | 'rejected';

export interface MintResult {
  txHash: string;
  tokenId: number;
}

interface WalletContextValue {
  address: string | null;
  isConnected: boolean;
  chainId: 56;
  txStatus: TxStatus;
  currentTxHash: string | null;
  tokenId: number | null;
  connect: (walletId: string, forceReject?: boolean) => Promise<void>;
  disconnect: () => void;
  mint: (params: { flavourId: string; rarity: Rarity }, forceReject?: boolean) => Promise<MintResult>;
  resetTx: () => void;
}

const WalletContext = createContext<WalletContextValue | null>(null);

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export function MockWalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<TxStatus>('idle');
  const [currentTxHash, setCurrentTxHash] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<number | null>(null);

  const connect = useCallback(
    async (walletId: string, forceReject = false) => {
      await sleep(SIM_TIMINGS.connectModalLatency);
      // 1-in-15 random rejection OR forced
      if (forceReject || Math.random() < 1 / 15) {
        throw new Error('User rejected the connection request');
      }
      const addr = generateFakeAddress();
      setAddress(addr);
    },
    []
  );

  const disconnect = useCallback(() => {
    setAddress(null);
    setTxStatus('idle');
    setCurrentTxHash(null);
    setTokenId(null);
  }, []);

  const mint = useCallback(
    async (
      _params: { flavourId: string; rarity: Rarity },
      forceReject = false
    ): Promise<MintResult> => {
      setTxStatus('signing');
      await sleep(SIM_TIMINGS.signaturePrompt);

      // 1-in-25 random rejection OR forced
      if (forceReject || Math.random() < 1 / 25) {
        setTxStatus('rejected');
        throw new Error('Transaction rejected in wallet');
      }

      const hash = generateFakeTxHash();
      setTxStatus('broadcasting');
      setCurrentTxHash(hash);
      await sleep(SIM_TIMINGS.broadcasting);

      setTxStatus('confirming');
      await sleep(SIM_TIMINGS.confirming);

      const tid = generateFakeTokenId();
      setTokenId(tid);
      setTxStatus('success');

      return { txHash: hash, tokenId: tid };
    },
    []
  );

  const resetTx = useCallback(() => {
    setTxStatus('idle');
    setCurrentTxHash(null);
  }, []);

  const value: WalletContextValue = {
    address,
    isConnected: !!address,
    chainId: 56,
    txStatus,
    currentTxHash,
    tokenId,
    connect,
    disconnect,
    mint,
    resetTx,
  };

  return createElement(WalletContext.Provider, { value }, children);
}

export function useMockWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useMockWallet must be used inside MockWalletProvider');
  return ctx;
}
