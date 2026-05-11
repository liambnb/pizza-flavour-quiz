'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  createElement,
} from 'react';

interface PizzaRainContextValue {
  enabled: boolean;
  toggle: () => void;
  reducedMotion: boolean;
}

const PizzaRainContext = createContext<PizzaRainContextValue | null>(null);

const STORAGE_KEY = 'pizza-rain-enabled';

export function PizzaRainProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) { setEnabled(false); return; }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) setEnabled(stored === 'true');
    } catch {}
  }, [reducedMotion]);

  const toggle = useCallback(() => {
    if (reducedMotion) return;
    setEnabled((v) => {
      const next = !v;
      try { localStorage.setItem(STORAGE_KEY, String(next)); } catch {}
      return next;
    });
  }, [reducedMotion]);

  return createElement(PizzaRainContext.Provider, { value: { enabled, toggle, reducedMotion } }, children);
}

export function usePizzaRain() {
  const ctx = useContext(PizzaRainContext);
  if (!ctx) throw new Error('usePizzaRain must be inside PizzaRainProvider');
  return ctx;
}
