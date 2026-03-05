import { useEffect, useState } from 'react';

// Public CoinGecko price API – no key required
const PRICE_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cstarknet%2Cusd-coin&vs_currencies=usd&include_24hr_change=true';

export interface PriceData {
  usd: number;
  usd_24h_change?: number;
}

export type Prices = Record<string, PriceData>;

// Safe fallback prices (used when API is unavailable)
const FALLBACK: Prices = {
  ethereum: { usd: 3000, usd_24h_change: 0 },
  starknet: { usd: 0.5, usd_24h_change: 0 },
  'usd-coin': { usd: 1, usd_24h_change: 0 },
};

export function usePrices(pollMs = 60_000) {
  const [prices, setPrices] = useState<Prices>(FALLBACK);
  const [isStale, setIsStale] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetch_() {
      try {
        const res = await fetch(PRICE_URL);
        if (!res.ok) return;
        const data: Record<string, { usd: number; usd_24h_change?: number }> =
          await res.json();
        if (!cancelled) {
          setPrices({
            ethereum: { usd: data.ethereum?.usd ?? FALLBACK.ethereum.usd, usd_24h_change: data.ethereum?.usd_24h_change },
            starknet: { usd: data.starknet?.usd ?? FALLBACK.starknet.usd, usd_24h_change: data.starknet?.usd_24h_change },
            'usd-coin': { usd: data['usd-coin']?.usd ?? FALLBACK['usd-coin'].usd },
          });
          setIsStale(false);
        }
      } catch {
        // Keep previous prices on network error
      }
    }

    fetch_();
    const id = setInterval(fetch_, pollMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [pollMs]);

  return { prices, isStale };
}
