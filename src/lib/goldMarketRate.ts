/**
 * Fetches the live 22K gold rate in INR per gram.
 *
 * Data sources (both completely free, no API key required):
 *  - gold-api.com   → gold spot price in USD per troy oz
 *  - frankfurter.dev  → ECB USD → INR exchange rate (daily)
 *
 * Formula:
 *   rate22k_inr_per_gram = (usd_per_troy_oz / 31.1035) × usd_to_inr × (22/24)
 */

const GOLD_API_URL = 'https://api.gold-api.com/price/XAU';
const FX_API_URL   = 'https://api.frankfurter.dev/v1/latest?from=USD&to=INR';

// 1 troy ounce = 31.1035 grams
const TROY_OZ_TO_GRAM = 31.1035;
// 22K purity factor
const KARAT_22_FACTOR = 22 / 24;

export interface LiveGoldRate {
  rate22k: number;       // INR per gram, 22K
  usdPerOz: number;      // Raw gold spot price (USD/troy oz)
  usdToInr: number;      // Exchange rate used
  fetchedAt: Date;
}

export async function fetchLive22KRateINR(): Promise<LiveGoldRate | null> {
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

    const rate22k = Math.round((usdPerOz / TROY_OZ_TO_GRAM) * usdToInr * KARAT_22_FACTOR);

    return { rate22k, usdPerOz, usdToInr, fetchedAt: new Date() };
  } catch (err) {
    console.warn('[GoldRate] Failed to fetch live rate:', err);
    return null;
  }
}
