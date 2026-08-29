import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clinics from './pages/Clinics';
import Announcements from './pages/Announcements';
import { Loader2 } from 'lucide-react';

const pageMeta = {
  dashboard:     { title: 'Süper Admin Dashboard',     subtitle: 'Platform geneli performans ve istatistikler' },
  clinics:       { title: 'Klinik Yönetimi',           subtitle: 'Kayıtlı klinikleri ekleyin, düzenleyin ve yönetin' },
  announcements: { title: 'Duyurular & Kampanya',      subtitle: 'Tüm klinik panellerine canlı duyuru ve kampanya yayını yapın' },
};

function App() {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('fizyo_superadmin');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  const [clinics, setClinics] = useState([]);
  const [stats, setStats] = useState({ patientCount: 0, sessionCount: 0 });
  const [loading, setLoading] = useState(false);
  const [triggerAddClinic, setTriggerAddClinic] = useState(false);

  const fetchData = async () => {
    if (!adminUser) return;
    setLoading(true);
    try {
      const [clinicsRes, patientsRes, sessionsRes] = await Promise.all([
        supabase.from('clinics').select('*').order('created_at', { ascending: false }),
        supabase.from('patients').select('id', { count: 'exact', head: true }),
        supabase.from('sessions').select('id', { count: 'exact', head: true }),
      ]);

      setClinics(clinicsRes.data || []);
      setStats({
        patientCount: patientsRes.count || 0,
        sessionCount: sessionsRes.count || 0,
      });
    } catch (err) {
      console.error('Veri çekme hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminUser) {
      fetchData();
    }
  }, [adminUser]);

  const handleLogout = () => {
    localStorage.removeItem('fizyo_superadmin');
    setAdminUser(null);
  };

  if (!adminUser) {
    return <Login onLogin={setAdminUser} />;
  }

  const meta = pageMeta[activeTab] || pageMeta.dashboard;

  return (
    <div className="flex h-screen overflow-hidden font-[Inter]">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={handleLogout}
        clinicCount={clinics.length}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          onRefresh={fetchData}
          onMenuClick={() => setMobileOpen(true)}
        />

        <main className="flex-1 overflow-y-auto bg-[#f8fafb]">
          <div className="max-w-[1300px] mx-auto p-4 md:p-8">
            {loading && clinics.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 size={32} className="text-indigo-600 animate-spin" />
              </div>
            ) : (
              <>
                {activeTab === 'dashboard' && (
                  <Dashboard
                    clinics={clinics}
                    stats={stats}
                    onNavigateClinics={() => setActiveTab('clinics')}
                    onAddClinicClick={() => {
                      setActiveTab('clinics');
                      setTriggerAddClinic(true);
                    }}
                  />
                )}
                {activeTab === 'clinics' && (
                  <Clinics
                    clinics={clinics}
                    refresh={fetchData}
                    initialAddOpen={triggerAddClinic}
                  />
                )}
                {activeTab === 'announcements' && (
                  <Announcements />
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
