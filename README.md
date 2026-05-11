# BNB Pizza Day 2026 — Flavour Quiz

A marketing demo for Bitcoin Pizza Day 2026. Users answer 5 questions about their crypto behaviour, get mapped to one of 10+ pizza flavours, and receive a Pokémon/MTG-style collector card with Normal / Silver / Gold rarity. The full wallet-connect and mint flow is simulated in pure TypeScript — no web3 libraries — so the team can review the end-to-end UX.

## Local dev

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Create `.env.local`:

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

This URL appears in the share caption and Twitter intent link.

### Testing failure states

Add `?fail=connect` to the URL to force a wallet-connection rejection on the next attempt.  
Add `?fail=mint` to force a transaction rejection during the mint flow.

## Deploy to Vercel (team review)

1. Push this repo to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Add environment variable `NEXT_PUBLIC_APP_URL` set to the Vercel preview URL (e.g. `https://pizza-flavour-quiz-abc123.vercel.app`).
4. Deploy and share the preview URL with the team.

## What's next

- **Real card artwork** — replace the emoji placeholder with illustrated card art per flavour.
- **On-chain mint** — swap `lib/use-mock-wallet.ts` for a real wagmi + RainbowKit integration and deploy the NFT contract to BNB Smart Chain.
- **Analytics** — track quiz completions, flavour distribution, and share events.
- **A/B test rarity drop rates** — experiment with the 70/25/5 split to optimise share virality.
- **More flavours** — extend the scoring matrix with new community-suggested flavours.
