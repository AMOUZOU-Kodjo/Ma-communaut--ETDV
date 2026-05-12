// src/components/Dashboard/CommunityDashboard.jsx
// Vue publique des statistiques de la communauté — données depuis l'API
import React, { useState, useEffect, useCallback } from 'react';
import { Users, TrendingUp, Activity, Calendar, RefreshCw, Loader } from 'lucide-react';
import { api } from '../../context/AuthContext';
import toast from 'react-hot-toast';

// ── Stat card ─────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color = 'accent' }) => (
  <div className="bg-base-100 rounded-2xl p-5 shadow-sm text-center">
    <div className={`inline-flex p-3 rounded-xl bg-${color}/10 mb-3`}>
      <Icon size={22} className={`text-${color}`} />
    </div>
    <p className={`text-3xl font-bold text-${color}`}>{value ?? '—'}</p>
    <p className="text-sm text-base-content/60 mt-1">{label}</p>
  </div>
);

// ── Bar chart ─────────────────────────────────────────
const HorizontalBar = ({ label, value, total, color }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-base-content/70">{label}</span>
        <span className="font-semibold">{value} <span className="text-base-content/40 text-xs">({pct}%)</span></span>
      </div>
      <div className="w-full bg-base-300 h-3 rounded-full overflow-hidden">
        <div
          className={`h-3 rounded-full bg-${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────
const CommunityDashboard = () => {
  const [stats, setStats]       = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading]   = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, visitorsRes] = await Promise.all([
        api.get('/api/stats'),
        api.get('/api/visitors'),
      ]);
      setStats(statsRes.data);
      setVisitors(visitorsRes.data || []);
    } catch {
      toast.error('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Calcul des stats visiteurs
  const totalVisiteurs = visitors.length;
  const statutCounts = visitors.reduce((acc, v) => {
    acc[v.statut || 'nouveau'] = (acc[v.statut || 'nouveau'] || 0) + 1;
    return acc;
  }, {});

  // Visiteurs par mois (6 derniers mois)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

  const byMonth = visitors
    .filter((v) => v.created_at && new Date(v.created_at) >= sixMonthsAgo)
    .reduce((acc, v) => {
      const d = new Date(v.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

  const monthLabels = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
    monthLabels.push({ key, label, count: byMonth[key] || 0 });
  }

  const maxMonth = Math.max(...monthLabels.map((m) => m.count), 1);

  // Stats médias
  const mediaStats = stats?.media || [];
  const totalMedia = mediaStats.reduce((s, m) => s + parseInt(m.total || 0), 0);

  const STATUT_COLORS = {
    nouveau:  { label: 'Nouveaux',   color: 'accent'  },
    suivi:    { label: 'Suivis',     color: 'info'    },
    membre:   { label: 'Membres',    color: 'success' },
    inactif:  { label: 'Inactifs',   color: 'ghost'   },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size={32} className="animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tableau communautaire</h1>
          <p className="text-sm text-base-content/50 mt-0.5">Vue d'ensemble de la communauté</p>
        </div>
        <button onClick={load} className="btn btn-ghost btn-sm gap-2">
          <RefreshCw size={15} /> Actualiser
        </button>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users}     label="Visiteurs enregistrés" value={totalVisiteurs}           color="accent"  />
        <StatCard icon={TrendingUp} label="Publications"         value={stats?.posts?.total ?? 0} color="info"    />
        <StatCard icon={Activity}  label="Médias en ligne"       value={totalMedia}               color="success" />
        <StatCard icon={Calendar}  label="Programmes"            value={stats?.programs?.total ?? 0} color="warning" />
      </div>

      {/* Répartition visiteurs + évolution mensuelle */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Répartition par statut */}
        <div className="bg-base-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Users size={16} className="text-accent" /> Répartition des visiteurs
          </h3>
          {totalVisiteurs === 0 ? (
            <p className="text-base-content/40 text-sm py-6 text-center">Aucun visiteur enregistré</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(STATUT_COLORS).map(([key, { label, color }]) => (
                <HorizontalBar
                  key={key}
                  label={label}
                  value={statutCounts[key] || 0}
                  total={totalVisiteurs}
                  color={color}
                />
              ))}
              <div className="pt-3 border-t border-base-200 text-sm text-base-content/50 text-right">
                Total : <span className="font-bold text-accent">{totalVisiteurs}</span> visiteurs
              </div>
            </div>
          )}
        </div>

        {/* Évolution mensuelle */}
        <div className="bg-base-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-accent" /> Nouveaux visiteurs (6 mois)
          </h3>
          <div className="flex items-end justify-between gap-2 h-36">
            {monthLabels.map(({ key, label, count }) => (
              <div key={key} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-medium text-accent">{count > 0 ? count : ''}</span>
                <div className="w-full relative flex items-end" style={{ height: '80px' }}>
                  <div
                    className="w-full bg-accent/80 rounded-t-md transition-all duration-700"
                    style={{ height: `${Math.max(4, (count / maxMonth) * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-base-content/50">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Publications par type */}
      <div className="bg-base-100 rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Activity size={16} className="text-accent" /> Contenus publiés
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Messages',   value: stats?.posts?.total ?? 0,    color: 'accent'  },
            { label: 'Médias',     value: totalMedia,                  color: 'info'    },
            { label: 'Programmes', value: stats?.programs?.total ?? 0, color: 'success' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`bg-${color}/10 rounded-xl p-4 text-center`}>
              <p className={`text-3xl font-bold text-${color}`}>{value}</p>
              <p className="text-sm text-base-content/60 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Messages de contact */}
      {stats?.contacts && (
        <div className="bg-base-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Activity size={16} className="text-accent" /> Messages de contact
          </h3>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">{stats.contacts.total ?? 0}</p>
              <p className="text-xs text-base-content/50">Total</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-warning">{stats.contacts.non_lus ?? 0}</p>
              <p className="text-xs text-base-content/50">Non lus</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityDashboard;
