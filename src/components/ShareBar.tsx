'use client';

import { useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { buildCaption } from '@/lib/captions';
import type { Flavour } from '@/lib/flavours';
import type { Toast } from './TxToast';

interface Props {
  flavour: Flavour;
  cardRef: React.RefObject<HTMLDivElement | null>;
  onToast?: (t: Toast) => void;
}

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? 'https://pizza.bnbchain.org';

export default function ShareBar({ flavour, cardRef, onToast }: Props) {
  const caption = buildCaption(flavour.name, flavour.id, flavour.emoji, APP_URL);

  const generatePng = useCallback(async (): Promise<File | null> => {
    if (!cardRef.current) return null;
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      return new File([blob], `${flavour.id}-pizza-card.png`, { type: 'image/png' });
    } catch {
      return null;
    }
  }, [cardRef, flavour.id]);

  const downloadPng = useCallback(async () => {
    const file = await generatePng();
    if (!file) return;
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  }, [generatePng]);

  const handleShare = useCallback(async () => {
    const file = await generatePng();
    if (!file) return;

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], text: caption, url: APP_URL });
        return;
      } catch {
        // fall through to desktop path
      }
    }

    // Desktop: download + open Twitter intent
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);

    const tweetUrl =
      'https://twitter.com/intent/tweet?text=' +
      encodeURIComponent(caption) +
      '&url=' +
      encodeURIComponent(APP_URL);
    window.open(tweetUrl, '_blank', 'noopener');

    onToast?.({
      id: `share-${Date.now()}`,
      type: 'info',
      title: 'Card downloaded',
      subtitle: 'Attach it to your tweet!',
    });
  }, [generatePng, caption, onToast]);

  const handleCopyCaption = useCallback(() => {
    navigator.clipboard.writeText(caption);
    onToast?.({
      id: `copy-${Date.now()}`,
      type: 'success',
      title: 'Caption copied!',
    });
  }, [caption, onToast]);

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <button
        onClick={handleShare}
        className="flex items-center gap-2 bg-[#F0B90B] hover:bg-[#FFD93D] text-black font-bold px-4 py-2.5 rounded-lg transition-colors text-sm"
      >
        <span>𝕏</span>
        Share on X
      </button>
      <button
        onClick={downloadPng}
        className="flex items-center gap-2 bg-[#1a1f27] hover:bg-[#2B3139] text-white font-semibold px-4 py-2.5 rounded-lg border border-[#2B3139] transition-colors text-sm"
      >
        ⬇ Download card
      </button>
      <button
        onClick={handleCopyCaption}
        className="flex items-center gap-2 bg-[#1a1f27] hover:bg-[#2B3139] text-white font-semibold px-4 py-2.5 rounded-lg border border-[#2B3139] transition-colors text-sm"
      >
        📋 Copy caption
      </button>
    </div>
  );
}
