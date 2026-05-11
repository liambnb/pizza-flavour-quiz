import { cn } from '@/lib/utils';

// 12-point starburst polygon (6 outer r=50, 6 inner r=38, centre 50,50, viewBox 100x100)
const BURST_POINTS =
  '50,0 69,17 93,25 88,50 93,75 69,83 50,100 31,83 7,75 12,50 7,25 31,17';

// Slightly irregular variant for variety
const BURST_POINTS_B =
  '50,2 72,18 95,22 87,48 96,72 70,85 50,98 30,85 4,72 13,48 5,22 28,18';

interface Props {
  children: React.ReactNode;
  variant?: 'a' | 'b';
  bg?: string;
  textColor?: string;
  size?: number;
  className?: string;
  rotate?: number;
}

export default function Starburst({
  children,
  variant = 'a',
  bg = '#1A1A1A',
  textColor = '#F0B90B',
  size = 80,
  className,
  rotate = 0,
}: Props) {
  const pts = variant === 'b' ? BURST_POINTS_B : BURST_POINTS;
  return (
    <div
      className={cn('relative inline-flex items-center justify-center shrink-0', className)}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        style={{ transform: `rotate(${rotate}deg)` }}
        aria-hidden="true"
      >
        <polygon points={pts} fill={bg} stroke={bg} strokeWidth="1" />
      </svg>
      <span
        className="relative z-10 font-display-2 text-center leading-tight px-1"
        style={{
          color: textColor,
          fontSize: size * 0.18,
          fontFamily: 'var(--font-display-2)',
          maxWidth: size * 0.72,
        }}
      >
        {children}
      </span>
    </div>
  );
}
