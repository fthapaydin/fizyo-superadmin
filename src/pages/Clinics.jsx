import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Building2, Plus, Search, Pencil, Trash2, KeyRound, Check, Copy, ExternalLink, X, ShieldAlert, Phone, Mail, MapPin 
} from 'lucide-react';

export default function Clinics({ clinics, refresh, initialAddOpen = false }) {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(initialAddOpen);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    owner_name: '',
    phone: '',
    email: '',
    password: '',
    status: 'aktif',
    plan: 'standart',
    address: '',
    notes: '',
  });

  const filtered = clinics.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.owner_name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const slugify = (text) => {
    const trMap = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', Ç: 'c', Ğ: 'g', İ: 'i', Ö: 'o', Ş: 's', Ü: 'u' };
    let slug = text.replace(/[çğıöşüÇĞİÖŞÜ]/g, (match) => trMap[match] || match);
    return slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: modalMode === 'add' && !prev.slugIsManual ? slugify(val) : prev.slug,
    }));
  };

  const openAddModal = () => {
    setModalMode('add');
    setSelectedClinic(null);
    setFormData({
      name: '',
      slug: '',
      owner_name: '',
      phone: '',
      email: '',
      password: Math.random().toString(36).slice(-8), // default random 8-char password
      status: 'aktif',
      plan: 'standart',
      address: '',
      notes: '',
    });
    setShowModal(true);
  };

  const openEditModal = (clinic) => {
    setModalMode('edit');
    setSelectedClinic(clinic);
    setFormData({
      name: clinic.name || '',
      slug: clinic.slug || '',
      owner_name: clinic.owner_name || '',
      phone: clinic.phone || '',
      email: clinic.email || '',
      password: clinic.password || '',
      status: clinic.status || 'aktif',
      plan: clinic.plan || 'standart',
      address: clinic.address || '',
      notes: clinic.notes || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.slug) {
      alert('Lütfen zorunlu alanları doldurunuz.');
      return;
    }

    setSubmitting(true);
    try {
      if (modalMode === 'add') {
        const { error } = await supabase.from('clinics').insert([
          {
            ...formData,
            email: formData.email.trim().toLowerCase(),
            slug: slugify(formData.slug),
          },
        ]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('clinics')
          .update({
            ...formData,
            email: formData.email.trim().toLowerCase(),
            slug: slugify(formData.slug),
          })
          .eq('id', selectedClinic.id);
        if (error) throw error;
      }

      setShowModal(false);
      refresh();
    } catch (err) {
      alert(err.message || 'Klinik kaydedilirken hata oluştu. E-posta veya slug benzersiz olmalıdır.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (clinic) => {
    const msg = `"${clinic.name}" kliniğini ve bu kliniğe ait TÜM hastaları, seansları ve ödemeleri kalıcı olarak silmek istediğinize emin misiniz?`;
    if (!window.confirm(msg)) return;

    try {
      const { error } = await supabase.from('clinics').delete().eq('id', clinic.id);
      if (error) throw error;
      refresh();
    } catch (err) {
      alert(err.message || 'Silme işlemi sırasında hata oluştu.');
    }
  };

  const handleToggleStatus = async (clinic) => {
    const nextStatus = clinic.status === 'aktif' ? 'pasif' : 'aktif';
    try {
      const { error } = await supabase.from('clinics').update({ status: nextStatus }).eq('id', clinic.id);
      if (error) throw error;
      refresh();
    } catch (err) {
      alert(err.message || 'Durum güncellenemedi.');
    }
  };

  const copyBookingLink = (slug, id) => {
    const url = `https://fizyo-booking.vercel.app/?clinic=${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-5 font-[Inter]">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Klinik ara (Ad, yetkili, telefon, slug)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-gray-200 text-[13px] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all shadow-2xs"
          />
        </div>

        <button
          onClick={openAddModal}
          className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[13px] font-semibold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Yeni Klinik Tanımla</span>
        </button>
      </div>

      {/* Clinics Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center text-gray-400">
            {search ? 'Aramanıza uygun klinik bulunamadı.' : 'Henüz klinik eklenmemiş. Yukarıdaki butondan yeni klinik ekleyebilirsiniz.'}
          </div>
        ) : (
          filtered.map((c) => {
            const isCopied = copiedId === c.id;
            return (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-[14px] shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-[15px]">{c.name}</h4>
                        <span className="text-[11px] text-gray-400 font-mono">slug: {c.slug}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleStatus(c)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                        c.status === 'aktif'
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-red-50 text-red-700 hover:bg-red-100'
                      }`}
                      title="Durumu değiştirmek için tıklayın"
                    >
                      {c.status === 'aktif' ? '● Aktif' : '● Pasif'}
                    </button>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 py-3 border-y border-gray-100 text-[12px] text-gray-600">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Yetkili:</span>
                      <span className="font-medium text-gray-800">{c.owner_name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Telefon:</span>
                      <span className="font-medium text-gray-800">{c.phone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Giriş E-Posta:</span>
                      <span className="font-mono text-gray-700">{c.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Giriş Şifresi:</span>
                      <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {c.password}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Paket:</span>
                      <span className="capitalize font-semibold text-emerald-700">{c.plan || 'Standart'}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-2 flex items-center justify-between gap-2">
                  <button
                    onClick={() => copyBookingLink(c.slug, c.id)}
                    className="h-8 px-2.5 rounded-lg border border-teal-200 bg-teal-50/70 hover:bg-teal-100 text-teal-700 text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Hastaların kullanacağı randevu linkini kopyala"
                  >
                    {isCopied ? <Check size={12} className="text-teal-600" /> : <Copy size={12} />}
                    <span>{isCopied ? 'Kopyalandı!' : 'Rezervasyon Linki'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(c)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer"
                      title="Kliniği Düzenle / Şifre Değiştir"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(c)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Kliniği Sil"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Clinic Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-indigo-600" />
                <h3 className="text-[16px] font-bold text-gray-900">
                  {modalMode === 'add' ? 'Yeni Klinik Tanımla' : 'Klinik Bilgilerini Düzenle'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[12px] font-semibold text-gray-600 mb-1">Klinik Adı *</label>
                  <input
                    required
                    type="text"
                    placeholder="Örn: Apaydın Fizyoterapi"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-gray-600 mb-1">
                    Özel URL Slug * <span className="text-gray-400 font-normal">(booking için)</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="apaydin-fizyo"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value, slugIsManual: true })}
                    className="input-field font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-gray-600 mb-1">Yetkili Ad Soyad *</label>
                  <input
                    required
                    type="text"
                    placeholder="Fatih Apaydın"
                    value={formData.owner_name}
                    onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-gray-600 mb-1">İletişim Telefonu *</label>
                  <input
                    required
                    type="tel"
                    placeholder="05551234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 11) })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-gray-600 mb-1">Giriş E-Postası *</label>
                  <input
                    required
                    type="email"
                    placeholder="klinik@apaydin.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-gray-600 mb-1">Giriş Şifresi *</label>
                  <input
                    required
                    type="text"
                    placeholder="Şifre"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input-field font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-gray-600 mb-1">Durum</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="input-field bg-white"
                  >
                    <option value="aktif">Aktif (Giriş Yapabilir)</option>
                    <option value="pasif">Pasif (Erişim Engelli)</option>
                    <option value="deneme">Deneme Sürümü</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[12px] font-semibold text-gray-600 mb-1">Klinik Adresi</label>
                  <input
                    type="text"
                    placeholder="Kadıköy, İstanbul"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="h-10 px-4 rounded-xl text-[13px] font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-10 px-5 rounded-xl text-[13px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Kaydediliyor...' : modalMode === 'add' ? 'Kliniği Oluştur' : 'Değişiklikleri Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
