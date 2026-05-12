// src/components/Dashboard/AdminGallery.jsx
// Gestion unifiée des médias (photos, vidéos, audios) connectée à l'API réelle
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image, Video, Music, Plus, Edit, Trash2, Eye, Download,
  Search, X, Upload, Loader, ChevronLeft, ChevronRight,
  Star, StarOff, RefreshCw
} from 'lucide-react';
import { api } from '../../context/AuthContext';
import toast from 'react-hot-toast';

// ── Helpers ───────────────────────────────────────────
const TYPE_CONFIG = {
  photo: { icon: Image,  label: 'Photo',  badge: 'badge-info',    bg: 'bg-info/10',    text: 'text-info' },
  video: { icon: Video,  label: 'Vidéo',  badge: 'badge-error',   bg: 'bg-error/10',   text: 'text-error' },
  audio: { icon: Music,  label: 'Audio',  badge: 'badge-success', bg: 'bg-success/10', text: 'text-success' },
};

const EMPTY_FORM = {
  title: '', description: '', type: 'photo', tags: '', featured: false,
  file: null, filePreview: null, url: '',
};

// ── Modal formulaire ──────────────────────────────────
const MediaModal = ({ media, onClose, onSaved }) => {
  const isEdit = !!media;
  const [form, setForm] = useState(
    isEdit
      ? { ...media, tags: Array.isArray(media.tags) ? media.tags.join(', ') : media.tags || '', file: null, filePreview: null }
      : { ...EMPTY_FORM }
  );
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const isLinkType = form.type === 'video' || form.type === 'audio';

  const handle = (e) => {
    const { name, value, type: t, checked } = e.target;
    setForm((p) => ({ ...p, [name]: t === 'checkbox' ? checked : value }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
    setForm((p) => ({ ...p, file, filePreview: preview }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Le titre est requis');
    if (!isEdit && !isLinkType && !form.file) return toast.error('Veuillez sélectionner un fichier');
    if (!isEdit && isLinkType && !form.url.trim()) return toast.error("Veuillez entrer l'URL");

    setSaving(true);
    try {
      if (isEdit) {
        const { data } = await api.put(`/api/media/${media.id}`, {
          title: form.title,
          description: form.description,
          tags: form.tags,
          featured: form.featured,
        });
        onSaved(data, 'edit');
        toast.success('Média mis à jour');
      } else if (isLinkType) {
        const { data } = await api.post('/api/media/link', {
          title: form.title, description: form.description,
          url: form.url, type: form.type,
          tags: form.tags, featured: form.featured,
        });
        onSaved(data, 'add');
        toast.success('Lien ajouté');
      } else {
        const fd = new FormData();
        fd.append('file', form.file);
        fd.append('title', form.title);
        fd.append('description', form.description);
        fd.append('tags', form.tags);
        fd.append('featured', form.featured);
        const { data } = await api.post('/api/media/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        onSaved(data, 'add');
        toast.success('Photo ajoutée');
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur lors de la sauvegarde');
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
        initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="bg-base-100 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold">{isEdit ? 'Modifier le média' : 'Ajouter un média'}</h2>
            <button onClick={onClose} className="p-2 hover:bg-base-200 rounded-lg"><X size={18} /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type (lecture seule en édition) */}
            {!isEdit && (
              <div>
                <label className="label-text font-medium block mb-2">Type *</label>
                <div className="flex gap-4">
                  {Object.entries(TYPE_CONFIG).map(([key, cfg]) => {
                    const Icon = cfg.icon;
                    return (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="type" value={key} checked={form.type === key} onChange={handle} className="radio radio-accent radio-sm" />
                        <Icon size={16} /><span className="text-sm">{cfg.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Fichier (nouveau seulement) */}
            {!isEdit && !isLinkType && (
              <div>
                <label className="label-text font-medium block mb-2">Fichier *</label>
                <div
                  className="border-2 border-dashed border-base-300 rounded-xl p-6 text-center cursor-pointer hover:border-accent transition-colors"
                  onClick={() => fileRef.current.click()}
                >
                  {form.filePreview ? (
                    <img src={form.filePreview} alt="preview" className="max-h-32 mx-auto rounded-lg object-cover" />
                  ) : form.file ? (
                    <p className="text-sm text-accent font-medium">{form.file.name}</p>
                  ) : (
                    <>
                      <Upload size={28} className="mx-auto text-base-content/30 mb-2" />
                      <p className="text-sm text-base-content/50">Cliquer pour sélectionner un fichier</p>
                      <p className="text-xs text-base-content/30 mt-1">JPG, PNG · max 100 MB</p>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" className="hidden" onChange={handleFile}
                  accept="image/*" />
              </div>
            )}

            {/* URL pour vidéo/audio (nouveau seulement) */}
            {!isEdit && isLinkType && (
              <div>
                <label className="label-text font-medium block mb-1">URL *</label>
                <input name="url" value={form.url} onChange={handle} required
                  className="input input-bordered w-full"
                  placeholder={form.type === 'video'
                    ? 'https://www.youtube.com/watch?v=...'
                    : 'https://soundcloud.com/...'}

                />
                <p className="text-xs text-base-content/40 mt-1">
                  {form.type === 'video'
                    ? 'Lien YouTube, Vimeo, Facebook Video...'
                    : 'Lien SoundCloud, Spotify, lecteur audio en ligne...'}
                </p>
              </div>
            )}

            {/* Titre */}
            <div>
              <label className="label-text font-medium block mb-1">Titre *</label>
              <input name="title" value={form.title} onChange={handle} required
                className="input input-bordered w-full" placeholder="Titre du média" />
            </div>

            {/* Description */}
            <div>
              <label className="label-text font-medium block mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handle} rows={3}
                className="textarea textarea-bordered w-full" placeholder="Description (optionnel)" />
            </div>

            {/* Tags */}
            <div>
              <label className="label-text font-medium block mb-1">Tags</label>
              <input name="tags" value={form.tags} onChange={handle}
                className="input input-bordered w-full" placeholder="culte, louange, enseignement" />
            </div>

            {/* Featured */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handle} className="checkbox checkbox-accent checkbox-sm" />
              <span className="text-sm">Mettre en vedette</span>
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn btn-ghost btn-sm">Annuler</button>
              <button type="submit" disabled={saving} className="btn btn-accent btn-sm gap-2">
                {saving ? <Loader size={15} className="animate-spin" /> : <Upload size={15} />}
                {isEdit ? 'Enregistrer' : 'Uploader'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Vue Media ─────────────────────────────────────────
const MediaViewModal = ({ media, onClose }) => {
  if (!media) return null;
  const cfg = TYPE_CONFIG[media.type] || TYPE_CONFIG.photo;
  const Icon = cfg.icon;
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        className="bg-base-100 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold">{media.title}</h2>
              <span className={`badge badge-sm ${cfg.badge} mt-1`}>{cfg.label}</span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-base-200 rounded-lg"><X size={18} /></button>
          </div>

          {media.type === 'photo' && (
            <img src={media.url} alt={media.title} className="w-full max-h-64 object-cover rounded-xl mb-4" />
          )}
          {media.type === 'video' && (
            media.url.includes('youtube') || media.url.includes('youtu.be') ? (
              <div className="relative w-full mb-4" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={media.url.replace('watch?v=', 'embed/').split('&')[0]}
                  className="absolute inset-0 w-full h-full rounded-xl"
                  allowFullScreen
                  title={media.title}
                />
              </div>
            ) : (
              <video src={media.url} controls className="w-full rounded-xl mb-4 max-h-64" />
            )
          )}
          {media.type === 'audio' && (
            <div className="bg-base-200 rounded-xl p-4 flex items-center gap-4 mb-4">
              <Music size={32} className="text-success" />
              {media.url.includes('soundcloud') || media.url.includes('spotify') ? (
                <iframe src={media.url} className="w-full h-20 rounded-lg" allowFullScreen title={media.title} />
              ) : (
                <audio src={media.url} controls className="flex-1" />
              )}
            </div>
          )}

          {media.description && <p className="text-base-content/70 text-sm mb-4">{media.description}</p>}

          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div className="bg-base-200 rounded-xl p-3">
              <p className="font-bold text-lg">{media.views ?? 0}</p>
              <p className="text-base-content/50">Vues</p>
            </div>
            <div className="bg-base-200 rounded-xl p-3">
              <p className="font-bold text-lg">{media.downloads ?? 0}</p>
              <p className="text-base-content/50">Téléch.</p>
            </div>
            <div className="bg-base-200 rounded-xl p-3">
              <p className="font-bold text-lg">{media.likes ?? 0}</p>
              <p className="text-base-content/50">Likes</p>
            </div>
          </div>

          {media.tags && (
            <div className="flex flex-wrap gap-2 mt-4">
              {(typeof media.tags === 'string' ? media.tags.split(',') : media.tags)
                .filter(Boolean)
                .map((t) => (
                  <span key={t} className="badge badge-ghost badge-sm">#{t.trim()}</span>
                ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Main ──────────────────────────────────────────────
const AdminGallery = () => {
  const [mediaList, setMediaList]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearch]     = useState('');
  const [page, setPage]             = useState(1);
  const [modalOpen, setModalOpen]   = useState(false);
  const [viewItem, setViewItem]     = useState(null);
  const [editItem, setEditItem]     = useState(null);
  const PER_PAGE = 12;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/media');
      setMediaList(data || []);
    } catch {
      toast.error('Impossible de charger les médias');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSaved = (saved, mode) => {
    if (mode === 'edit') {
      setMediaList((p) => p.map((m) => (m.id === saved.id ? saved : m)));
    } else {
      setMediaList((p) => [saved, ...p]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce média définitivement ?')) return;
    try {
      await api.delete(`/api/media/${id}`);
      setMediaList((p) => p.filter((m) => m.id !== id));
      toast.success('Média supprimé');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const toggleFeatured = async (item) => {
    try {
      const { data } = await api.put(`/api/media/${item.id}`, {
        title: item.title, description: item.description,
        tags: item.tags, featured: !item.featured,
      });
      setMediaList((p) => p.map((m) => (m.id === data.id ? data : m)));
      toast.success(data.featured ? 'Mis en vedette' : 'Retiré de la vedette');
    } catch {
      toast.error('Erreur');
    }
  };

  // Filter + search
  const filtered = mediaList.filter((m) => {
    const matchType = filterType === 'all' || m.type === filterType;
    const matchSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Stats
  const stats = {
    total:  mediaList.length,
    photos: mediaList.filter((m) => m.type === 'photo').length,
    videos: mediaList.filter((m) => m.type === 'video').length,
    audios: mediaList.filter((m) => m.type === 'audio').length,
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Galerie & Médias</h1>
          <p className="text-sm text-base-content/50 mt-0.5">
            {stats.total} fichier{stats.total !== 1 ? 's' : ''} au total
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} disabled={loading} className="btn btn-sm btn-ghost gap-1">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => { setEditItem(null); setModalOpen(true); }} className="btn btn-accent btn-sm gap-2">
            <Plus size={16} /> Ajouter
          </button>
        </div>
      </div>

      {/* ── Stat badges ── */}
      <div className="flex flex-wrap gap-3">
        {[
          { key: 'all',   label: `Tous (${stats.total})` },
          { key: 'photo', label: `Photos (${stats.photos})` },
          { key: 'video', label: `Vidéos (${stats.videos})` },
          { key: 'audio', label: `Audios (${stats.audios})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => { setFilterType(key); setPage(1); }}
            className={`btn btn-sm ${filterType === key ? 'btn-accent' : 'btn-ghost'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Search ── */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Rechercher..."
          className="input input-bordered input-sm w-full pl-9"
        />
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-base-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-20 text-base-content/40">
          <Image size={40} className="mx-auto mb-3 opacity-30" />
          <p>Aucun média trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginated.map((item) => {
            const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.photo;
            const Icon = cfg.icon;
            return (
              <div
                key={item.id}
                className="group relative bg-base-200 rounded-2xl overflow-hidden aspect-square"
              >
                {/* Preview */}
                {item.type === 'photo' ? (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${cfg.bg}`}>
                    <Icon size={36} className={cfg.text} />
                  </div>
                )}

                {/* Featured badge */}
                {item.featured && (
                  <span className="absolute top-2 left-2 badge badge-warning badge-xs">⭐</span>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <p className="text-white text-sm font-medium line-clamp-2">{item.title}</p>
                  <div className="flex justify-between items-end">
                    <span className={`badge badge-xs ${cfg.badge}`}>{cfg.label}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setViewItem(item)}
                        className="p-1.5 bg-white/20 hover:bg-white/40 rounded-lg text-white transition"
                        title="Voir"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => toggleFeatured(item)}
                        className="p-1.5 bg-white/20 hover:bg-white/40 rounded-lg text-white transition"
                        title="Vedette"
                      >
                        {item.featured ? <StarOff size={14} /> : <Star size={14} />}
                      </button>
                      <button
                        onClick={() => { setEditItem(item); setModalOpen(true); }}
                        className="p-1.5 bg-white/20 hover:bg-blue-500/60 rounded-lg text-white transition"
                        title="Modifier"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 bg-white/20 hover:bg-error/60 rounded-lg text-white transition"
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="btn btn-ghost btn-sm">
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-base-content/60">
            Page {page} / {totalPages}
          </span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="btn btn-ghost btn-sm">
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* ── Modals ── */}
      <AnimatePresence>
        {modalOpen && (
          <MediaModal
            media={editItem}
            onClose={() => { setModalOpen(false); setEditItem(null); }}
            onSaved={handleSaved}
          />
        )}
        {viewItem && (
          <MediaViewModal media={viewItem} onClose={() => setViewItem(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminGallery;
