import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { fetchLive22KRateINR, LiveGoldRate } from '../lib/goldMarketRate';

export interface HeroSlide {
  id: number;
  image: string;
  badge: string;
  heading: string;
  subheading: string;
  ctaText: string;
  ctaLink: string;
}

export interface HomeConfig {
  heroSlides?: HeroSlide[];
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
  /** The live market-fetched 22K rate (always from API, regardless of admin override). */
  marketRate22k: number;
  /** The rate manually set by the admin in Supabase (0 = not overridden). */
  adminRate22k: number;
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
    marketRate22k: 0,
    adminRate22k: 0,
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
        fetchLive22KRateINR(),
      ]);

      const { data, error } = supabaseResult;

      if (error && !data) {
        console.warn("Failed to fetch settings from Supabase:", error);
      }

      const config = data?.homeConfig || {};
      const adminRate = data?.rate22k || 0;
      const marketRate = liveRate?.rate22k || 0;

      setRate({
        rate22k: adminRate > 0 ? adminRate : marketRate,
        marketRate22k: marketRate,
        adminRate22k: adminRate,
        isAdminOverride: adminRate > 0,
        logoUrl: data?.logoUrl || "",
        homeConfig: { ...config, heroSlides: config.heroSlides || defaultSlides },
        liveRateInfo: liveRate,
      });

      setLoading(false);

      // Schedule periodic market rate refresh
      marketRefreshTimer = setInterval(async () => {
        const refreshed = await fetchLive22KRateINR();
        if (!refreshed) return;
        setRate(prev => ({
          ...prev,
          marketRate22k: refreshed.rate22k,
          // Only update effective rate if admin hasn't overridden
          rate22k: prev.adminRate22k > 0 ? prev.adminRate22k : refreshed.rate22k,
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
            setRate(prev => ({
              ...prev,
              adminRate22k: adminRate,
              isAdminOverride: adminRate > 0,
              rate22k: adminRate > 0 ? adminRate : prev.marketRate22k,
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
