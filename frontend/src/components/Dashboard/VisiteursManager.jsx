// src/components/Dashboard/VisiteursManager.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Church, Search, RefreshCw, Trash2, Eye,
  X, Loader, ChevronLeft, ChevronRight,
  User, Mail, Phone, MessageSquare, Calendar
} from 'lucide-react';
import { api } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const STATUT_CONFIG = {
  nouveau:  { label: 'Nouveau',  badge: 'badge-accent'  },
  suivi:    { label: 'Suivi',    badge: 'badge-info'    },
  membre:   { label: 'Membre',   badge: 'badge-success' },
  inactif:  { label: 'Inactif',  badge: 'badge-ghost'   },
};

// ── Modal détail visiteur ─────────────────────────────
const ViewModal = ({ visiteur, onClose, onStatusChange }) => {
  const [statut, setStatut] = useState(visiteur.statut || 'nouveau');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put(`/api/visitors/${visiteur.id}`, { statut });
      onStatusChange(data);
      toast.success('Statut mis à jour');
      onClose();
    } catch {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.93, opacity: 0 }}
        className="bg-base-100 rounded-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Détail du visiteur</h2>
            <button onClick={onClose} className="p-2 hover:bg-base-200 rounded-lg"><X size={18} /></button>
          </div>

          {/* Infos */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-xl">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {visiteur.nom.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{visiteur.nom} {visiteur.prenom || ''}</p>
                <span className={`badge badge-xs ${STATUT_CONFIG[visiteur.statut]?.badge || 'badge-ghost'}`}>
                  {STATUT_CONFIG[visiteur.statut]?.label || visiteur.statut}
                </span>
              </div>
            </div>

            {visiteur.email && (
              <div className="flex items-center gap-2 text-sm text-base-content/70">
                <Mail size={14} className="text-accent flex-shrink-0" />
                <span>{visiteur.email}</span>
              </div>
            )}
            {visiteur.telephone && (
              <div className="flex items-center gap-2 text-sm text-base-content/70">
                <Phone size={14} className="text-accent flex-shrink-0" />
                <span>{visiteur.telephone}</span>
              </div>
            )}
            {visiteur.date_visite && (
              <div className="flex items-center gap-2 text-sm text-base-content/70">
                <Calendar size={14} className="text-accent flex-shrink-0" />
                <span>Visite le {new Date(visiteur.date_visite).toLocaleDateString('fr-FR')}</span>
              </div>
            )}
            {visiteur.message && (
              <div className="p-3 bg-base-200 rounded-xl">
                <p className="text-xs text-base-content/50 mb-1 flex items-center gap-1">
                  <MessageSquare size={12} /> Message
                </p>
                <p className="text-sm">{visiteur.message}</p>
              </div>
            )}
          </div>

          {/* Changer statut */}
          <div>
            <label className="label-text font-medium block mb-2">Changer le statut</label>
            <select value={statut} onChange={(e) => setStatut(e.target.value)}
              className="select select-bordered w-full select-sm">
              {Object.entries(STATUT_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="btn btn-ghost btn-sm">Fermer</button>
            <button onClick={handleSave} disabled={saving || statut === visiteur.statut}
              className="btn btn-accent btn-sm gap-2">
              {saving && <Loader size={14} className="animate-spin" />}
              Enregistrer
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Main ──────────────────────────────────────────────
const VisiteursManager = () => {
  const [visiteurs, setVisiteurs] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filterStatut, setFilter] = useState('all');
  const [viewItem, setViewItem]   = useState(null);
  const [page, setPage]           = useState(1);
  const PER_PAGE = 15;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/visitors');
      setVisiteurs(data || []);
    } catch {
      toast.error('Impossible de charger les visiteurs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce visiteur ?')) return;
    try {
      await api.delete(`/api/visitors/${id}`);
      setVisiteurs((p) => p.filter((v) => v.id !== id));
      toast.success('Visiteur supprimé');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleStatusChange = (updated) => {
    setVisiteurs((p) => p.map((v) => (v.id === updated.id ? updated : v)));
  };

  // Filtres
  const filtered = visiteurs.filter((v) => {
    const matchStatut = filterStatut === 'all' || v.statut === filterStatut;
    const matchSearch =
      v.nom.toLowerCase().includes(search.toLowerCase()) ||
      (v.prenom || '').toLowerCase().includes(search.toLowerCase()) ||
      (v.email || '').toLowerCase().includes(search.toLowerCase());
    return matchStatut && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const counts = {
    all: visiteurs.length,
    ...Object.fromEntries(
      Object.keys(STATUT_CONFIG).map((k) => [k, visiteurs.filter((v) => v.statut === k).length])
    ),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Visiteurs</h1>
          <p className="text-sm text-base-content/50 mt-0.5">
            {counts.all} visiteur{counts.all !== 1 ? 's' : ''} enregistré{counts.all !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={load} disabled={loading} className="btn btn-ghost btn-sm gap-2">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Actualiser
        </button>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(STATUT_CONFIG).map(([key, cfg]) => (
          <div key={key} className="bg-base-100 rounded-xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-accent">{counts[key] ?? 0}</p>
            <span className={`badge badge-sm ${cfg.badge} mt-1`}>{cfg.label}</span>
          </div>
        ))}
      </div>

      {/* Filtres + Search */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Nom, prénom, email..."
            className="input input-bordered input-sm pl-9 w-56" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[['all', `Tous (${counts.all})`], ...Object.entries(STATUT_CONFIG).map(([k, v]) => [k, `${v.label} (${counts[k] ?? 0})`])].map(([key, label]) => (
            <button key={key} onClick={() => { setFilter(key); setPage(1); }}
              className={`btn btn-xs ${filterStatut === key ? 'btn-accent' : 'btn-ghost'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader size={28} className="animate-spin text-accent" /></div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-20 text-base-content/40">
          <Church size={40} className="mx-auto mb-3 opacity-30" />
          <p>Aucun visiteur trouvé</p>
        </div>
      ) : (
        <div className="bg-base-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="table w-full">
            <thead className="bg-base-200 text-xs text-base-content/50 uppercase">
              <tr>
                <th>Visiteur</th>
                <th>Contact</th>
                <th>Date visite</th>
                <th>Statut</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((v) => {
                const cfg = STATUT_CONFIG[v.statut] || STATUT_CONFIG.nouveau;
                return (
                  <tr key={v.id} className="hover border-b border-base-200">
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center text-accent text-xs font-bold flex-shrink-0">
                          {v.nom.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{v.nom} {v.prenom || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-xs text-base-content/60">
                      {v.email && <p>{v.email}</p>}
                      {v.telephone && <p>{v.telephone}</p>}
                      {!v.email && !v.telephone && <span className="text-base-content/30">—</span>}
                    </td>
                    <td className="text-xs text-base-content/50">
                      {v.date_visite ? new Date(v.date_visite).toLocaleDateString('fr-FR') : '—'}
                    </td>
                    <td>
                      <span className={`badge badge-sm ${cfg.badge}`}>{cfg.label}</span>
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setViewItem(v)}
                          className="btn btn-ghost btn-xs text-info" title="Voir / Modifier statut">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => handleDelete(v.id)}
                          className="btn btn-ghost btn-xs text-error" title="Supprimer">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="btn btn-ghost btn-sm"><ChevronLeft size={16} /></button>
          <span className="text-sm text-base-content/60">Page {page} / {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="btn btn-ghost btn-sm"><ChevronRight size={16} /></button>
        </div>
      )}

      <AnimatePresence>
        {viewItem && (
          <ViewModal
            visiteur={viewItem}
            onClose={() => setViewItem(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default VisiteursManager;
