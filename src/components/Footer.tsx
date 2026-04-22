import { Link } from 'react-router-dom';
import { Phone, MapPin } from 'lucide-react';
import { useGoldRate } from '../hooks/useGoldRate';

const LOCATIONS = [
  {
    label: 'Kalyan (Main Branch)',
    address: 'Rajguru Niwas, Room No 4, Jijamata Colony, Narayanwadi, Kalyan (West), Pin - 421301',
    mapsUrl: 'https://maps.app.goo.gl/1K3iToLCCEd5mMD16',
    phone: '+91 98922 42785',
    tel: '+919892242785 ',
  },
  {
    label: 'Mumbai (Showroom)',
    address: '307, OM GOLDEN BUILDING, Shaikh Memon Street Nearby Landmark COTTON EXCAHNGE, Kalbadevi, Mumbai, Maharashtra PIN 400002',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Zaveri+Bazaar+Kalbadevi+Mumbai+Maharashtra',
    phone: '+91 99322 81366',
    tel: '+919932281366',
  },
];

export function Footer() {
  const { rate } = useGoldRate();

  return (
    <footer className="bg-navy-950 text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">

          {/* ── Brand ── */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-4 mb-6">
              <img
                src={rate.logoUrl || '/naba-logo.png'}
                alt="NABA Logo"
                className="h-14 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
              <span className="font-serif font-bold text-3xl tracking-tighter text-white">NABA</span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm mb-6">
              Exquisite, handcrafted gold jewelry preserving tradition and blending modern elegance. Your trusted gold manufacturing partner since 1992.
            </p>
            <div className="flex space-x-3">
              {/* WhatsApp */}
              <a
                href="https://wa.me/919892242785"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:border-[#25D366] hover:text-[#25D366] hover:bg-[#25D366]/10 transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="https://youtube.com/@naba1992?si=W9HLumrFgtJ668s1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:border-[#FF0000] hover:text-[#FF0000] hover:bg-[#FF0000]/10 transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>

          </div>

          {/* ── Quick Links ── */}
          <div>
            <h3 className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/catalog" className="text-gray-400 hover:text-gold-400 text-xs uppercase tracking-widest transition-colors">Collection</Link></li>
              <li><Link to="/reviews" className="text-gray-400 hover:text-gold-400 text-xs uppercase tracking-widest transition-colors">Testimonials</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-gold-400 text-xs uppercase tracking-widest transition-colors">The Craft</Link></li>
            </ul>
          </div>

          {/* ── Locations ── */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-4">Find Us</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {LOCATIONS.map((loc) => (
                <div key={loc.label} className="space-y-2.5">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-gold-400/80">{loc.label}</p>

                  {/* Address → opens Google Maps */}
                  <a
                    href={loc.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 group"
                    aria-label={`Open ${loc.label} in Google Maps`}
                  >
                    <MapPin className="h-3.5 w-3.5 text-gold-400 shrink-0 mt-0.5 group-hover:text-gold-300 transition-colors" />
                    <span className="text-gray-400 text-xs leading-relaxed group-hover:text-white transition-colors underline-offset-2 group-hover:underline">
                      {loc.address}
                    </span>
                  </a>

                  {/* Phone */}
                  <a
                    href={`tel:${loc.tel}`}
                    className="flex items-center gap-2 group"
                  >
                    <Phone className="h-3.5 w-3.5 text-gold-400 shrink-0 group-hover:text-gold-300 transition-colors" />
                    <span className="text-gray-400 text-xs group-hover:text-white transition-colors">
                      {loc.phone}
                    </span>
                  </a>
                </div>
              ))}
            </div>


          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-12 pt-8 border-t border-white/5 text-center text-[10px] uppercase tracking-widest text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} NABA. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-6 font-bold">
            <Link to="#" className="hover:text-gold-400 text-gray-500 transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-gold-400 text-gray-500 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


