import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { fetchLiveRatesINR, LiveGoldRate } from '../lib/goldMarketRate';

export interface HeroSlide {
  id: number;
  image: string;
  badge: string;
  heading: string;
  subheading: string;
  ctaText: string;
  ctaLink: string;
}

export interface GoldRateSlideConfig {
  show22k: boolean;
  show24k: boolean;
  badge22k: string;
  badge24k: string;
  sub22k: string;
  sub24k: string;
}

export const DEFAULT_GOLD_SLIDE_CONFIG: GoldRateSlideConfig = {
  show22k: true,
  show24k: true,
  badge22k: 'Live Market Rate',
  badge24k: 'Live Market Rate',
  sub22k: 'Today\'s 22K gold rate, updated live from global markets.',
  sub24k: 'Today\'s 24K gold rate, updated live from global markets.',
};

export interface HomeConfig {
  heroSlides?: HeroSlide[];
  heroImage?: string;
  tickerText?: string;
  goldRateSlides?: GoldRateSlideConfig;
}

const defaultSlides: HeroSlide[] = [
  {
    id: 1,
    image: "",
    badge: "Artisanal Manufacturing",
    heading: "Heritage Craft, Modern Precision.",
    subheading: "Bespoke gold jewelry direct from the Karigar.",
    ctaText: "Browse Catalog",
    ctaLink: "/catalog"
  }
];

export interface GoldRateState {
  /** Effective 22K rate in INR/gram. Admin override if set, else live market rate. */
  rate22k: number;
  /** Effective 24K rate in INR/gram. Admin override if set, else live market rate. */
  rate24k: number;
  /** The live market-fetched 22K rate (always from API, regardless of admin override). */
  marketRate22k: number;
  /** The live market-fetched 24K rate. */
  marketRate24k: number;
  /** The rate manually set by the admin in Supabase (0 = not overridden). */
  adminRate22k: number;
  adminRate24k: number;
  /** True when admin override is active (adminRate22k > 0). */
  isAdminOverride: boolean;
  logoUrl: string;
  homeConfig: HomeConfig;
  /** Details of the last successful market fetch */
  liveRateInfo: LiveGoldRate | null;
}

// Refresh market rate every 30 minutes
const MARKET_REFRESH_MS = 30 * 60 * 1000;

export function useGoldRate() {
  const [rate, setRate] = useState<GoldRateState>({
    rate22k: 0,
    rate24k: 0,
    marketRate22k: 0,
    marketRate24k: 0,
    adminRate22k: 0,
    adminRate24k: 0,
    isAdminOverride: false,
    logoUrl: "",
    homeConfig: { heroSlides: defaultSlides },
    liveRateInfo: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let marketRefreshTimer: ReturnType<typeof setInterval>;

    async function init() {
      // Fetch both sources in parallel
      const [supabaseResult, liveRate] = await Promise.all([
        supabase.from('settings').select('*').eq('id', 'goldRate').single(),
        fetchLiveRatesINR(),
      ]);

      const { data, error } = supabaseResult;

      if (error && !data) {
        console.warn("Failed to fetch settings from Supabase:", error);
      }

      const config = data?.homeConfig || {};
      const adminRate = data?.rate22k || 0;
      const adminRate24k = data?.rate24k || 0;
      const marketRate = liveRate?.rate22k || 0;
      const marketRate24 = liveRate?.rate24k || 0;

      setRate({
        rate22k: adminRate > 0 ? adminRate : marketRate,
        rate24k: adminRate24k > 0 ? adminRate24k : marketRate24,
        marketRate22k: marketRate,
        marketRate24k: marketRate24,
        adminRate22k: adminRate,
        adminRate24k: adminRate24k,
        isAdminOverride: adminRate > 0 || adminRate24k > 0,
        logoUrl: data?.logoUrl || "",
        homeConfig: { ...config, heroSlides: config.heroSlides || defaultSlides },
        liveRateInfo: liveRate,
      });

      setLoading(false);

      // Schedule periodic market rate refresh
      marketRefreshTimer = setInterval(async () => {
        const refreshed = await fetchLiveRatesINR();
        if (!refreshed) return;
        setRate(prev => ({
          ...prev,
          marketRate22k: refreshed.rate22k,
          marketRate24k: refreshed.rate24k,
          // Only update effective rate if admin hasn't overridden
          rate22k: prev.adminRate22k > 0 ? prev.adminRate22k : refreshed.rate22k,
          rate24k: prev.adminRate24k > 0 ? prev.adminRate24k : refreshed.rate24k,
          liveRateInfo: refreshed,
        }));
      }, MARKET_REFRESH_MS);
    }

    init();

    // Real-time listener for admin changes (Supabase)
    const channelId = `schema-db-changes-${Math.random()}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'settings' },
        (payload) => {
          const newData = payload.new as any;
          if (newData && newData.id === 'goldRate') {
            const config = newData.homeConfig || {};
            const adminRate = newData.rate22k || 0;
            const adminRate24k = newData.rate24k || 0;
            setRate(prev => ({
              ...prev,
              adminRate22k: adminRate,
              adminRate24k: adminRate24k,
              isAdminOverride: adminRate > 0 || adminRate24k > 0,
              rate22k: adminRate > 0 ? adminRate : prev.marketRate22k,
              rate24k: adminRate24k > 0 ? adminRate24k : prev.marketRate24k,
              logoUrl: newData.logoUrl || "",
              homeConfig: { ...config, heroSlides: config.heroSlides || defaultSlides },
            }));
          }
        }
      )
      .subscribe();

    return () => {
      clearInterval(marketRefreshTimer);
      supabase.removeChannel(channel);
    };
  }, []);

  return { rate, loading };
}
