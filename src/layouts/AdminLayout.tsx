import { Outlet, Navigate, Link } from "react-router-dom";
import { useAuth, signOut } from "../hooks/useAuth";
import { Settings, Package, MessageSquare, LogOut, Loader2, Menu, ClipboardList } from "lucide-react";
import { useState } from "react";

export default function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-gold-500" /></div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const NavLinks = () => (
    <>
      <Link onClick={() => setMobileMenuOpen(false)} to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-navy-800 transition-colors">
        <Settings className="w-5 h-5 text-gold-400" /> Dashboard & Rates
      </Link>
      <Link onClick={() => setMobileMenuOpen(false)} to="/admin/catalog" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-navy-800 transition-colors">
        <Package className="w-5 h-5 text-gold-400" /> Catalog Manager
      </Link>
      <Link onClick={() => setMobileMenuOpen(false)} to="/admin/reviews" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-navy-800 transition-colors">
        <MessageSquare className="w-5 h-5 text-gold-400" /> Reviews
      </Link>
      <Link onClick={() => setMobileMenuOpen(false)} to="/admin/logs" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-navy-800 transition-colors">
        <ClipboardList className="w-5 h-5 text-gold-400" /> Audit Logs
      </Link>
    </>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-navy-950 font-sans">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-navy-900 text-white flex items-center justify-between p-4 sticky top-0 z-50">
        <h2 className="text-xl font-serif text-gold-400 font-bold">Admin Portal</h2>
        <div className="flex gap-4 items-center">
          <button onClick={signOut} className="text-red-400 hover:text-red-300">
            <LogOut className="w-5 h-5" />
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="w-6 h-6 text-gold-400" />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-900 text-white flex flex-col px-4 pb-4">
          <nav className="flex flex-col gap-1">
            <NavLinks />
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-navy-900 text-white hidden md:flex flex-col fixed h-screen overflow-y-auto z-40">
        <div className="p-6">
          <h2 className="text-2xl font-serif text-gold-400 font-bold">Admin Portal</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavLinks />
        </nav>
        <div className="p-4 border-t border-navy-800">
          <button 
            onClick={signOut}
            className="flex items-center gap-3 w-full px-4 py-2 text-left rounded-md hover:bg-navy-800 transition-colors text-red-500 font-medium"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full md:pl-64 flex flex-col min-h-screen">
        <div className="hidden md:flex bg-navy-900 items-center justify-between px-8 py-4 border-b border-white/10 sticky top-0 z-30 shadow-sm">
           <div className="text-sm font-medium text-gray-400">Logged in as <span className="text-white">{user.email}</span></div>
           <button 
             onClick={signOut}
             className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm font-bold tracking-wider uppercase"
           >
             <LogOut className="w-4 h-4" /> Secure Logout
           </button>
        </div>
        <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
