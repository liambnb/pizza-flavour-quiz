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
        className="flex items-center gap-2 bg-[#1a1f27] border border-[#2B3139] rounded-full px-3 py-2 text-sm text-white hover:border-[#F0B90B]/50 transition-colors"
      >
        <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
        <span className="font-mono text-xs">{shortenAddress(address)}</span>
        <span className="bg-[#F0B90B] text-black text-xs font-bold px-1.5 py-0.5 rounded-sm">
          BSC
        </span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-[#1a1f27] border border-[#2B3139] rounded-lg shadow-xl z-50 overflow-hidden">
          <button
            onClick={handleCopy}
            className="w-full text-left px-4 py-3 text-sm text-[#EAECEF] hover:bg-[#2B3139] transition-colors"
          >
            Copy address
          </button>
          <div className="border-t border-[#2B3139]" />
          <button
            onClick={() => { disconnect(); setOpen(false); }}
            className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-[#2B3139] transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
