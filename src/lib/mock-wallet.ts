export const MOCK_WALLETS = [
  { id: 'metamask',      name: 'MetaMask',            icon: '🦊' },
  { id: 'trust',         name: 'Trust Wallet',        icon: '🛡️' },
  { id: 'binance',       name: 'Binance Web3 Wallet', icon: '🟡', popular: true },
  { id: 'walletconnect', name: 'WalletConnect',       icon: '🔗' },
];

export const BNB_CHAIN = {
  id: 56,
  name: 'BNB Smart Chain',
  symbol: 'BNB',
  explorer: 'https://bscscan.com',
};

export function generateFakeAddress(): string {
  const hex = '0123456789abcdef';
  let out = '0x';
  for (let i = 0; i < 40; i++) out += hex[Math.floor(Math.random() * 16)];
  return out;
}

export function generateFakeTxHash(): string {
  const hex = '0123456789abcdef';
  let out = '0x';
  for (let i = 0; i < 64; i++) out += hex[Math.floor(Math.random() * 16)];
  return out;
}

export function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function generateFakeTokenId(): number {
  return Math.floor(Math.random() * 9000) + 1000;
}

export function generateFakeBlockNumber(): string {
  const base = 47382000 + Math.floor(Math.random() * 1000);
  return base.toLocaleString();
}

export const SIM_TIMINGS = {
  connectModalLatency: 600,
  signaturePrompt:    1400,
  broadcasting:        900,
  confirming:         2200,
};
