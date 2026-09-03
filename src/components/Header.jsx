import { RefreshCw, ShieldCheck } from 'lucide-react';
import { MobileMenuButton } from './Sidebar';

export default function Header({ title, subtitle, onRefresh, onMenuClick }) {
  return (
    <header className="h-20 bg-white border-b border-gray-200/80 px-4 md:px-8 flex items-center justify-between shrink-0 shadow-2xs">
      <div className="flex items-center">
        <MobileMenuButton onClick={onMenuClick} />
        <div>
          <h1 className="text-[17px] md:text-[19px] font-bold text-gray-900 tracking-tight">{title}</h1>
          {subtitle && <p className="text-[13px] text-gray-500 mt-0.5 hidden sm:block font-medium">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-[12px] font-semibold shadow-2xs">
          <ShieldCheck size={16} className="text-emerald-600" />
          <span>Süper Yönetici Oturumu</span>
        </div>

        <button
          onClick={onRefresh}
          className="h-10 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-[13px] font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-2xs hover:shadow-md"
        >
          <RefreshCw size={15} />
          <span className="hidden sm:inline">Yenile</span>
        </button>
      </div>
    </header>
  );
}
