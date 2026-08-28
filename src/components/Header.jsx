import { RefreshCw, ShieldCheck } from 'lucide-react';
import { MobileMenuButton } from './Sidebar';

export default function Header({ title, subtitle, onRefresh, onMenuClick }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200/80 px-4 md:px-8 flex items-center justify-between shrink-0">
      <div className="flex items-center">
        <MobileMenuButton onClick={onMenuClick} />
        <div>
          <h1 className="text-[15px] md:text-[16px] font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-[12px] text-gray-400 mt-0.5 hidden sm:block">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-[12px] font-medium">
          <ShieldCheck size={14} className="text-indigo-600" />
          <span>Süper Yönetici Oturumu</span>
        </div>

        <button
          onClick={onRefresh}
          className="h-9 px-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 text-[12px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
        >
          <RefreshCw size={13} />
          <span className="hidden sm:inline">Yenile</span>
        </button>
      </div>
    </header>
  );
}
