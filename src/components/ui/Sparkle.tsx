import { cn } from '@/lib/utils';

interface Props {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function Sparkle({ size = 20, color = '#1A1A1A', className, style }: Props) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      className={cn('shrink-0', className)}
      style={style}
    >
      {/* Four-point star — same shape as ✦ in the reference */}
      <path d="M12 0 C12 0 13.2 9.6 14.4 10.8 C15.6 12 24 12 24 12 C24 12 15.6 12 14.4 13.2 C13.2 14.4 12 24 12 24 C12 24 10.8 14.4 9.6 13.2 C8.4 12 0 12 0 12 C0 12 8.4 12 9.6 10.8 C10.8 9.6 12 0 12 0 Z" />
    </svg>
  );
}

/** Scatter a fixed set of sparkles with absolute positioning */
export function SparkleCluster({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}) {
  const positions = [
    { top: '8%',  left: '4%',  size: 14 },
    { top: '6%',  left: '88%', size: 20 },
    { top: '18%', left: '94%', size: 10 },
    { top: '82%', left: '3%',  size: 18 },
    { top: '78%', left: '92%', size: 12 },
    { top: '50%', left: '97%', size: 16 },
    { top: '35%', left: '1%',  size: 11 },
    { top: '62%', left: '6%',  size: 9  },
  ].slice(0, count);

  return (
    <div aria-hidden="true" className={cn('absolute inset-0 pointer-events-none', className)}>
      {positions.map((p, i) => (
        <Sparkle
          key={i}
          size={p.size}
          className="absolute"
          style={{ top: p.top, left: p.left } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
