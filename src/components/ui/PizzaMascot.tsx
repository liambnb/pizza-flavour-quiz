import Image from 'next/image';

interface Props {
  accentColor?: string;
  className?: string;
  width?: number;
}

export default function PizzaMascot({ className, width = 220 }: Props) {
  const height = Math.round(width * 1.23);
  return (
    <Image
      src="/pizza-mascot.svg"
      alt="Pizza mascot"
      width={width}
      height={height}
      className={className}
      style={{ mixBlendMode: 'multiply' }}
      priority
    />
  );
}
