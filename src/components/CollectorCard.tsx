'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import type { Flavour } from '@/lib/flavours';
import type { Rarity } from '@/lib/rarity';
import PizzaMascot from './ui/PizzaMascot';
import Starburst from './ui/Starburst';

interface Props {
  flavour: Flavour;
  rarity: Rarity;
  tokenId?: number | null;
  className?: string;
}

const CollectorCard = forwardRef<HTMLDivElement, Props>(
  ({ flavour, rarity, tokenId, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative select-none overflow-hidden flex flex-col',
          'w-[280px] h-[392px] md:w-[360px] md:h-[504px]',
          className
        )}
        style={{
          background: rarity === 'gold' || rarity === 'silver' ? '#F4ECD8' : '#F0B90B',
          border: `4px solid #1A1A1A`,
          boxShadow: '8px 8px 0 #1A1A1A',
          borderRadius: 4,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Gold shimmer overlay */}
        {rarity === 'gold' && (
          <div className="absolute inset-0 z-10 pointer-events-none holo-shimmer" style={{ borderRadius: 2 }} />
        )}
        {/* Silver shimmer overlay */}
        {rarity === 'silver' && (
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: 'linear-gradient(110deg, transparent 30%, rgba(200,200,200,0.45) 50%, transparent 70%)',
              backgroundSize: '200% 100%',
              animation: 'retro-silver 2.5s linear infinite',
              borderRadius: 2,
            }}
          />
        )}

        {/* ── NAME BANNER ── */}
        <div
          className="shrink-0 flex items-center justify-between px-3 py-2 border-b-[3px] border-ink"
          style={{ background: flavour.accentColor }}
        >
          <span
            className="text-ink uppercase leading-none text-sm md:text-base font-black truncate mr-2"
            style={{ fontFamily: 'var(--font-alfa-slab, serif)' }}
          >
            {flavour.name}
          </span>
          <RarityBadge rarity={rarity} />
        </div>

        {/* ── ILLUSTRATION AREA ── */}
        <div
          className="flex-1 flex items-center justify-center relative overflow-hidden"
          style={{
            background: `radial-gradient(ellipse at 50% 60%, ${flavour.accentColor}88 0%, ${flavour.accentColor}33 55%, transparent 100%)`,
          }}
        >
          <PizzaMascot
            accentColor={flavour.accentColor}
            width={rarity === 'gold' ? 150 : 130}
            className="relative z-10 drop-shadow-sm"
          />
        </div>

        {/* ── TAGLINE ── */}
        <div
          className="shrink-0 px-3 py-1.5 border-t-[3px] border-ink text-center"
          style={{ background: '#1A1A1A' }}
        >
          <p
            className="text-bnb uppercase tracking-widest leading-none"
            style={{ fontFamily: 'var(--font-bungee, sans-serif)', fontSize: '0.65rem' }}
          >
            {flavour.tagline}
          </p>
        </div>

        {/* ── DESCRIPTION BOX ── */}
        <div
          className="shrink-0 mx-2 my-1.5 px-2.5 py-2 border-[2px] border-ink"
          style={{ background: 'rgba(255,255,255,0.55)', borderRadius: 2 }}
        >
          <p
            className="text-ink leading-snug"
            style={{ fontFamily: 'var(--font-dm-sans, sans-serif)', fontSize: '0.65rem' }}
          >
            {flavour.description}
          </p>
        </div>

        {/* ── FOOTER ── */}
        <div className="shrink-0 px-3 pb-2 pt-0 flex items-center justify-between">
          <span
            className="text-ink/60 uppercase"
            style={{ fontFamily: 'var(--font-alfa-slab, serif)', fontSize: '0.45rem', letterSpacing: '0.15em' }}
          >
            Pizza Day · 2026 · BNB Chain
          </span>
          {tokenId && (
            <span
              className="text-bnb uppercase"
              style={{
                fontFamily: 'var(--font-alfa-slab, serif)',
                fontSize: '0.45rem',
                letterSpacing: '0.1em',
                background: '#1A1A1A',
                padding: '2px 5px',
                borderRadius: 2,
              }}
            >
              TOKEN #{tokenId} · BSC
            </span>
          )}
        </div>

        {/* Rarity starburst corner badge (Silver/Gold) */}
        {rarity !== 'normal' && (
          <div className="absolute top-8 right-1 z-20">
            <Starburst
              size={52}
              bg={rarity === 'gold' ? '#F0B90B' : '#C0C0C0'}
              textColor="#1A1A1A"
              rotate={15}
              variant="b"
            >
              {rarity === 'gold' ? '✦ HOLO ✦' : 'SILVER'}
            </Starburst>
          </div>
        )}
      </div>
    );
  }
);

CollectorCard.displayName = 'CollectorCard';
export default CollectorCard;

function RarityBadge({ rarity }: { rarity: Rarity }) {
  if (rarity === 'gold') {
    return (
      <span
        className="text-[9px] font-black px-2 py-0.5 uppercase tracking-wider shrink-0 border-2 border-ink"
        style={{ background: '#F0B90B', color: '#1A1A1A', borderRadius: 2 }}
      >
        GOLD
      </span>
    );
  }
  if (rarity === 'silver') {
    return (
      <span
        className="text-[9px] font-black px-2 py-0.5 uppercase tracking-wider shrink-0 border-2 border-ink"
        style={{ background: 'linear-gradient(135deg,#C0C0C0,#E8E8E8)', color: '#1A1A1A', borderRadius: 2 }}
      >
        SILVER
      </span>
    );
  }
  return (
    <span
      className="text-[9px] font-black px-2 py-0.5 uppercase tracking-wider shrink-0 border-2 border-ink"
      style={{ background: '#1A1A1A', color: '#F0B90B', borderRadius: 2 }}
    >
      NORMAL
    </span>
  );
}
