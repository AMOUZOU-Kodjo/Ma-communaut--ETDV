// src/components/Dashboard/EventsManager.jsx
// Gestion des publications : messages, actualités, versets — connecté à /api/posts
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Plus, Edit, Trash2, Eye, Search,
  X, Loader, RefreshCw, Star, StarOff, MessageSquare,
  Newspaper, BookOpen, ChevronLeft, ChevronRight
} from 'lucide-react';
import { api } from '../../context/AuthContext';
import toast from 'react-hot-toast';

// ── Config types ──────────────────────────────────────
const TYPE_CONFIG = {
  message: { label: 'Message',    icon: MessageSquare, badge: 'badge-accent' },
  news:    { label: 'Actualité',  icon: Newspaper,     badge: 'badge-info' },
  verse:   { label: 'Verset',     icon: BookOpen,      badge: 'badge-ghost' },
};

const EMPTY_FORM = { title: '', content: '', type: 'message', author: '', featured: false };

// ── Modal ─────────────────────────────────────────────
const PostModal = ({ post, onClose, onSaved }) => {
  const isEdit = !!post;
  const [form, setForm] = useState(isEdit ? { ...post } : { ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      return toast.error('Titre et contenu sont requis');
    }
    setSaving(true);
    try {
      if (isEdit) {
        const { data } = await api.put(`/api/posts/${post.id}`, form);
        onSaved(data, 'edit');
        toast.success('Publication mise à jour');
      } else {
        const { data } = await api.post('/api/posts', form);
        onSaved(data, 'add');
        toast.success('Publication créée');
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur');
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
        className="bg-base-100 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{isEdit ? 'Modifier' : 'Nouvelle publication'}</h2>
            <button onClick={onClose} className="p-2 hover:bg-base-200 rounded-lg"><X size={18} /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type */}
            <div>
              <label className="label-text font-medium block mb-2">Type *</label>
              <div className="flex gap-3">
                {Object.entries(TYPE_CONFIG).map(([key, cfg]) => {
                  const Icon = cfg.icon;
                  return (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="type" value={key} checked={form.type === key}
                        onChange={handle} className="radio radio-accent radio-sm" />
                      <Icon size={15} />
                      <span className="text-sm">{cfg.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="label-text font-medium block mb-1">Titre *</label>
              <input name="title" value={form.title} onChange={handle} required
                className="input input-bordered w-full" placeholder="Titre de la publication" />
            </div>

            <div>
              <label className="label-text font-medium block mb-1">Auteur</label>
              <input name="author" value={form.author || ''} onChange={handle}
                className="input input-bordered w-full" placeholder="Nom de l'auteur" />
            </div>

            <div>
              <label className="label-text font-medium block mb-1">Contenu *</label>
              <textarea name="content" value={form.content} onChange={handle} rows={6} required
                className="textarea textarea-bordered w-full"
                placeholder="Contenu de la publication..." />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="featured" checked={!!form.featured} onChange={handle}
                className="checkbox checkbox-accent checkbox-sm" />
              <span className="text-sm">Mettre en vedette</span>
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn btn-ghost btn-sm">Annuler</button>
              <button type="submit" disabled={saving} className="btn btn-accent btn-sm gap-2">
                {saving ? <Loader size={14} className="animate-spin" /> : null}
                {isEdit ? 'Enregistrer' : 'Publier'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── View modal ────────────────────────────────────────
const ViewModal = ({ post, onClose }) => {
  if (!post) return null;
  const cfg = TYPE_CONFIG[post.type] || TYPE_CONFIG.message;
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93 }} animate={{ scale: 1 }}
        className="bg-base-100 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className={`badge badge-sm ${cfg.badge} mb-2`}>{cfg.label}</span>
              <h2 className="text-xl font-bold">{post.title}</h2>
              <p className="text-xs text-base-content/50 mt-1">
                {post.author || 'Anonyme'} · {new Date(post.date).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-base-200 rounded-lg flex-shrink-0">
              <X size={18} />
            </button>
          </div>
          <p className="text-base-content/80 whitespace-pre-wrap text-sm leading-relaxed">
            {post.content}
          </p>
          <div className="flex gap-4 text-sm text-base-content/50 border-t border-base-200 pt-3">
            <span>{post.views ?? 0} vues</span>
            <span>{post.likes ?? 0} likes</span>
            {post.featured && <span className="text-warning">⭐ En vedette</span>}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Main ──────────────────────────────────────────────
const EventsManager = () => {
  const [posts, setPosts]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch]         = useState('');
  const [page, setPage]             = useState(1);
  const [modalPost, setModalPost]   = useState(null);   // null = new, object = edit
  const [modalOpen, setModalOpen]   = useState(false);
  const [viewPost, setViewPost]     = useState(null);
  const PER_PAGE = 10;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/posts');
      setPosts(data || []);
    } catch {
      toast.error('Impossible de charger les publications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSaved = (saved, mode) => {
    if (mode === 'edit') setPosts((p) => p.map((x) => (x.id === saved.id ? saved : x)));
    else setPosts((p) => [saved, ...p]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette publication ?')) return;
    try {
      await api.delete(`/api/posts/${id}`);
      setPosts((p) => p.filter((x) => x.id !== id));
      toast.success('Publication supprimée');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const toggleFeatured = async (post) => {
    try {
      const { data } = await api.put(`/api/posts/${post.id}`, { ...post, featured: !post.featured });
      setPosts((p) => p.map((x) => (x.id === data.id ? data : x)));
    } catch {
      toast.error('Erreur');
    }
  };

  // Filter
  const filtered = posts.filter((p) => {
    const matchType   = filterType === 'all' || p.type === filterType;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                        (p.author || '').toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const counts = {
    all:     posts.length,
    message: posts.filter((p) => p.type === 'message').length,
    news:    posts.filter((p) => p.type === 'news').length,
    verse:   posts.filter((p) => p.type === 'verse').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Publications</h1>
          <p className="text-sm text-base-content/50 mt-0.5">{counts.all} publication{counts.all !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} disabled={loading} className="btn btn-ghost btn-sm">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => { setModalPost(null); setModalOpen(true); }} className="btn btn-accent btn-sm gap-2">
            <Plus size={16} /> Nouvelle publication
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        {Object.entries({ all: `Tous (${counts.all})`, ...Object.fromEntries(
          Object.entries(TYPE_CONFIG).map(([k, v]) => [k, `${v.label} (${counts[k]})`])
        )}).map(([key, label]) => (
          <button key={key} onClick={() => { setFilterType(key); setPage(1); }}
            className={`btn btn-sm ${filterType === key ? 'btn-accent' : 'btn-ghost'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
        <input type="text" value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Rechercher par titre ou auteur..."
          className="input input-bordered input-sm w-full pl-9" />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader size={28} className="animate-spin text-accent" />
        </div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-20 text-base-content/40">
          <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
          <p>Aucune publication trouvée</p>
        </div>
      ) : (
        <div className="bg-base-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="table w-full">
            <thead className="bg-base-200 text-xs text-base-content/50 uppercase">
              <tr>
                <th>Titre</th>
                <th>Type</th>
                <th>Auteur</th>
                <th>Date</th>
                <th>Stats</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((post) => {
                const cfg = TYPE_CONFIG[post.type] || TYPE_CONFIG.message;
                return (
                  <tr key={post.id} className="hover border-b border-base-200">
                    <td>
                      <div className="flex items-center gap-2">
                        {post.featured && <Star size={13} className="text-warning flex-shrink-0" />}
                        <span className="font-medium text-sm line-clamp-1">{post.title}</span>
                      </div>
                    </td>
                    <td><span className={`badge badge-xs ${cfg.badge}`}>{cfg.label}</span></td>
                    <td className="text-sm text-base-content/60">{post.author || '—'}</td>
                    <td className="text-xs text-base-content/50">
                      {new Date(post.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="text-xs text-base-content/40">
                      {post.views ?? 0} vues · {post.likes ?? 0} likes
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setViewPost(post)}
                          className="btn btn-ghost btn-xs" title="Voir"><Eye size={14} /></button>
                        <button onClick={() => toggleFeatured(post)}
                          className="btn btn-ghost btn-xs text-warning" title="Vedette">
                          {post.featured ? <StarOff size={14} /> : <Star size={14} />}
                        </button>
                        <button onClick={() => { setModalPost(post); setModalOpen(true); }}
                          className="btn btn-ghost btn-xs text-info" title="Modifier">
                          <Edit size={14} />
                        </button>
                        <button onClick={() => handleDelete(post.id)}
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

      {/* Modals */}
      <AnimatePresence>
        {modalOpen && (
          <PostModal
            post={modalPost}
            onClose={() => { setModalOpen(false); setModalPost(null); }}
            onSaved={handleSaved}
          />
        )}
        {viewPost && <ViewModal post={viewPost} onClose={() => setViewPost(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default EventsManager;
