'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface Toast {
  id: string;
  type: 'info' | 'success' | 'error';
  title: string;
  subtitle?: string;
}

interface Props {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export default function TxToast({ toasts, onDismiss }: Props) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-xs w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={cn(
        'pointer-events-auto bg-[#1a1f27] rounded-lg p-3 flex items-start gap-3 shadow-xl',
        toast.type === 'error'
          ? 'border border-red-500/60'
          : toast.type === 'success'
          ? 'border border-[#F0B90B]/60'
          : 'border border-[#2B3139]'
      )}
    >
      <span className="text-lg mt-0.5 shrink-0">
        {toast.type === 'error' ? '❌' : toast.type === 'success' ? '✅' : '⏳'}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold leading-tight">{toast.title}</p>
        {toast.subtitle && (
          <p className="text-[#848E9C] text-xs mt-0.5 leading-snug">{toast.subtitle}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-[#848E9C] hover:text-white transition-colors text-xs mt-0.5 shrink-0"
      >
        ✕
      </button>
    </motion.div>
  );
}
