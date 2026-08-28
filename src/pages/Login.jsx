import { useState } from 'react';
import { ShieldCheck, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('admin@fizyopanel.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Super Admin Master Credentials
    if (
      (email.trim().toLowerCase() === 'admin@fizyopanel.com' || email.trim().toLowerCase() === 'admin') &&
      password === 'admin123'
    ) {
      setTimeout(() => {
        const superAdminUser = {
          name: 'Süper Yönetici',
          email: 'admin@fizyopanel.com',
          role: 'superadmin',
        };
        localStorage.setItem('fizyo_superadmin', JSON.stringify(superAdminUser));
        onLogin(superAdminUser);
      }, 400);
    } else {
      setTimeout(() => {
        setError('Geçersiz yönetici bilgileri. (Varsayılan: admin@fizyopanel.com / admin123)');
        setLoading(false);
      }, 400);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-500/10 backdrop-blur-md">
            <ShieldCheck size={28} className="text-indigo-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">FizyoPanel Süper Admin</h1>
          <p className="text-[13px] text-slate-400 mt-1">Platform &amp; Çoklu Klinik Yönetim Merkezi</p>
        </div>

        {/* Form */}
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                Yönetici E-Posta
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-[13px] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                Master Şifre
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="admin123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-[13px] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-[12px] text-red-300 leading-relaxed">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white text-[13px] font-semibold transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Kontrol Ediliyor...</span>
                </>
              ) : (
                <>
                  <span>Yönetici Paneline Gir</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-700/60 text-center">
            <p className="text-[11px] text-slate-400">
              Varsayılan Giriş: <span className="text-slate-300 font-mono">admin@fizyopanel.com</span> / <span className="text-slate-300 font-mono">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
