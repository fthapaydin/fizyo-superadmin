import { Building2, Users, CalendarDays, CheckCircle2, Plus, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';

export default function Dashboard({ clinics, stats, onNavigateClinics, onAddClinicClick }) {
  const activeCount = clinics.filter((c) => c.status === 'aktif').length;
  const trialCount = clinics.filter((c) => c.status === 'deneme').length;

  return (
    <div className="space-y-6 font-[Inter]">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-indigo-500/30 border border-indigo-400/30 px-3 py-1 rounded-full text-[12px] font-semibold text-indigo-200">
            <ShieldCheck size={14} /> Master Yönetim Paneli
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Fizyotim</h2>
          <p className="text-[13px] md:text-[14px] text-indigo-200 max-w-xl leading-relaxed">
            Buradan yeni klinikler oluşturabilir, giriş şifrelerini belirleyebilir, üyeliklerini yönetebilir ve özel hasta rezervasyon linklerini kopyalayabilirsiniz.
          </p>
        </div>

        <button
          onClick={onAddClinicClick}
          className="h-11 px-5 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white text-[13px] font-bold flex items-center gap-2 shadow-lg shadow-indigo-950/40 transition-all cursor-pointer shrink-0"
        >
          <Plus size={16} /> Yeni Klinik Ekle
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all cursor-default hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Toplam Klinik</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building2 size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{clinics.length}</p>
          <p className="text-[11px] text-gray-400 mt-1">{activeCount} aktif · {trialCount} deneme</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all cursor-default hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Aktif Klinikler</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-600">{activeCount}</p>
          <p className="text-[11px] text-gray-400 mt-1">Sisteme erişebilen klinikler</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all cursor-default hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Sistemdeki Hasta</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{stats.patientCount}</p>
          <p className="text-[11px] text-gray-400 mt-1">Tüm kliniklerin toplamı</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all cursor-default hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Toplam Randevu</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <CalendarDays size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{stats.sessionCount}</p>
          <p className="text-[11px] text-gray-400 mt-1">Oluşturulan toplam seans</p>
        </div>
      </div>

      {/* Recent Clinics Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-[15px] font-bold text-gray-800">Kayıtlı Klinikler</h3>
            <p className="text-[12px] text-gray-400 mt-0.5">Sistemde tanımlı tüm klinikler ve erişim durumları</p>
          </div>
          <button
            onClick={onNavigateClinics}
            className="text-[13px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Tümünü Yönet</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                <th className="text-left px-5 py-3">Klinik</th>
                <th className="text-left px-5 py-3">Yetkili &amp; İletişim</th>
                <th className="text-left px-5 py-3">Giriş E-Postası</th>
                <th className="text-left px-5 py-3">Durum</th>
                <th className="text-right px-5 py-3">Rezervasyon Linki</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[13px]">
              {clinics.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-400">
                    Henüz kayıtlı klinik bulunmuyor.
                  </td>
                </tr>
              ) : (
                clinics.slice(0, 5).map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-[12px] shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{c.name}</p>
                          <p className="text-[11px] text-gray-400 font-mono">slug: {c.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-800">{c.owner_name}</p>
                      <p className="text-[11px] text-gray-400">{c.phone}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 font-mono text-[12px]">
                      {c.email}
                    </td>
                    <td className="px-5 py-3.5">
                      {c.status === 'aktif' ? (

                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-[11px] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Pasif
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <a
                        href={`https://fizyo-booking.vercel.app/?clinic=${c.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 text-[11px] font-semibold transition-colors"
                      >
                        <span>Portala Git</span>
                        <ExternalLink size={11} />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
