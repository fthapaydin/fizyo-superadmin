import { Building2, Users, CalendarDays, CheckCircle2, Plus, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';

export default function Dashboard({ clinics, stats, onNavigateClinics, onAddClinicClick }) {
  const activeCount = clinics.filter((c) => c.status === 'aktif').length;
  const trialCount = clinics.filter((c) => c.status === 'deneme').length;

  return (
    <div className="space-y-6 font-[Inter]">
      {/* Welcome Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider text-slate-300">
            <ShieldCheck size={13} /> Master Yönetim Paneli
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">Fizyotim</h2>
          <p className="text-[13px] md:text-[14px] text-slate-300 max-w-xl leading-relaxed">
            Klinikler oluşturabilir, şifrelerini belirleyebilir, üyeliklerini yönetebilir ve özel hasta rezervasyon linklerini kopyalayabilirsiniz.
          </p>
        </div>

        <button
          onClick={onAddClinicClick}
          className="h-10 px-4 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-[13px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <Plus size={15} /> Yeni Klinik Ekle
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Toplam Klinik</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <Building2 size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{clinics.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">{activeCount} aktif · {trialCount} deneme</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Aktif Klinikler</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{activeCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">Sisteme erişebilen klinikler</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Sistemdeki Hasta</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.patientCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">Tüm kliniklerin toplamı</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Toplam Randevu</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <CalendarDays size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.sessionCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">Oluşturulan toplam seans</p>
        </div>
      </div>

      {/* Recent Clinics Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-[15px] font-bold text-slate-900">Kayıtlı Klinikler</h3>
            <p className="text-[12px] text-slate-400 mt-0.5">Sistemde tanımlı tüm klinikler ve erişim durumları</p>
          </div>
          <button
            onClick={onNavigateClinics}
            className="text-[12px] font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
          >
            <span>Tümünü Yönet</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="text-left px-5 py-3">Klinik</th>
                <th className="text-left px-5 py-3">Yetkili &amp; İletişim</th>
                <th className="text-left px-5 py-3">Giriş E-Postası</th>
                <th className="text-left px-5 py-3">Durum</th>
                <th className="text-right px-5 py-3">Rezervasyon Linki</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px]">
              {clinics.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                    Henüz kayıtlı klinik bulunmuyor.
                  </td>
                </tr>
              ) : (
                clinics.slice(0, 5).map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[12px] shrink-0 border border-slate-200">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{c.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">slug: {c.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-800">{c.owner_name}</p>
                      <p className="text-[11px] text-slate-400">{c.phone}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 font-mono text-[12px]">
                      {c.email}
                    </td>
                    <td className="px-5 py-3.5">
                      {c.status === 'aktif' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200/60">
                          Aktif
                        </span>
                      ) : c.status === 'deneme' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-200/60">
                          Deneme
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold border border-slate-200">
                          Pasif
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <a
                        href={`https://fizyo-booking.vercel.app/?clinic=${c.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-medium transition-colors"
                      >
                        <span>Portala Git</span>
                        <ExternalLink size={11} className="text-slate-400" />
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
