<div align="center">
<img width="1200" height="475" alt="BTCFixed" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# BTCFixed — Bitcoin DeFi on Starknet

A mobile-first DeFi platform for Bitcoin holders, built on Starknet mainnet.

## Features

- **Wallet Connect** — Cartridge Controller (passkey / email / Discord), Argent X, Braavos
- **Dashboard** — Real ETH, STRK, USDC balances with live prices via CoinGecko
- **Staking** — STRK delegation staking via StarkZap (AVNU, KARNOT, NETHERMIND validators)
- **Swaps** — Token swaps via AVNU DEX aggregator (ETH / STRK / USDC / USDT / WBTC)
- **Lending** — Supply & withdraw via Vesu Prime pool (ERC-4626 vTokens)
- **Activity History** — Persistent transaction log with explorer links

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + TypeScript + Vite 6 |
| Styling | Tailwind CSS (CDN) |
| Blockchain SDK | [StarkZap](https://starkzap.io) v1.0.0 |
| Starknet | starknet.js + @cartridge/controller |
| Swaps | AVNU REST API |
| Lending | Vesu REST API + ERC-4626 vTokens |
| Deployment | Cloudflare Pages |

## Network

Starknet **mainnet** by default, via Nethermind free RPC (`free-rpc.nethermind.io/mainnet-juno`).

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # → dist/  (Cloudflare Pages output)
```

## Environment Variables

```env
VITE_STARKNET_NETWORK=mainnet          # or sepolia
VITE_STARKNET_RPC_URL=                 # optional — defaults to Nethermind free RPC
```

## Project Structure

```
App.tsx                  # Root — AuthProvider + AppShell
components/
  AuthScreen.tsx         # Wallet connect UI
  Dashboard.tsx          # Balances + prices
  Staking.tsx            # STRK staking (StarkZap)
  Bridge.tsx             # Token swaps (AVNU)
  Lending.tsx            # Supply/withdraw (Vesu)
  ActivityHistory.tsx    # Transaction log
contexts/
  AuthContext.tsx        # Global wallet state
hooks/
  useBalance.ts          # ERC-20 balance polling
  usePrices.ts           # CoinGecko prices
  useStaking.ts          # Staking state + actions
  useSwap.ts             # Swap state + actions
  useLending.ts          # Lending state + actions
  useActivity.ts         # Activity log
services/
  staking.ts             # StarkZap staking service
  swap.ts                # AVNU swap service
  lending.ts             # Vesu lending service
  activityStore.ts       # localStorage activity log
config/
  networks.ts            # RPC + explorer URLs
  tokens.ts              # Token addresses + decimals
  wallets.ts             # Wallet detection + tx execution
```
