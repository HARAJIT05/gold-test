import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useGoldRate() {
  const [rate, setRate] = useState({ rate22k: 0, rate24k: 0, logoUrl: "", homeConfig: {} as any });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRate() {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 'goldRate')
        .single();
      
      if (data) {
        setRate({ 
            rate22k: data.rate22k || 0, 
            rate24k: data.rate24k || 0, 
            logoUrl: data.logoUrl || "",
            homeConfig: data.homeConfig || {}
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
            setRate({ 
                rate22k: newData.rate22k || 0, 
                rate24k: newData.rate24k || 0, 
                logoUrl: newData.logoUrl || "",
                homeConfig: newData.homeConfig || {}
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
