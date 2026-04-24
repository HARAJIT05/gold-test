import { useGoldRate } from '../hooks/useGoldRate';

const DEFAULT_TICKER = 'Welcome to NABA Gold Karigar \u00a0\u00a0\u2727\u00a0\u00a0 Est. 1992 · Kalyan, Mumbai \u00a0\u00a0\u2727\u00a0\u00a0 Premium 22K Gold Manufacturing & Wholesale';

export function TopTicker() {
  const { rate, loading } = useGoldRate();

  if (loading) return null;

  const text = rate.homeConfig?.tickerText?.trim() || DEFAULT_TICKER;

  const separator = '\u00a0\u00a0\u00a0\u00a0\u2727\u00a0\u00a0\u00a0\u00a0';
  const msg = `${text}${separator}`;

  // Repeat enough times for a seamless loop
  const repeated = Array(8).fill(msg).join('');

  return (
    <div
      className="bg-navy-900 text-gold-400 py-2 text-[10px] tracking-[2.5px] uppercase font-bold overflow-hidden whitespace-nowrap select-none"
      aria-label="Ticker"
    >
      <div className="ticker-track inline-flex">
        <span className="ticker-content">{repeated}</span>
        {/* Duplicate for seamless looping */}
        <span className="ticker-content" aria-hidden="true">{repeated}</span>
      </div>

      <style>{`
        .ticker-track {
          animation: ticker-scroll 40s linear infinite;
          will-change: transform;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        .ticker-content {
          padding-right: 0;
        }
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
