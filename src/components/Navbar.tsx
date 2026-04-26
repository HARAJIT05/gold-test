import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { TopTicker } from './TopTicker';
import { useGoldRate } from '../hooks/useGoldRate';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { rate } = useGoldRate();
  // true once the user has ever visited /exclusive-catalogue on this device
  const [hasExclusiveAccess, setHasExclusiveAccess] = useState(
    () => localStorage.getItem('naba_exclusive_access') === '1'
  );

  // Keep in sync if the flag gets written while this tab is open
  useEffect(() => {
    const handler = () =>
      setHasExclusiveAccess(localStorage.getItem('naba_exclusive_access') === '1');
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  // Dynamically update the browser favicon whenever the admin logo changes
  useEffect(() => {
    const favicon = document.getElementById('favicon') as HTMLLinkElement | null;
    if (!favicon) return;
    if (rate.logoUrl) {
      favicon.href = rate.logoUrl;
      favicon.type = 'image/png'; // most uploaded logos are PNG/JPG
    }
  }, [rate.logoUrl]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Catalogue', path: '/catalogue' },
    ...(hasExclusiveAccess
      ? [{ name: 'Exclusive Catalogue', path: '/exclusive-catalogue' }]
      : []),
    { name: 'Reviews', path: '/reviews' },
    { name: 'About', path: '/about' },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-[11px] uppercase tracking-[2px] font-semibold transition-colors duration-200 pb-1 border-b-2 ${isActive
      ? 'text-gold-400 border-gold-400'
      : 'text-white/70 border-transparent hover:text-gold-400 hover:border-gold-400/50'
    }`;

  return (
    <header className="sticky top-0 z-50 w-full shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
      <TopTicker />
      <nav className="bg-navy-950 border-b border-white/5">
        {/* Full-width bar — no max-width constraint so logo truly starts from the left edge */}
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center h-24">

            {/* Logo — always hard-left */}
            <Link to="/" className="flex items-center gap-4 flex-shrink-0">
              <img
                src={rate.logoUrl || '/naba-logo.png'}
                alt="NABA GOLD Logo"
                className="h-20 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col leading-none">
                <span className="font-serif font-bold text-3xl tracking-tighter text-white">
                  NABA GOLD
                </span>
                <span className="text-[11px] uppercase tracking-[3px] text-gold-400/70 font-bold mt-0.5">
                  Since 1992
                </span>
              </div>
            </Link>

            {/* Desktop nav links — pushed to the right with ml-auto */}
            <div className="hidden md:flex items-center gap-8 ml-auto">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/'}
                  className={linkClass}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* Mobile hamburger — pushed to the right with ml-auto */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden ml-auto text-white hover:text-gold-400 focus:outline-none p-1"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isOpen && (
          <div className="md:hidden bg-navy-900 border-t border-white/5 px-6 pb-4 pt-2 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.path === '/'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-3 rounded-lg text-xs uppercase tracking-[1.5px] font-semibold transition-colors ${isActive
                    ? 'text-gold-400 bg-navy-950'
                    : 'text-white/70 hover:text-gold-400 hover:bg-navy-950'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
