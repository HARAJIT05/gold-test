import { useGoldRate } from '../hooks/useGoldRate';

export function TopTicker() {
  const { rate, loading } = useGoldRate();

  if (loading) return null;

  const separator = '\u00a0\u00a0\u00a0\u00a0\u2727\u00a0\u00a0\u00a0\u00a0';
  const msg = `Today's Gold Rate\u00a0\u00a0\u2014\u00a0\u00a0 22K : \u20b9${rate.rate22k}/g ${separator}`;

  // Repeat the message enough times to fill a seamless loop
  const repeated = Array(6).fill(msg).join('');

  return (
    <div
      className="bg-navy-900 text-gold-400 py-2 text-[10px] tracking-[2.5px] uppercase font-bold overflow-hidden whitespace-nowrap select-none"
      aria-label="Live gold rate ticker"
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
