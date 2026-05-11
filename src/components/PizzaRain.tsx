'use client';

import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePizzaRain } from '@/lib/pizza-rain-context';

interface PizzaPiece {
  id: number;
  left: string;
  size: string;
  fallDur: string;
  spinDur: string;
  delay: string;
}

function generatePieces(): PizzaPiece[] {
  return Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left:    `${Math.floor(Math.random() * 96)}%`,
    size:    `${(1.5 + Math.random() * 1.5).toFixed(2)}rem`,
    fallDur: `${(8 + Math.random() * 6).toFixed(1)}s`,
    spinDur: `${(2 + Math.random() * 4).toFixed(1)}s`,
    delay:   `${(Math.random() * 6).toFixed(1)}s`,
  }));
}

export default function PizzaRain() {
  const { enabled } = usePizzaRain();
  const pieces = useMemo(() => generatePieces(), []);

  return (
    <AnimatePresence>
      {enabled && (
        <motion.div
          key="pizza-rain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 5 }}
          aria-hidden="true"
        >
          {pieces.map((p) => (
            // Outer wrapper handles the vertical fall
            <div
              key={p.id}
              className="pizza-wrapper"
              style={{
                left: p.left,
                '--fall-dur': p.fallDur,
                '--fall-delay': p.delay,
              } as React.CSSProperties}
            >
              {/* Inner span handles rotation independently */}
              <span
                className="pizza-piece"
                style={{
                  '--pizza-size': p.size,
                  '--spin-dur': p.spinDur,
                  '--fall-delay': p.delay,
                } as React.CSSProperties}
              >
                🍕
              </span>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
