import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { TopTicker } from './TopTicker';
import { useGoldRate } from '../hooks/useGoldRate';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { rate } = useGoldRate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Catalog', path: '/catalog' },
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
          <div className="flex items-center h-20">

            {/* Logo — always hard-left */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0">
              {rate.logoUrl ? (
                <img
                  src={rate.logoUrl}
                  alt="Gold Karigar Logo"
                  className="h-9 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gold-400 flex items-center justify-center text-white text-xs font-serif italic shadow-sm flex-shrink-0">
                  GK
                </div>
              )}
              <span className="font-serif font-bold text-xl tracking-tighter text-white leading-none">
                NABA
              </span>
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
