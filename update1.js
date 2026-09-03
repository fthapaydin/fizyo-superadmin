const fs = require('fs');
const path = require('path');

const baseDir = process.cwd();

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== 'dist') {
        walk(dirPath, callback);
      }
    } else {
      if (['.jsx', '.js', '.html', '.css', '.json'].includes(path.extname(f))) {
        callback(dirPath);
      }
    }
  });
}

// 1. Global rebrand
walk(baseDir, (filePath) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  let newContent = content.replace(/Fizyotim/g, 'Fizyotim');
  newContent = newContent.replace(/admin@fizyopanel\.com/g, 'admin@fizyotim.com');
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
  }
});

// 2. Update Login.jsx
const loginPath = path.join(baseDir, 'src', 'pages', 'Login.jsx');
if (fs.existsSync(loginPath)) {
  const loginContent = import { useState } from 'react';
import { ShieldCheck, Lock, Mail, Loader2, ArrowRight, LayoutDashboard, Building2, Users } from 'lucide-react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('admin@fizyotim.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (
      (email.trim().toLowerCase() === 'admin@fizyotim.com' || email.trim().toLowerCase() === 'admin') &&
      password === 'admin123'
    ) {
      setTimeout(() => {
        const superAdminUser = {
          name: 'Süper Yönetici',
          email: 'admin@fizyotim.com',
          role: 'superadmin',
        };
        localStorage.setItem('fizyo_superadmin', JSON.stringify(superAdminUser));
        onLogin(superAdminUser);
      }, 400);
    } else {
      setTimeout(() => {
        setError('Geçersiz yönetici bilgileri. (Varsayılan: admin@fizyotim.com / admin123)');
        setLoading(false);
      }, 400);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafb] flex">
      {/* Left Showcase Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[55%] bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 p-12 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[120px]"></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <ShieldCheck size={22} className="text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-white tracking-tight block">Fizyotim</span>
            <span className="text-xs text-emerald-400 font-semibold tracking-wider uppercase block">Süper Admin</span>
          </div>
        </div>

        <div className="relative z-10 my-auto max-w-xl">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
            Tüm klinikleri tek merkezden <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">kolayca yönetin.</span>
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed font-medium mb-10">
            Fizyotim Master Yönetim Paneli ile platformdaki tüm klinikleri, kullanıcıları ve randevu sistemlerini güvenle kontrol edin.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center mb-3">
                <Building2 size={20} />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Klinik Yönetimi</h3>
              <p className="text-xs text-slate-400">Sınırsız klinik hesabı oluşturun ve yetkilendirin.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-3">
                <LayoutDashboard size={20} />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Merkezi Kontrol</h3>
              <p className="text-xs text-slate-400">Tüm istatistikleri ve performans verilerini izleyin.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Card */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 bg-white relative">
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <ShieldCheck size={26} className="text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-slate-900 tracking-tight block">Fizyotim</span>
              <span className="text-xs text-emerald-600 font-semibold tracking-wider uppercase block">Süper Admin</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Hoş Geldiniz</h2>
            <p className="text-sm text-slate-500 font-medium">Master panele erişmek için giriş yapın.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                Yönetici E-Posta
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-white border border-slate-200 text-slate-900 text-[14px] focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-400 font-medium shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                Master Şifre
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-white border border-slate-200 text-slate-900 text-[14px] focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-400 font-medium shadow-2xs"
                />
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-100 text-[13px] font-medium text-red-600 flex items-start gap-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-[14px] font-semibold transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:active:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Giriş Yapılıyor...</span>
                </>
              ) : (
                <>
                  <span>Yönetim Paneline Gir</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-[12px] text-slate-500 font-medium">
              Giriş: <span className="text-slate-700 font-mono bg-slate-100 px-1.5 py-0.5 rounded">admin@fizyotim.com</span> / <span className="text-slate-700 font-mono bg-slate-100 px-1.5 py-0.5 rounded">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
;
  fs.writeFileSync(loginPath, loginContent, 'utf-8');
}

console.log('Rebrand and Login update done.');
