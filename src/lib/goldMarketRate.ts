/**
 * Fetches the live gold rate approximating the **Indian retail market price**.
 *
 * Data sources (both completely free, no API key required):
 *  - gold-api.com   → international gold spot price in USD per troy oz
 *  - frankfurter.dev  → ECB USD → INR exchange rate (daily)
 *
 * Why it doesn't match Indian market (and how we fix it):
 *  The raw international spot price converted at forex is ~15–20% cheaper than
 *  what Indian consumers actually pay. This is because the Indian retail gold price
 *  includes mandatory levies that drive up the cost:
 *
 *    ┌─────────────────────────────────┬───────────┐
 *    │ Component                       │ Rate      │
 *    ├─────────────────────────────────┼───────────┤
 *    │ Import Duty                     │ 6.0%      │
 *    │ Agriculture Infrastructure Cess │ 5.0%      │
 *    │ GST                             │ 3.0%      │
 *    │ Refining / handling margin      │ ~1.5%     │
 *    ├─────────────────────────────────┼───────────┤
 *    │ Total Indian premium            │ ~15.5%    │
 *    └─────────────────────────────────┴───────────┘
 *
 *  Source: Union Budget 2024 (import duty reduced from 15% → 6% + 5% AIDC = 11% total
 *          import levy), plus 3% GST on gold = ~15–16% effective premium.
 *
 * Formula:
 *   rate24k_inr_per_gram = (usd_per_troy_oz / 31.1035) × usd_to_inr × INDIAN_PREMIUM_FACTOR
 *   rate22k_inr_per_gram = rate24k × (22/24)
 *
 * Note: For production use requiring bank/NBFC-grade accuracy, subscribe to the
 *       official IBJA API at https://indiagoldratesapi.com
 */

const GOLD_API_URL = 'https://api.gold-api.com/price/XAU';
const FX_API_URL   = 'https://api.frankfurter.dev/v1/latest?from=USD&to=INR';

// 1 troy ounce = 31.1035 grams
const TROY_OZ_TO_GRAM = 31.1035;

// 22K purity factor
const KARAT_22_FACTOR = 22 / 24;

/**
 * Indian gold price premium over international spot (converted to INR).
 * Accounts for: Import duty (6%) + AIDC (5%) + GST (3%) + refining margin (~1.5%)
 * Total: ~15.5% — updated per Union Budget 2024 import duty revision.
 */
const INDIAN_MARKET_PREMIUM = 1.155;

export interface LiveGoldRate {
  rate22k: number;       // INR per gram, 22K — Indian market approximation
  rate24k: number;       // INR per gram, 24K — Indian market approximation
  usdPerOz: number;      // Raw gold spot price (USD/troy oz)
  usdToInr: number;      // Exchange rate used
  fetchedAt: Date;
}

export async function fetchLiveRatesINR(): Promise<LiveGoldRate | null> {
  try {
    const [goldRes, fxRes] = await Promise.all([
      fetch(GOLD_API_URL, { cache: 'no-store' }).catch(e => { console.error('Gold API fetch error:', e); return null; }),
      fetch(FX_API_URL,   { cache: 'no-store' }).catch(e => { console.error('FX API fetch error:', e); return null; }),
    ]);

    if (!goldRes || !fxRes) {
      console.warn('[GoldRate] One or both API requests failed at network level.');
      return null;
    }

    if (!goldRes.ok || !fxRes.ok) {
      console.warn('[GoldRate] API request returned error status', { goldStatus: goldRes.status, fxStatus: fxRes.status });
      return null;
    }

    // Parse JSON
    const goldData = await goldRes.json();
    const fxData = await fxRes.json();

    const usdPerOz = goldData?.price;
    const usdToInr = fxData?.rates?.INR;

    if (!usdPerOz || !usdToInr) {
      console.warn('[GoldRate] Unexpected API response shape', { goldData, fxData });
      return null;
    }

    // Base: international spot → INR per gram
    const baseInrPerGram = (usdPerOz / TROY_OZ_TO_GRAM) * usdToInr;

    // Apply Indian import duty + GST + margin premium
    const rate24k = Math.round(baseInrPerGram * INDIAN_MARKET_PREMIUM);
    const rate22k = Math.round(rate24k * KARAT_22_FACTOR);

    return { rate22k, rate24k, usdPerOz, usdToInr, fetchedAt: new Date() };
  } catch (err) {
    console.warn('[GoldRate] Failed to fetch live rate:', err);
    return null;
  }
}
