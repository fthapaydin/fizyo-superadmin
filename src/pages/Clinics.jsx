import { useState, useEffect } from 'react';
import { useToast } from '../components/ui/Toast';
import { supabase } from '../lib/supabase';
import { TURKEY_CITIES } from '../lib/turkeyCities';
import QRCodeModal from '../components/QRCodeModal';
import { 
  Building2, Plus, Search, Pencil, Trash2, Check, Copy, ExternalLink, X, MapPin, QrCode,
  Eye, EyeOff
} from 'lucide-react';

export default function Clinics({ clinics, refresh, initialAddOpen = false, initialData = null }) {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(initialAddOpen || !!initialData);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [qrModalClinic, setQrModalClinic] = useState(null);
  const [showModalPassword, setShowModalPassword] = useState(false);
  const [visiblePassIds, setVisiblePassIds] = useState({});

  const togglePassVisibility = (id) => {
    setVisiblePassIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    owner_name: '',
    phone: '',
    email: '',
    password: '',
    status: 'aktif',
    plan: 'standart',
    city: 'İstanbul',
    district: 'Kadıköy',
    address: '',
    theme_color: '#059669',
    logo_url: '',
    notes: '',
  });

  const selectedCityObj = TURKEY_CITIES.find((c) => c.name === formData.city) || TURKEY_CITIES[0];

  const filtered = clinics.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.owner_name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.slug.toLowerCase().includes(search.toLowerCase()) ||
      (c.city && c.city.toLowerCase().includes(search.toLowerCase())) ||
      (c.district && c.district.toLowerCase().includes(search.toLowerCase()))
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

  useEffect(() => {
    if (initialAddOpen) {
      setShowModal(true);
      setModalMode('add');
    }
  }, [initialAddOpen]);

  useEffect(() => {
    if (initialData) {
      const cityCandidate = initialData.city ? initialData.city.split(',')[0].trim() : 'İstanbul';
      const matchedCity = TURKEY_CITIES.find(c => c.name.toLowerCase() === cityCandidate.toLowerCase()) || TURKEY_CITIES[0];
      const districtCandidate = initialData.city && initialData.city.split(',')[1] ? initialData.city.split(',')[1].trim() : (matchedCity.districts[0] || 'Kadıköy');

      setFormData({
        name: initialData.clinic_name || '',
        slug: slugify(initialData.clinic_name || ''),
        owner_name: initialData.full_name || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        password: 'demo' + Math.floor(100 + Math.random() * 900),
        status: initialData.plan === '14-gun-deneme' ? 'deneme' : 'aktif',
        plan: initialData.plan === 'yillik-kampanya' ? 'kurumsal' : 'standart',
        city: matchedCity.name,
        district: districtCandidate,
        address: '',
        theme_color: '#059669',
        logo_url: '',
        notes: initialData.notes ? `[Demo Başvuru Notu]: ${initialData.notes}` : '',
      });
      setModalMode('add');
      setShowModal(true);
    }
  }, [initialData]);

  const handleNameChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: modalMode === 'add' && !prev.slugIsManual ? slugify(val) : prev.slug,
    }));
  };

  const handleCityChange = (cityName) => {
    const cityObj = TURKEY_CITIES.find((c) => c.name === cityName);
    setFormData((prev) => ({
      ...prev,
      city: cityName,
      district: cityObj?.districts[0] || 'Merkez',
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
      password: Math.random().toString(36).slice(-8),
      status: 'aktif',
      plan: 'standart',
      city: 'İstanbul',
      district: 'Kadıköy',
      address: '',
      theme_color: '#059669',
      logo_url: '',
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
      city: clinic.city || 'İstanbul',
      district: clinic.district || 'Kadıköy',
      address: clinic.address || '',
      theme_color: clinic.theme_color || '#059669',
      logo_url: clinic.logo_url || '',
      notes: clinic.notes || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.slug) {
      toast.error('Lütfen zorunlu alanları doldurunuz.');
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
      toast.error(err.message || 'Klinik kaydedilirken hata oluştu. E-posta veya slug benzersiz olmalıdır.');
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
      toast.error(err.message || 'Silme işlemi sırasında hata oluştu.');
    }
  };

  const handleToggleStatus = async (clinic) => {
    const nextStatus = clinic.status === 'aktif' ? 'pasif' : 'aktif';
    try {
      const { error } = await supabase.from('clinics').update({ status: nextStatus }).eq('id', clinic.id);
      if (error) throw error;
      refresh();
    } catch (err) {
      toast.error(err.message || 'Durum güncellenemedi.');
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
            placeholder="Klinik veya İl/İlçe ara (İstanbul, Kadıköy)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-gray-200 text-[13px] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all shadow-2xs"
          />
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[12px] font-semibold transition-colors cursor-pointer shadow-2xs"
        >
          <Plus size={14} />
          <span>+ Yeni Klinik Tanımla</span>
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
              <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {c.logo_url ? (
                        <img src={c.logo_url} alt="Logo" className="w-10 h-10 rounded-lg object-contain border border-slate-200 p-1" />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center font-bold text-[14px] shrink-0"
                        >
                          {c.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-slate-900 text-[14px]">{c.name}</h4>
                        <span className="text-[11px] text-slate-400 font-mono">slug: {c.slug}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleStatus(c)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                        c.status === 'aktif'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                      title="Durumu değiştirmek için tıklayın"
                    >
                      {c.status === 'aktif' ? 'Aktif' : 'Pasif'}
                    </button>
                  </div>

                  {/* Location Badge */}
                  <div className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded w-fit mb-3">
                    <span>{c.city || 'Belirtilmedi'}</span>
                    {c.district && <span> / {c.district}</span>}
                  </div>

                  {/* Details */}
                  <div className="space-y-2 py-3 border-y border-slate-100 text-[12px] text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Yetkili:</span>
                      <span className="font-medium text-slate-800">{c.owner_name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Telefon:</span>
                      <span className="font-medium text-slate-800">{c.phone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Giriş E-Posta:</span>
                      <span className="font-mono text-slate-700">{c.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Giriş Şifresi:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[12px]">
                          {visiblePassIds[c.id] ? c.password : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePassVisibility(c.id)}
                          className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                          title={visiblePassIds[c.id] ? "Şifreyi Gizle" : "Şifreyi Göster"}
                        >
                          {visiblePassIds[c.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => copyBookingLink(c.slug, c.id)}
                      className="h-7 px-2.5 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                      title="Hastaların kullanacağı randevu linkini kopyala"
                    >
                      {isCopied ? 'Kopyalandı' : 'Randevu Linki'}
                    </button>

                    <button
                      onClick={() => setQrModalClinic(c)}
                      className="h-7 px-2.5 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                      title="Masaüstü QR Standını Görüntüle ve Yazdır"
                    >
                      QR Standı
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(c)}
                      className="px-2 py-1 rounded text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(c)}
                      className="px-2 py-1 rounded text-[11px] font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      Sil
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

                {/* İl & İlçe Seçimi */}
                <div>
                  <label className="block text-[12px] font-semibold text-gray-600 mb-1">Şehir (İl) *</label>
                  <select
                    value={formData.city}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="input-field bg-white"
                  >
                    {TURKEY_CITIES.map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-gray-600 mb-1">İlçe *</label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="input-field bg-white"
                  >
                    {selectedCityObj.districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
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
                  <div className="relative">
                    <input
                      required
                      type={showModalPassword ? "text" : "password"}
                      placeholder="Şifre"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="input-field font-mono pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowModalPassword(!showModalPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                      title={showModalPassword ? "Şifreyi Gizle" : "Şifreyi Göster"}
                    >
                      {showModalPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
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

                <div>
                  <label className="block text-[12px] font-semibold text-gray-600 mb-1">Tema Rengi</label>
                  <select
                    value={formData.theme_color || '#059669'}
                    onChange={(e) => setFormData({ ...formData, theme_color: e.target.value })}
                    className="input-field bg-white"
                  >
                    <option value="#059669">Zümrüt Yeşili (#059669)</option>
                    <option value="#2563eb">Mavi (#2563eb)</option>
                    <option value="#4f46e5">İndigo (#4f46e5)</option>
                    <option value="#7c3aed">Mor (#7c3aed)</option>
                    <option value="#0d9488">Teal (#0d9488)</option>
                    <option value="#ea580c">Turuncu (#ea580c)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-gray-600 mb-1">Logo URL (İsteğe Bağlı)</label>
                  <input
                    type="url"
                    placeholder="https://.../logo.png"
                    value={formData.logo_url || ''}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[12px] font-semibold text-gray-600 mb-1">Açık Adres</label>
                  <input
                    type="text"
                    placeholder="Mahalle, Cadde, No..."
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

      {/* QR Code Stand Modal */}
      {qrModalClinic && (
        <QRCodeModal clinic={qrModalClinic} onClose={() => setQrModalClinic(null)} />
      )}
    </div>
  );
}
