# PLANNING.md — BTCFixed MVP Roadmap

## Overview

**Goal**: Transform BTCFixed from a static frontend into a functional DeFi platform powered by
the **StarkZap** SDK on Starknet mainnet. The plan is an incremental feature build-out across
multiple sessions, each delivering a self-contained, shippable increment.

**Final Stack**:
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CDN
- **Blockchain SDK**: StarkZap v1.0 (Starknet abstraction layer)
- **Wallets**: Cartridge Controller, Argent X, Braavos
- **Swaps**: AVNU DEX aggregator REST API
- **Lending**: Vesu Protocol REST API + ERC-4626 vTokens
- **Deployment**: Cloudflare Pages
- **Network**: Starknet **mainnet** (default)

---

## Sessions Roadmap

> **Legend**: ✅ Complete | 🚧 In Progress | ⏳ Pending

| Session | Feature                   | Status         |
|---------|---------------------------|----------------|
| 1       | Auth + Real Dashboard     | ✅ Complete    |
| 1b      | Mainnet + Cartridge       | ✅ Complete    |
| 2       | STRK Staking (StarkZap)   | ✅ Complete    |
| 3       | Swaps (AVNU)              | ✅ Complete    |
| 4       | Lending (Vesu)            | ✅ Complete    |
| 5       | Activity History          | ✅ Complete    |
| 6       | KYC mock                  | ⏳ Pending     |
| 7       | UI Polish                 | ⏳ Pending     |
| 8       | Cloudflare Deploy         | ⏳ Pending     |
| 9       | Gasless (AVNU Paymaster)  | ⏳ Pending     |
| 10      | React Native              | ⏳ Pending     |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend (React 19 / Vite)                                 │
│  App.tsx → Auth → Dashboard → Staking/Bridge/Lending        │
└─────────────────────────────────────────────────────────────┘
                         ↓
         ┌───────────────────────────────────┐
         │  Services Layer                   │
         │  - StarkZap SDK (staking)         │
         │  - AVNU REST API (swaps)          │
         │  - Vesu REST API (lending)        │
         │  - starknet.js RPC (balances)     │
         └───────────────────────────────────┘
                         ↓
   ┌───────────────────────────────────────┐
   │     Starknet Mainnet                  │
   │  - Staking pool contracts (StarkZap)  │
   │  - AVNU routing contracts             │
   │  - Vesu Prime pool (ERC-4626)         │
   │  - ERC-20 tokens                      │
   └───────────────────────────────────────┘
```

---

## Session Details

### Session 1 + 1b — Auth & Real Dashboard ✅
- Wallet connect: Cartridge Controller (passkey/email/Discord), Argent X, Braavos
- Real ERC-20 balances via starknet.js `RpcProvider`
- Live prices via CoinGecko API (ETH, STRK, USDC) with 60 s polling
- Starknet **mainnet** (chainId `0x534e5f4d41494e`)
- Commits: `47f6a7c` (Session 1), `32ccda8` (1b)

### Session 2 — STRK Staking ✅
- `services/staking.ts`: StarkZap `Staking` class, AVNU/KARNOT/NETHERMIND validators
- `hooks/useStaking.ts`: commission, effectiveAPY, position (30 s polling)
- `components/Staking.tsx`: validator selector, stake/unstake/claim tabs
- Commit: `1072c8f`

### Session 3 — Swaps (AVNU) ✅
- `services/swap.ts`: AVNU REST API `GET /swap/v2/quotes` + `POST /swap/v2/build`
- `hooks/useSwap.ts`: debounced quoting (700 ms), status flow
- `components/Bridge.tsx`: multi-token selector, live quote, route + impact info
- Added WBTC and USDT to `config/tokens.ts`
- Commit: `cf69f31`

### Session 4 — Lending (Vesu) ✅
- `services/lending.ts`: Vesu Prime pool (ETH/USDC/USDT/STRK/WBTC), ERC-4626 vToken calls
- `hooks/useLending.ts`: live APYs (30 s polling), on-chain position via `balanceOf(vToken)`
- `components/Lending.tsx`: market overview, supply tab, positions tab
- Commit: `2343758`

### Session 5 — Activity History ✅
- `services/activityStore.ts`: localStorage-backed transaction log (max 50 entries)
- All tx hooks call `logActivity()` after each successful transaction
- `hooks/useActivity.ts`: reads from store, 5 s polling
- `components/ActivityHistory.tsx`: real data, relative timestamps, protocol badges, explorer links
- Activity types: `Stake | Unstake | ClaimRewards | Swap | Supply | Withdraw`

### Session 6 — KYC Mock ⏳
- `contexts/VerificationContext.tsx`: `verificationStatus`, `verificationLevel`
- Mock verification flow (no real provider yet)
- Feature gating for high-value actions (lending, large amounts)
- Prepared for future integration with Stripe Identity / Sumsub

### Session 7 — UI Polish ⏳
- Skeleton loaders for all async states
- Toast notifications for errors
- Optimise bundle: code splitting, lazy imports
- Review dark mode contrast
- Accessibility audit (ARIA labels, keyboard nav)

### Session 8 — Cloudflare Deploy ⏳
- Set `wrangler.toml` environment variables for production
- Bundle size target: < 500 KB gzipped (currently ~430 KB)
- Connect GitHub repo → Cloudflare Pages CI/CD
- End-to-end flow test on mainnet

### Session 9 — Gasless Transactions ⏳
- AVNU Paymaster integration for sponsored transactions
- Cloudflare Worker as paymaster proxy (rate limiting, address whitelist)
- Policy scopes for Cartridge session keys

### Session 10 — React Native ⏳
- Expo SDK with starknet.js
- Shared business logic from web (services/, hooks/, config/)
- Biometric auth via Cartridge mobile SDK

---

## Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| **Mainnet by default** | Real UX from day 1; avoids testnet confusion |
| **Cartridge as primary wallet** | Best UX (no extension needed), social login |
| **AVNU for swaps** | Best aggregator on Starknet, free API, no key needed |
| **Vesu for lending** | ERC-4626 standard, active Prime pool, free REST API |
| **StarkZap for staking** | Abstracts STRK delegation complexity, multiple validators |
| **localStorage for activity** | Zero infra, works offline, no API key required |

---

## Environment Variables

```env
VITE_STARKNET_NETWORK=mainnet          # or sepolia
VITE_STARKNET_RPC_URL=                 # optional — defaults to Nethermind free RPC
```

## Build Commands

```bash
npm run dev      # Dev server — http://localhost:3000
npm run build    # Production build → dist/
npm run lint     # TypeScript type check
```
