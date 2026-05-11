interface Props {
  /** accent tint — used for the cheese surface */
  accentColor?: string;
  className?: string;
  width?: number;
}

export default function PizzaMascot({
  accentColor = '#F4D03F',
  className,
  width = 220,
}: Props) {
  const h = Math.round(width * (270 / 220));
  return (
    <svg
      viewBox="0 0 220 270"
      width={width}
      height={h}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Pizza mascot"
    >
      {/* ── SHADOW (hard offset) ── */}
      <polygon
        points="113,18 198,172 28,172"
        fill="#1A1A1A"
        opacity="0.18"
        transform="translate(6,8)"
      />

      {/* ── CRUST (brown arc at the base) ── */}
      <path
        d="M 28 165 Q 113 210 198 165 L 198 178 Q 113 225 28 178 Z"
        fill="#C4864A"
        stroke="#1A1A1A"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* ── CHEESE SURFACE (main triangle) ── */}
      <polygon
        points="113,12 198,165 28,165"
        fill={accentColor}
        stroke="#1A1A1A"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* ── SAUCE SPOTS ── */}
      <circle cx="100" cy="88"  r="10" fill="#D6453D" stroke="#1A1A1A" strokeWidth="2.5" />
      <circle cx="130" cy="118" r="8"  fill="#D6453D" stroke="#1A1A1A" strokeWidth="2.5" />
      <circle cx="84"  cy="132" r="9"  fill="#D6453D" stroke="#1A1A1A" strokeWidth="2.5" />
      <circle cx="114" cy="64"  r="6"  fill="#D6453D" stroke="#1A1A1A" strokeWidth="2"   />

      {/* ── LEFT EYE ── */}
      <circle cx="84"  cy="108" r="16" fill="white"   stroke="#1A1A1A" strokeWidth="3" />
      <circle cx="87"  cy="110" r="9"  fill="#1A1A1A" />
      <circle cx="84"  cy="105" r="3.5" fill="white" />

      {/* ── RIGHT EYE ── */}
      <circle cx="136" cy="108" r="16" fill="white"   stroke="#1A1A1A" strokeWidth="3" />
      <circle cx="139" cy="110" r="9"  fill="#1A1A1A" />
      <circle cx="136" cy="105" r="3.5" fill="white" />

      {/* ── SMILE ── */}
      <path
        d="M 92 134 Q 110 150 128 134"
        stroke="#1A1A1A"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* ── LEFT ARM (side, casual) ── */}
      <path
        d="M 44 132 C 28 146 16 156 8 166"
        stroke="#1A1A1A"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Left glove */}
      <circle cx="6"  cy="174" r="14" fill="white" stroke="#1A1A1A" strokeWidth="3" />
      {/* Knuckle lines */}
      <path d="M -2 167 Q 2 160 8 163"  stroke="#1A1A1A" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M  8 161 Q 12 154 16 158" stroke="#1A1A1A" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* ── RIGHT ARM (raised, holding coin) ── */}
      <path
        d="M 176 122 C 190 104 198 86 202 68"
        stroke="#1A1A1A"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Right glove */}
      <circle cx="204" cy="58" r="14" fill="white" stroke="#1A1A1A" strokeWidth="3" />
      {/* Coin (BTC ₿) */}
      <circle cx="204" cy="32"  r="21" fill="#F0B90B" stroke="#1A1A1A" strokeWidth="3.5" />
      <circle cx="204" cy="32"  r="15" fill="#F0B90B" stroke="#1A1A1A" strokeWidth="1.5" />
      <text
        x="204" y="39"
        textAnchor="middle"
        fontSize="17"
        fontWeight="bold"
        fill="#1A1A1A"
        fontFamily="serif"
      >
        ₿
      </text>

      {/* ── LEFT LEG ── */}
      <line x1="90"  y1="194" x2="80"  y2="238" stroke="#1A1A1A" strokeWidth="7" strokeLinecap="round" />
      {/* Left shoe */}
      <ellipse cx="72"  cy="246" rx="20" ry="11" fill="white"   stroke="#1A1A1A" strokeWidth="3" />
      <ellipse cx="66"  cy="242" rx="10" ry="5"  fill="#1A1A1A" opacity="0.15" />

      {/* ── RIGHT LEG ── */}
      <line x1="130" y1="194" x2="140" y2="238" stroke="#1A1A1A" strokeWidth="7" strokeLinecap="round" />
      {/* Right shoe */}
      <ellipse cx="148" cy="246" rx="20" ry="11" fill="white"   stroke="#1A1A1A" strokeWidth="3" />
      <ellipse cx="142" cy="242" rx="10" ry="5"  fill="#1A1A1A" opacity="0.15" />
    </svg>
  );
}
