'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import type { Flavour } from '@/lib/flavours';
import type { Rarity } from '@/lib/rarity';

interface Props {
  flavour: Flavour;
  rarity: Rarity;
  tokenId?: number | null;
  className?: string;
}

const RARITY_LABELS: Record<Rarity, string> = {
  normal: 'NORMAL',
  silver: 'SILVER',
  gold: 'GOLD',
};

const CollectorCard = forwardRef<HTMLDivElement, Props>(
  ({ flavour, rarity, tokenId, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative select-none overflow-hidden',
          'w-[280px] h-[392px] md:w-[360px] md:h-[504px]',
          className
        )}
        style={{ borderRadius: '12px', fontFamily: 'system-ui, sans-serif' }}
      >
        {/* Border / rarity frame */}
        <div
          className={cn('absolute inset-0 rounded-xl', rarity === 'gold' && 'card-gold-border')}
          style={
            rarity === 'silver'
              ? {
                  background:
                    'linear-gradient(135deg, #C0C0C0, #E8E8E8, #A0A0A0, #E8E8E8, #C0C0C0)',
                  padding: 2,
                  borderRadius: 12,
                }
              : rarity === 'gold'
              ? {
                  background:
                    'linear-gradient(135deg, #F0B90B, #FFD93D, #F0B90B, #FFD93D, #F0B90B)',
                  padding: 3,
                  borderRadius: 12,
                }
              : {
                  background: '#2B3139',
                  padding: 1,
                  borderRadius: 12,
                }
          }
        >
          {/* Card inner */}
          <div
            className="relative h-full rounded-[10px] overflow-hidden flex flex-col"
            style={{ background: '#0B0E11' }}
          >
            {/* Gold holographic shimmer overlay */}
            {rarity === 'gold' && (
              <div className="absolute inset-0 z-10 pointer-events-none holo-shimmer rounded-[10px]" />
            )}

            {/* Header */}
            <div
              className="flex items-center justify-between px-3 py-2 shrink-0"
              style={{ background: 'rgba(0,0,0,0.4)' }}
            >
              <span className="text-white font-black text-sm uppercase tracking-wider truncate mr-2">
                {flavour.name}
              </span>
              <RarityPill rarity={rarity} />
            </div>

            {/* Illustration area */}
            <div
              className="flex-1 flex items-center justify-center relative overflow-hidden"
              style={{
                background: `radial-gradient(circle at 50% 40%, ${flavour.accentColor}55 0%, ${flavour.accentColor}22 50%, #0B0E11 100%)`,
              }}
            >
              <span
                className="text-8xl md:text-9xl leading-none z-10 relative"
                style={{ filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.6))' }}
              >
                {flavour.emoji}
              </span>
              {/* Accent glow */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: `radial-gradient(circle at 50% 60%, ${flavour.accentColor} 0%, transparent 70%)`,
                }}
              />
            </div>

            {/* Tagline */}
            <div
              className="px-3 pt-2 pb-1 shrink-0"
              style={{ background: 'rgba(0,0,0,0.3)' }}
            >
              <p
                className="text-xs font-black uppercase tracking-widest text-center"
                style={{ color: flavour.accentColor }}
              >
                {flavour.tagline}
              </p>
            </div>

            {/* Description box */}
            <div
              className="mx-2 mb-2 px-3 py-2 rounded-lg text-[10px] md:text-[11px] leading-snug text-[#EAECEF] shrink-0"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {flavour.description}
            </div>

            {/* Footer */}
            <div
              className="px-3 pb-2 flex items-center justify-between shrink-0"
            >
              <span className="text-[9px] text-[#848E9C] font-bold tracking-widest uppercase">
                BITCOIN PIZZA DAY 2026 · @BNBCHAIN
              </span>
              {tokenId && (
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: '#F0B90B22', color: '#F0B90B', border: '1px solid #F0B90B44' }}
                >
                  TOKEN #{tokenId} · BSC
                </span>
              )}
            </div>

            {/* Gold HOLO badge */}
            {rarity === 'gold' && (
              <div className="absolute top-8 right-2 z-20">
                <span className="text-[9px] font-black text-[#F0B90B] bg-black/60 px-1.5 py-0.5 rounded border border-[#F0B90B]/40">
                  ✨ HOLO ✨
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

CollectorCard.displayName = 'CollectorCard';
export default CollectorCard;

function RarityPill({ rarity }: { rarity: Rarity }) {
  if (rarity === 'gold') {
    return (
      <span
        className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0"
        style={{
          background: 'linear-gradient(135deg, #F0B90B, #FFD93D)',
          color: '#000',
        }}
      >
        {RARITY_LABELS[rarity]}
      </span>
    );
  }
  if (rarity === 'silver') {
    return (
      <span
        className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0"
        style={{
          background: 'linear-gradient(135deg, #C0C0C0, #E8E8E8)',
          color: '#111',
        }}
      >
        {RARITY_LABELS[rarity]}
      </span>
    );
  }
  return (
    <span className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider bg-[#2B3139] text-[#848E9C] shrink-0">
      {RARITY_LABELS[rarity]}
    </span>
  );
}
