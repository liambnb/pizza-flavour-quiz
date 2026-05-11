'use client';

import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePizzaRain } from '@/lib/pizza-rain-context';

interface PizzaPiece {
  id: number;
  left: string;
  size: string;
  dur: string;
  delay: string;
  rotStart: string;
  rotEnd: string;
}

function generatePieces(): PizzaPiece[] {
  return Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left:     `${Math.floor(Math.random() * 96)}%`,
    size:     `${(1.5 + Math.random() * 1.5).toFixed(2)}rem`,
    dur:      `${(8 + Math.random() * 6).toFixed(1)}s`,
    delay:    `${(Math.random() * 6).toFixed(1)}s`,
    rotStart: `${Math.floor(Math.random() * 360)}deg`,
    rotEnd:   `${Math.floor(Math.random() * 720 + 360)}deg`,
  }));
}

export default function PizzaRain() {
  const { enabled } = usePizzaRain();
  // stable pieces so they don't regenerate on every render
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
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 5 }}
          aria-hidden="true"
        >
          {pieces.map((p) => (
            <span
              key={p.id}
              className="pizza-piece"
              style={{
                left: p.left,
                '--pizza-size': p.size,
                '--fall-dur': p.dur,
                '--fall-delay': p.delay,
                '--rot-start': p.rotStart,
                '--rot-end': p.rotEnd,
              } as React.CSSProperties}
            >
              🍕
            </span>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
