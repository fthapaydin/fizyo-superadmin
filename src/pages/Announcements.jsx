import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/ui/Toast';
import { 
  Megaphone, Plus, Trash2, CheckCircle2, AlertTriangle, Info, Sparkles, X, Radio 
} from 'lucide-react';

const TYPES = [
  { value: 'campaign', label: 'Kampanya / Fırsat', color: 'border-purple-200 bg-purple-50 text-purple-800', icon: Sparkles },
  { value: 'info', label: 'Bilgilendirme / Güncelleme', color: 'border-blue-200 bg-blue-50 text-blue-800', icon: Info },
  { value: 'warning', label: 'Önemli Uyarı', color: 'border-amber-200 bg-amber-50 text-amber-800', icon: AlertTriangle },
  { value: 'success', label: 'Başarı / Tebrik', color: 'border-emerald-200 bg-emerald-50 text-emerald-800', icon: CheckCircle2 },
];

export default function Announcements() {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: '',
    message: '',
    type: 'campaign',
    is_active: true,
  });

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (err) {
      console.error('Duyurular yüklenemedi:', err);
      toast.error('Duyurular yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) {
      toast.error('Lütfen başlık ve mesaj alanlarını doldurunuz.');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('announcements')
        .insert([form]);

      if (error) throw error;
      setShowModal(false);
      setForm({ title: '', message: '', type: 'campaign', is_active: true });
      toast.success('Duyuru başarıyla yayınlandı!');
      fetchAnnouncements();
    } catch (err) {
      toast.error(err.message || 'Duyuru kaydedilirken hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (item) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .update({ is_active: !item.is_active })
        .eq('id', item.id);

      if (error) throw error;
      toast.success(item.is_active ? 'Duyuru yayından kaldırıldı.' : 'Duyuru canlıda yayına alındı.');
      fetchAnnouncements();
    } catch (err) {
      toast.error(err.message || 'Durum güncellenemedi.');
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`"${item.title}" duyurusunu silmek istediğinize emin misiniz?`)) return;

    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', item.id);

      if (error) throw error;
      toast.success('Duyuru başarıyla silindi.');
      fetchAnnouncements();
    } catch (err) {
      toast.error(err.message || 'Silme işlemi başarısız.');
    }
  };

  return (
    <div className="space-y-6 font-[Inter]">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Megaphone size={20} className="text-indigo-600" />
            <span>Klinik Panel İçi Duyuru &amp; Kampanya Yayını</span>
          </h2>
          <p className="text-[12px] text-gray-500 mt-0.5">
            Buradan oluşturacağınız duyurular tüm kliniklerin panellerinde anında canlı olarak yayınlanır.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[13px] font-semibold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Yeni Duyuru Yayınla</span>
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
            Duyurular yükleniyor...
          </div>
        ) : announcements.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center text-gray-400">
            Henüz duyuru bulunmuyor. Yukarıdaki butona tıklayarak ilk duyurunuzu tüm kliniklere yayınlayabilirsiniz.
          </div>
        ) : (
          announcements.map((item) => {
            const typeConfig = TYPES.find((t) => t.value === item.type) || TYPES[0];
            const Icon = typeConfig.icon;

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all bg-white shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  item.is_active ? 'border-gray-200/90' : 'border-gray-100 opacity-60 bg-gray-50/50'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${typeConfig.color}`}>
                    <Icon size={18} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-gray-900 text-[15px]">{item.title}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeConfig.color}`}>
                        {typeConfig.label}
                      </span>
                      {item.is_active ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ● Canlıda Yayında
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                          ○ Pasif
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] text-gray-600 leading-relaxed whitespace-pre-line">{item.message}</p>
                    <p className="text-[10px] text-gray-400">
                      {new Date(item.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleToggle(item)}
                    className={`h-8 px-3 rounded-lg text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      item.is_active
                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    {item.is_active ? 'Yayından Kaldır' : 'Yayına Al'}
                  </button>

                  <button
                    onClick={() => handleDelete(item)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                    title="Duyuruyu Sil"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Announcement Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 z-10 animate-in zoom-in-95 duration-200 border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div className="flex items-center gap-2">
                <Megaphone size={18} className="text-indigo-600" />
                <h3 className="text-[16px] font-bold text-gray-900">Tüm Kliniklere Duyuru Yayınla</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Duyuru Başlığı *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: 🎉 Yeni Güncelleme: 81 İl Desteği Eklendi!"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-gray-200 text-[13px] text-gray-900 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Duyuru Türü</label>
                <div className="grid grid-cols-2 gap-2">
                  {TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setForm({ ...form, type: t.value })}
                      className={`p-2.5 rounded-xl border text-[12px] font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                        form.type === t.value
                          ? `${t.color} ring-2 ring-indigo-500/20`
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <t.icon size={14} />
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Duyuru Metni *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Klinik panellerinde görüntülenecek detaylı açıklama..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 text-[13px] text-gray-900 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="text-[12px] font-medium text-gray-700">Oluşturulduğu an yayına al</span>
                </label>

                <div className="flex gap-2">
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
                    {submitting ? 'Yayınlanıyor...' : 'Duyuruyu Yayınla'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
