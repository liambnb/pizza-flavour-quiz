import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  /** height in px — must be a multiple of 24 for clean squares */
  height?: number;
}

export default function CheckerBand({ className, height = 24 }: Props) {
  return (
    <div
      aria-hidden="true"
      className={cn('w-full shrink-0 checker-bg', className)}
      style={{ height }}
    />
  );
}
