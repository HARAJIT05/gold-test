import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface HeroSlide {
  id: number;
  image: string;
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
    heading: "Heritage Craft, Modern Precision.",
    subheading: "Bespoke gold jewelry direct from the Karigar.",
    ctaText: "Browse Catalog",
    ctaLink: "/catalog"
  }
];

export function useGoldRate() {
  const [rate, setRate] = useState({ rate22k: 0, rate24k: 0, logoUrl: "", homeConfig: { heroSlides: defaultSlides } as HomeConfig });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRate() {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 'goldRate')
        .single();
      
      if (data) {
        const config = data.homeConfig || {};
        setRate({ 
            rate22k: data.rate22k || 0, 
            rate24k: data.rate24k || 0, 
            logoUrl: data.logoUrl || "",
            homeConfig: { ...config, heroSlides: config.heroSlides || defaultSlides }
        });
      } else if (error) {
        console.warn("Failed to fetch rates from Supabase:", error);
      }
      setLoading(false);
    }
    fetchRate();

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
            setRate({ 
                rate22k: newData.rate22k || 0, 
                rate24k: newData.rate24k || 0, 
                logoUrl: newData.logoUrl || "",
                homeConfig: { ...config, heroSlides: config.heroSlides || defaultSlides }
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { rate, loading };
}
