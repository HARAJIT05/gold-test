import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth, signInWithEmail, signOut } from "../../hooks/useAuth";
import { Loader2, ShieldCheck, Mail, Lock, LogOut } from "lucide-react";

export default function AdminLogin() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (loading) return null;
  if (user && isAdmin) return <Navigate to="/admin" replace />;
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-950 flex-col px-4 text-center">
        <ShieldCheck className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-gray-400 max-w-md">The account ({user.email}) does not have administrative privileges.</p>
        <div className="flex gap-4 mt-8">
          <button onClick={() => window.location.href = "/"} className="px-6 py-2.5 bg-gold-400 text-white font-bold uppercase tracking-widest text-xs rounded-full hover:bg-gold-500 transition-colors shadow-sm">
            Return Home
          </button>
          <button onClick={signOut} className="flex items-center gap-2 px-6 py-2.5 bg-navy-900 border border-white/10 text-white font-bold uppercase tracking-widest text-xs rounded-full hover:bg-navy-800 transition-colors shadow-sm">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setError("");
    try {
      await signInWithEmail(email, password);
      // Route is protected, layout handles redirect if not admin
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-950 px-4">
      <div className="bg-navy-900 p-8 rounded-xl shadow-2xl max-w-md w-full text-center relative overflow-hidden text-left border border-white/5">
        <div className="absolute top-0 left-0 w-full h-2 bg-gold-400"></div>
        <div className="w-16 h-16 bg-navy-950 rounded-full flex items-center justify-center mx-auto mb-6 shrink-0 border-4 border-gold-400/20">
           <ShieldCheck className="text-gold-400 w-8 h-8" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-white mb-2 text-center">Admin Portal Login</h1>
        <p className="text-gray-400 text-sm mb-8 text-center">Sign in with your authorized admin credentials.</p>
        
        {error && <div className="mb-6 p-3 bg-red-500/10 text-red-400 text-sm rounded border border-red-500/20">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="text-left">
            <label className="block text-[10px] uppercase font-bold tracking-widest text-white/40 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-0 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border-b border-white/10 pl-8 pr-0 py-2 focus:ring-0 focus:border-gold-400 outline-none transition-colors bg-transparent rounded-none text-white placeholder-white/30"
                placeholder="admin@goldkarigar.com"
              />
            </div>
          </div>
          <div className="text-left">
            <label className="block text-[10px] uppercase font-bold tracking-widest text-white/40 mb-2">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-0 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border-b border-white/10 pl-8 pr-0 py-2 focus:ring-0 focus:border-gold-400 outline-none transition-colors bg-transparent rounded-none text-white placeholder-white/30"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loggingIn}
            className="w-full bg-gold-400 text-white py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold-500 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 mt-6 shadow-lg shadow-gold-400/20"
          >
            {loggingIn && <Loader2 className="w-4 h-4 animate-spin" />}
            Secure Login
          </button>
        </form>
      </div>
    </div>
  );
}
