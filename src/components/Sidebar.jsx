import { 
  Building2, LayoutDashboard, LogOut, ShieldCheck, ExternalLink, Menu, X, Megaphone, Sparkles 
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'clinics', label: 'Klinikler', icon: Building2 },
  { id: 'demo-requests', label: 'Demo Talepleri', icon: Sparkles },
  { id: 'announcements', label: 'Duyurular & Kampanya', icon: Megaphone },
];

export default function Sidebar({ activeTab, setActiveTab, mobileOpen, setMobileOpen, onLogout, clinicCount = 0, demoRequestsCount = 0 }) {
  const content = (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 shrink-0 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-md text-white font-black text-[13px] tracking-tight shrink-0">
            FT
          </div>
          <div>
            <span className="text-[14px] font-black text-white tracking-tight block">Fizyotim</span>
            <span className="text-[9px] text-slate-400 font-bold tracking-wider uppercase block">SÜPER ADMİN</span>
          </div>
        </div>
        <button onClick={() => setMobileOpen(false)} className="md:hidden text-slate-400 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 mt-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 cursor-pointer hover:translate-x-1 ${
                isActive
                  ? 'bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Icon size={18} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.id === 'clinics' && clinicCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 bg-slate-800 text-slate-300 text-[11px] font-bold rounded-full">
                  {clinicCount}
                </span>
              )}
              {item.id === 'demo-requests' && demoRequestsCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-bold rounded-full">
                  {demoRequestsCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Links */}
      <div className="p-3 mx-3 mb-3 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-2 hover:border-slate-600 transition-colors">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Hızlı Erişim</p>
        <a
          href="https://rezervasyon-app-six.vercel.app"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between text-[12px] text-slate-300 hover:text-emerald-400 transition-colors"
        >
          <span>Klinik Giriş Sayfası</span>
          <ExternalLink size={12} />
        </a>
        <a
          href="https://fizyo-booking.vercel.app"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between text-[12px] text-slate-300 hover:text-teal-400 transition-colors"
        >
          <span>Hasta Rezervasyon Portalı</span>
          <ExternalLink size={12} />
        </a>
      </div>

      {/* Bottom Logout */}
      <div className="p-3 border-t border-slate-800 shrink-0">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 cursor-pointer hover:translate-x-1"
        >
          <LogOut size={17} />
          <span>Yönetimden Çık</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden md:flex w-[260px] min-h-screen bg-slate-900 border-r border-slate-800 flex-col shrink-0">
        {content}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[270px] bg-slate-900 flex flex-col shadow-2xl z-10 border-r border-slate-800">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}

export function MobileMenuButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="md:hidden w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 mr-3 shadow-2xs"
    >
      <Menu size={18} />
    </button>
  );
}
