import localFont from 'next/font/local';

// Kombin — heavy slab-style display. Used for dominant all-caps headlines.
export const kombin = localFont({
  src: '../../../app/fonts/Kombin.ttf',
  variable: '--font-kombin',
  display: 'swap',
});

// DynaPuff — variable-weight rounded puffy display. Used for callouts and sub-headlines.
export const dynaPuff = localFont({
  src: '../../../app/fonts/DynaPuff.ttf',
  variable: '--font-dyna-puff',
  display: 'swap',
  weight: '400 800',
});

// Space Grotesk — clean variable-weight modern sans. Used for all body and UI text.
export const spaceGrotesk = localFont({
  src: '../../../app/fonts/SpaceGrotesk.ttf',
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: '300 700',
});
