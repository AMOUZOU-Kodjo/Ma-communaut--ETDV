// src/components/Dashboard/AdminDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, Calendar, Image, MessageSquare,
  TrendingUp, Activity, RefreshCw, Download,
  Mail, Church, BarChart3, Eye, Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../context/AuthContext';
import toast from 'react-hot-toast';

// ── Stat card ─────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, color = 'accent' }) => (
  <div className="bg-base-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-base-content/60 mb-1">{label}</p>
        <p className={`text-3xl font-bold text-${color}`}>{value ?? '—'}</p>
        {sub && <p className="text-xs text-base-content/40 mt-1">{sub}</p>}
      </div>
      <div className={`p-3 bg-${color}/10 rounded-xl`}>
        <Icon size={22} className={`text-${color}`} />
      </div>
    </div>
  </div>
);

// ── Mini bar ──────────────────────────────────────────
const MiniBar = ({ label, value, max, color }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="text-base-content/70">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
    <div className="w-full bg-base-300 h-2 rounded-full overflow-hidden">
      <div
        className={`h-2 rounded-full bg-${color} transition-all duration-500`}
        style={{ width: `${Math.min(100, max > 0 ? (value / max) * 100 : 0)}%` }}
      />
    </div>
  </div>
);

// ── Main ──────────────────────────────────────────────
const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentVisitors, setRecentVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, postsRes, visitorsRes] = await Promise.all([
        api.get('/api/stats'),
        api.get('/api/posts?limit=5'),
        api.get('/api/visitors'),
      ]);
      setStats(statsRes.data);
      setRecentPosts(postsRes.data);
      // Prendre les 5 derniers visiteurs
      setRecentVisitors((visitorsRes.data || []).slice(0, 5));
    } catch (err) {
      toast.error('Erreur lors du chargement du tableau de bord');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  // ── Export JSON ───────────────────────────────────
  const exportData = () => {
    const blob = new Blob(
      [JSON.stringify({ stats, exportDate: new Date().toISOString() }, null, 2)],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-etdv-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Données exportées');
  };

  const mediaStats = stats?.media || [];
  const totalMedia = mediaStats.reduce((s, m) => s + parseInt(m.total || 0), 0);
  const photos     = mediaStats.find(m => m.type === 'photo')?.total || 0;
  const videos     = mediaStats.find(m => m.type === 'video')?.total || 0;
  const audios     = mediaStats.find(m => m.type === 'audio')?.total || 0;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="text-base-content/60 text-sm mt-0.5">
            Bienvenue, <span className="font-medium text-accent">{user?.username}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadDashboard}
            disabled={loading}
            className="btn btn-sm btn-outline btn-accent gap-2"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Actualiser
          </button>
          <button onClick={exportData} className="btn btn-sm btn-outline gap-2">
            <Download size={15} />
            Exporter
          </button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-base-100 rounded-2xl p-5 h-28 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            icon={MessageSquare}
            label="Publications"
            value={stats?.posts?.total ?? 0}
            sub={`${stats?.posts?.featured ?? 0} en vedette`}
            color="accent"
          />
          <StatCard
            icon={Image}
            label="Médias"
            value={totalMedia}
            sub={`${photos} photos · ${videos} vidéos · ${audios} audios`}
            color="info"
          />
          <StatCard
            icon={Church}
            label="Visiteurs"
            value={stats?.visitors?.total ?? 0}
            sub={`${stats?.visitors?.nouveaux ?? 0} nouveaux`}
            color="success"
          />
          <StatCard
            icon={Mail}
            label="Messages"
            value={stats?.contacts?.total ?? 0}
            sub={`${stats?.contacts?.non_lus ?? 0} non lus`}
            color="warning"
          />
          <StatCard
            icon={Bell}
            label="Abonnés"
            value={stats?.subscribers?.total ?? 0}
            sub="Newsletter"
            color="secondary"
          />
        </div>
      )}

      {/* ── Médias par type + publications récentes ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Répartition médias */}
        <div className="bg-base-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} className="text-accent" />
            <h3 className="font-semibold">Répartition des médias</h3>
          </div>
          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[...Array(3)].map((_, i) => <div key={i} className="h-6 bg-base-300 rounded" />)}
            </div>
          ) : (
            <div className="space-y-3">
              <MiniBar label="Photos"  value={parseInt(photos)} max={totalMedia || 1} color="info" />
              <MiniBar label="Vidéos"  value={parseInt(videos)} max={totalMedia || 1} color="accent" />
              <MiniBar label="Audios"  value={parseInt(audios)} max={totalMedia || 1} color="success" />
            </div>
          )}
        </div>

        {/* Publications récentes */}
        <div className="bg-base-100 rounded-2xl p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={18} className="text-accent" />
            <h3 className="font-semibold">Publications récentes</h3>
          </div>
          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-base-300 rounded-lg" />)}
            </div>
          ) : recentPosts.length === 0 ? (
            <p className="text-base-content/40 text-sm py-4 text-center">
              Aucune publication pour le moment
            </p>
          ) : (
            <ul className="divide-y divide-base-200">
              {recentPosts.map((post) => (
                <li key={post.id} className="py-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{post.title}</p>
                    <p className="text-xs text-base-content/40">
                      {post.author || 'Anonyme'} ·{' '}
                      {new Date(post.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`badge badge-sm ${
                      post.type === 'message' ? 'badge-accent' :
                      post.type === 'news'    ? 'badge-info' : 'badge-ghost'
                    }`}>
                      {post.type}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-base-content/40">
                      <Eye size={12} /> {post.views ?? 0}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── Visiteurs récents ── */}
      <div className="bg-base-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Users size={18} className="text-accent" />
          <h3 className="font-semibold">Visiteurs récents</h3>
        </div>
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-base-300 rounded-lg" />)}
          </div>
        ) : recentVisitors.length === 0 ? (
          <p className="text-base-content/40 text-sm py-4 text-center">
            Aucun visiteur enregistré
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-sm w-full">
              <thead>
                <tr className="text-base-content/50 text-xs">
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Date visite</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentVisitors.map((v) => (
                  <tr key={v.id} className="hover">
                    <td className="font-medium">{v.nom} {v.prenom || ''}</td>
                    <td className="text-base-content/60 text-xs">{v.email || '—'}</td>
                    <td className="text-xs">
                      {v.date_visite
                        ? new Date(v.date_visite).toLocaleDateString('fr-FR')
                        : '—'}
                    </td>
                    <td>
                      <span className={`badge badge-xs ${
                        v.statut === 'nouveau'   ? 'badge-accent' :
                        v.statut === 'suivi'     ? 'badge-info'   :
                        v.statut === 'membre'    ? 'badge-success' : 'badge-ghost'
                      }`}>
                        {v.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
