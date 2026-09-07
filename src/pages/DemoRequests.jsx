import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/ui/Toast';
import { 
  fetchAllDemoRequests, updateDemoReqStatus, removeDemoReq, saveNewDemoRequest 
} from '../lib/demoRequestsUtils';
import { 
  Sparkles, Search, Filter, Phone, Mail, MapPin, Calendar, 
  MessageSquare, ExternalLink, CheckCircle2, Clock, XCircle, 
  Trash2, Plus, Building2, UserPlus, ArrowRight, Check, X,
  Edit3, FileText, AlertCircle
} from 'lucide-react';

const STATUS_CONFIG = {
  bekliyor: { label: 'Bekliyor', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  iletisime_gecildi: { label: 'İletişime Geçildi', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Phone },
  demo_acildi: { label: 'Demo Açıldı', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  iptal: { label: 'İptal Edildi', color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
};

const PLAN_LABELS = {
  '14-gun-deneme': '14 Gün Ücretsiz Deneme',
  'yillik-kampanya': 'Yıllık Plan (%33 İndirim)',
  'ozel-teklif': 'Özel Teklif / Çoklu Şube',
};

export default function DemoRequests({ onConvertToClinic }) {
  const { toast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  // Admin Notu Düzenleme State
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [tempNote, setTempNote] = useState('');

  // Manuel Talep Ekleme Modalı
  const [showAddModal, setShowAddModal] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newForm, setNewForm] = useState({
    full_name: '',
    clinic_name: '',
    phone: '',
    email: '',
    city: '',
    plan: '14-gun-deneme',
    notes: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllDemoRequests(supabase);
      setRequests(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Demo talepleri yüklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Durum Değiştirme
  const handleStatusChange = async (item, newStatus) => {
    try {
      await updateDemoReqStatus(supabase, item.id, newStatus);
      toast.success(`Talep durumu "${STATUS_CONFIG[newStatus]?.label}" olarak güncellendi.`);
      loadData();
    } catch (err) {
      toast.error('Durum güncellenemedi.');
    }
  };

  // Not Kaydetme
  const handleSaveNote = async (item) => {
    try {
      await updateDemoReqStatus(supabase, item.id, item.status, tempNote);
      toast.success('Yönetici notu kaydedildi.');
      setEditingNotesId(null);
      loadData();
    } catch (err) {
      toast.error('Not kaydedilemedi.');
    }
  };

  // Silme
  const handleDelete = async (item) => {
    if (!window.confirm(`"${item.full_name} (${item.clinic_name})"${item.phone ? ' - ' + item.phone : ''} demo talebini silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      await removeDemoReq(supabase, item.id);
      toast.success('Demo talebi başarıyla silindi.');
      loadData();
    } catch (err) {
      toast.error('Silme işlemi gerçekleştirilemedi.');
    }
  };

  // Manuel Ekleme
  const handleManualAdd = async (e) => {
    e.preventDefault();
    if (!newForm.full_name || !newForm.clinic_name || !newForm.phone) {
      toast.error('Lütfen Yetkili Adı, Klinik Adı ve Telefon alanlarını doldurunuz.');
      return;
    }

    setAdding(true);
    try {
      await saveNewDemoRequest(supabase, newForm);
      toast.success('Demo talebi başarıyla kaydedildi.');
      setShowAddModal(false);
      setNewForm({
        full_name: '',
        clinic_name: '',
        phone: '',
        email: '',
        city: '',
        plan: '14-gun-deneme',
        notes: '',
      });
      loadData();
    } catch (err) {
      toast.error('Kayıt oluşturulamadı.');
    } finally {
      setAdding(false);
    }
  };

  // Filtreleme
  const filtered = useMemo(() => {
    return requests.filter(r => {
      const matchSearch = 
        (r.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.clinic_name || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.phone || '').includes(search) ||
        (r.city || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.email || '').toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchPlan = planFilter === 'all' || r.plan === planFilter;

      return matchSearch && matchStatus && matchPlan;
    });
  }, [requests, search, statusFilter, planFilter]);

  // İstatistikler
  const counts = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter(r => r.status === 'bekliyor').length;
    const contacted = requests.filter(r => r.status === 'iletisime_gecildi').length;
    const converted = requests.filter(r => r.status === 'demo_acildi').length;
    return { total, pending, contacted, converted };
  }, [requests]);

  return (
    <div className="space-y-6 font-[Inter]">
      
      {/* ─── Üst Başlık & Buton ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles size={20} className="text-amber-500" />
            <span>Klinik Demo & Başvuru Talepleri</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Web sitesi ve tanıtım sayfası üzerinden gelen 14 günlük deneme ve fiyat teklifi başvuruları
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="h-10 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors cursor-pointer shrink-0"
        >
          <Plus size={15} />
          <span>Manuel Talep Ekle</span>
        </button>
      </div>

      {/* ─── KPI Sayaç Kartları ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Toplam Başvuru</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <FileText size={14} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{counts.total}</p>
          <p className="text-[11px] text-slate-500 mt-1">Sisteme iletilen tüm talepler</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Bekleyen Talepler</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={14} />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-600">{counts.pending}</p>
          <p className="text-[11px] text-slate-500 mt-1">İletişim bekleyen yeni klinikler</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Görüşülenler</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Phone size={14} />
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-600">{counts.contacted}</p>
          <p className="text-[11px] text-slate-500 mt-1">İletişime geçilip bilgi verilenler</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Demo Açılanlar</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={14} />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{counts.converted}</p>
          <p className="text-[11px] text-slate-500 mt-1">Aktif klinik hesabına dönüştürülen</p>
        </div>
      </div>

      {/* ─── Filtre & Arama Barı ─── */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Yetkili adı, klinik adı, telefon veya şehir ile arayın..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Durum Filtresi */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:border-slate-300 focus:outline-hidden"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="bekliyor">Bekleyenler ({counts.pending})</option>
            <option value="iletisime_gecildi">İletişime Geçilenler ({counts.contacted})</option>
            <option value="demo_acildi">Demo Açılanlar ({counts.converted})</option>
            <option value="iptal">İptal Edilenler</option>
          </select>

          {/* Plan Filtresi */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:border-slate-300 focus:outline-hidden"
          >
            <option value="all">Tüm Planlar</option>
            <option value="14-gun-deneme">14 Gün Deneme</option>
            <option value="yillik-kampanya">Yıllık Plan</option>
            <option value="ozel-teklif">Özel Teklif</option>
          </select>
        </div>
      </div>

      {/* ─── Talep Listesi ─── */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            Demo talepleri yükleniyor...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-200 p-12 text-center text-slate-400 text-xs">
            Arama kriterlerine uygun demo talebi bulunamadı.
          </div>
        ) : (
          filtered.map((item) => {
            const statusConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG.bekliyor;
            const cleanPhone = (item.phone || '').replace(/\D/g, '');
            const waPhone = cleanPhone.startsWith('0') ? '9' + cleanPhone : (cleanPhone.startsWith('90') ? cleanPhone : '90' + cleanPhone);
            const waMessage = encodeURIComponent(`Merhaba Sayın ${item.full_name}, Fizyotim klinik yönetim sistemi için ilettiğiniz ${PLAN_LABELS[item.plan] || 'demo'} talebiniz hakkında iletişime geçiyorum.`);

            const isEditingNote = editingNotesId === item.id;

            return (
              <div 
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 hover:border-slate-300 transition-all space-y-4"
              >
                {/* Üst Satır: Başlık, Plan Rozeti, Durum & Tarih */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-xs shrink-0">
                      {item.full_name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{item.full_name}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Building2 size={12} className="text-slate-400" />
                        <span>{item.clinic_name}</span>
                        {item.city && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-600">{item.city}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    {/* Plan Rozeti */}
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                      {PLAN_LABELS[item.plan] || item.plan || 'Standart'}
                    </span>

                    {/* Durum Seçici Dropdown */}
                    <select
                      value={item.status || 'bekliyor'}
                      onChange={(e) => handleStatusChange(item, e.target.value)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-md border transition-all cursor-pointer focus:outline-hidden ${statusConfig.color}`}
                    >
                      <option value="bekliyor">● Bekliyor</option>
                      <option value="iletisime_gecildi">● İletişime Geçildi</option>
                      <option value="demo_acildi">✓ Demo Açıldı</option>
                      <option value="iptal">✕ İptal Edildi</option>
                    </select>

                    {/* Silme Butonu */}
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Talebi Sil"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Orta Satır: İletişim Bilgileri & Butonlar */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  
                  {/* Sol Bölüm: Telefon, E-posta & Hızlı İletişim Aksiyonları */}
                  <div className="md:col-span-7 space-y-2 text-xs">
                    <div className="flex flex-wrap items-center gap-4">
                      {/* Telefon */}
                      <div className="flex items-center gap-1.5 text-slate-700 font-mono font-semibold">
                        <Phone size={13} className="text-slate-400" />
                        <span>{item.phone}</span>
                      </div>

                      {/* E-Posta */}
                      {item.email && (
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Mail size={13} className="text-slate-400" />
                          <a href={`mailto:${item.email}`} className="hover:underline hover:text-blue-600">
                            {item.email}
                          </a>
                        </div>
                      )}

                      {/* Tarih */}
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <Calendar size={12} />
                        <span>
                          {item.created_at ? new Date(item.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-'}
                        </span>
                      </div>
                    </div>

                    {/* Başvuru Notu */}
                    {item.notes && (
                      <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-slate-700 text-xs leading-relaxed">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Klinik Notu / Mesajı:</span>
                        {item.notes}
                      </div>
                    )}

                    {/* Admin Notu */}
                    <div className="text-xs">
                      {isEditingNote ? (
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="text"
                            value={tempNote}
                            onChange={(e) => setTempNote(e.target.value)}
                            placeholder="Görüşme notu ekleyin (örn: Arandı, yarın Zoom demo yapılacak)..."
                            className="flex-1 h-8 px-2.5 rounded-md border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:border-slate-900"
                          />
                          <button
                            onClick={() => handleSaveNote(item)}
                            className="h-8 px-2.5 rounded-md bg-slate-900 text-white font-semibold text-xs flex items-center gap-1"
                          >
                            <Check size={12} /> Kaydet
                          </button>
                          <button
                            onClick={() => setEditingNotesId(null)}
                            className="h-8 px-2 rounded-md bg-slate-100 text-slate-600 text-xs"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mt-1 text-slate-500">
                          <span className="text-[11px] font-semibold text-slate-400">Yönetici Notu:</span>
                          <span className="text-slate-700 italic">{item.admin_notes || 'Henüz not eklenmedi.'}</span>
                          <button
                            onClick={() => {
                              setEditingNotesId(item.id);
                              setTempNote(item.admin_notes || '');
                            }}
                            className="text-slate-400 hover:text-slate-700 p-1"
                            title="Notu Düzenle"
                          >
                            <Edit3 size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sağ Bölüm: İletişim & Kliniğe Dönüştürme Aksiyonları */}
                  <div className="md:col-span-5 flex flex-wrap sm:flex-nowrap items-center justify-end gap-2 pt-1">
                    
                    {/* WhatsApp Butonu */}
                    <a
                      href={`https://wa.me/${waPhone}?text=${waMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-9 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
                    >
                      <MessageSquare size={13} />
                      <span>WhatsApp</span>
                    </a>

                    {/* Telefon Arama */}
                    <a
                      href={`tel:${cleanPhone}`}
                      className="h-9 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
                    >
                      <Phone size={13} />
                      <span>Ara</span>
                    </a>

                    {/* Kliniğe Dönüştür / Klinik Hesabı Aç Butonu */}
                    {onConvertToClinic && (
                      <button
                        onClick={() => onConvertToClinic(item)}
                        className="h-9 px-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
                      >
                        <UserPlus size={13} />
                        <span>Klinik Hesabı Aç →</span>
                      </button>
                    )}

                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* ─── Manuel Talep Ekleme Modalı ─── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10 border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-amber-500" />
                <h3 className="text-base font-bold text-slate-900">Manuel Demo Talebi Oluştur</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleManualAdd} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Yetkili Ad Soyad *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Fzt. Mehmet Demir"
                    value={newForm.full_name}
                    onChange={(e) => setNewForm({ ...newForm, full_name: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Klinik Adı *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Yaşam Fizyoterapi"
                    value={newForm.clinic_name}
                    onChange={(e) => setNewForm({ ...newForm, clinic_name: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Telefon *</label>
                  <input
                    type="tel"
                    required
                    placeholder="05XXXXXXXXX"
                    value={newForm.phone}
                    onChange={(e) => setNewForm({ ...newForm, phone: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-mono text-slate-900 focus:outline-hidden focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">E-posta</label>
                  <input
                    type="email"
                    placeholder="ornek@klinik.com"
                    value={newForm.email}
                    onChange={(e) => setNewForm({ ...newForm, email: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Şehir</label>
                  <input
                    type="text"
                    placeholder="Örn: İstanbul, Beşiktaş"
                    value={newForm.city}
                    onChange={(e) => setNewForm({ ...newForm, city: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">İlgilendiği Plan</label>
                  <select
                    value={newForm.plan}
                    onChange={(e) => setNewForm({ ...newForm, plan: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-hidden"
                  >
                    <option value="14-gun-deneme">14 Gün Deneme</option>
                    <option value="yillik-kampanya">Yıllık Plan (%33 İndirim)</option>
                    <option value="ozel-teklif">Özel Teklif / Çoklu Şube</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Talep Notu / Açıklama</label>
                <textarea
                  rows={2}
                  placeholder="Başvuru ile ilgili not..."
                  value={newForm.notes}
                  onChange={(e) => setNewForm({ ...newForm, notes: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-900 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="h-9 px-4 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="h-9 px-5 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50"
                >
                  {adding ? 'Kaydediliyor...' : 'Talebi Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
