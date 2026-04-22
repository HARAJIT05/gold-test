import { Link } from 'react-router-dom';
import { Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-navy-950 text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gold-400 flex items-center justify-center text-white text-xs font-serif italic shadow-sm">GK</div>
              <span className="font-serif font-bold text-xl tracking-tighter text-white">GOLD KARIGAR</span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm mb-6">
              Exquisite, handcrafted gold jewelry preserving tradition and blending modern elegance. Your trusted gold manufacturing partner since 1992.
            </p>
            <div className="flex space-x-3">
              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:border-[#E1306C] hover:text-[#E1306C] hover:bg-[#E1306C]/10 transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              {/* WhatsApp */}
              <a
                href="#"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:border-[#25D366] hover:text-[#25D366] hover:bg-[#25D366]/10 transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/catalog" className="text-gray-400 hover:text-gold-400 text-xs uppercase tracking-widest transition-colors">Collection</Link></li>
              <li><Link to="/reviews" className="text-gray-400 hover:text-gold-400 text-xs uppercase tracking-widest transition-colors">Testimonials</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-gold-400 text-xs uppercase tracking-widest transition-colors">The Craft</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-4">Visit Us</h3>
            <ul className="space-y-3 text-xs text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gold-400 shrink-0 mt-0.5" />
                <span>Kalyan, Mumbai</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold-400 shrink-0" />
                <a href="tel:+910000000000" className="hover:text-gold-400 transition-colors">+91 000 000 0000</a>
              </li>
              <li className="pt-2">
                <Link to="/admin" className="text-[10px] uppercase tracking-widest border-b border-white/20 text-white/40 hover:text-gold-400 hover:border-gold-400 transition-colors">Admin Area</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 text-center text-[10px] uppercase tracking-widest text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Gold Karigar Workshop. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-6 font-bold">
            <Link to="#" className="hover:text-gold-400 text-gray-500 transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-gold-400 text-gray-500 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
