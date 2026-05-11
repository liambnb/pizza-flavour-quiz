'use client';

import { useState, useRef, useEffect } from 'react';
import { useMockWallet } from '@/lib/use-mock-wallet';
import { shortenAddress } from '@/lib/mock-wallet';

export default function WalletPill() {
  const { address, disconnect } = useMockWallet();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleCopy = () => {
    if (address) navigator.clipboard.writeText(address);
    setOpen(false);
  };

  if (!address) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="btn-retro flex items-center gap-2 bg-ink text-bnb px-3 py-1.5 text-xs uppercase"
        style={{ fontFamily: 'var(--font-display-2)', borderRadius: 4 }}
      >
        <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
        <span className="font-mono">{shortenAddress(address)}</span>
        <span className="bg-bnb text-ink font-black text-[10px] px-1.5 py-0.5 rounded-sm">BSC</span>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-44 bg-cream border-3 border-ink overflow-hidden"
          style={{ border: '3px solid #1A1A1A', boxShadow: '4px 4px 0 #1A1A1A', borderRadius: 4 }}
        >
          <button
            onClick={handleCopy}
            className="w-full text-left px-4 py-3 text-sm text-ink hover:bg-bnb transition-colors border-b-2 border-ink"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Copy address
          </button>
          <button
            onClick={() => { disconnect(); setOpen(false); }}
            className="w-full text-left px-4 py-3 text-sm text-tomato hover:bg-bnb transition-colors font-bold"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
