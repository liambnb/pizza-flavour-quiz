'use client';

import { usePizzaRain } from '@/lib/pizza-rain-context';
import { cn } from '@/lib/utils';

export default function PizzaRainToggle() {
  const { enabled, toggle, reducedMotion } = usePizzaRain();

  return (
    <button
      onClick={toggle}
      disabled={reducedMotion}
      title={reducedMotion ? 'Disabled — prefers-reduced-motion is on' : undefined}
      className={cn(
        'fixed bottom-10 left-4 z-40',
        'font-display-2 text-[11px] uppercase tracking-wider px-3 py-2 rounded',
        'btn-retro select-none',
        enabled
          ? 'bg-ink text-bnb'
          : 'bg-bnb text-ink',
        reducedMotion && 'opacity-40 cursor-not-allowed'
      )}
      style={{ fontFamily: 'var(--font-display-2)' }}
    >
      {reducedMotion ? 'DISABLED' : enabled ? 'STOP THE RAIN 🍕' : 'MAKE IT RAIN 🍕'}
    </button>
  );
}
