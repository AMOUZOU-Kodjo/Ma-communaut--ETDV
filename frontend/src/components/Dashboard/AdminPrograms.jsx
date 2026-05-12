import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Plus, Edit, Trash2, Eye, Search,
  X, Loader, RefreshCw, Star, Clock, MapPin,
  ChevronLeft, ChevronRight, Users, BookOpen
} from 'lucide-react';
import { api } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: 'weekly',  label: 'Hebdomadaire' },
  { value: 'monthly', label: 'Mensuel' },
  { value: 'annual',  label: 'Annuel' },
];

const EMPTY_FORM = {
  title: '', description: '', long_description: '', day: '', time: '',
  location: '', category: 'weekly', type: '', week: '', month: '',
  dates: '', capacity: '', leaders: '', highlights: '', color: 'accent', icon: '',
};

const COLORS = [
  { value: 'accent', label: 'Accent', class: 'bg-accent' },
  { value: 'primary', label: 'Primary', class: 'bg-primary' },
  { value: 'secondary', label: 'Secondary', class: 'bg-secondary' },
  { value: 'info', label: 'Info', class: 'bg-info' },
  { value: 'success', label: 'Success', class: 'bg-success' },
  { value: 'warning', label: 'Warning', class: 'bg-warning' },
  { value: 'error', label: 'Error', class: 'bg-error' },
];

const ProgramModal = ({ program, onClose, onSaved }) => {
  const isEdit = !!program;
  const [form, setForm] = useState(isEdit ? { ...program } : { ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Le titre est requis');
    setSaving(true);
    try {
      const payload = {
        ...form,
        leaders: form.leaders ? form.leaders.split(',').map((s) => s.trim()).filter(Boolean) : [],
        highlights: form.highlights ? form.highlights.split(',').map((s) => s.trim()).filter(Boolean) : [],
      };
      if (isEdit) {
        const { data } = await api.put(`/api/programs/${program.id}`, payload);
        onSaved(data, 'edit');
        toast.success('Programme mis à jour');
      } else {
        const { data } = await api.post('/api/programs', payload);
        onSaved(data, 'add');
        toast.success('Programme créé');
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
        className="bg-base-100 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{isEdit ? 'Modifier' : 'Nouveau programme'}</h2>
            <button onClick={onClose} className="p-2 hover:bg-base-200 rounded-lg"><X size={18} /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-text font-medium block mb-1">Catégorie *</label>
                <select name="category" value={form.category} onChange={handle}
                  className="select select-bordered w-full select-sm">
                  {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label-text font-medium block mb-1">Couleur</label>
                <select name="color" value={form.color} onChange={handle}
                  className="select select-bordered w-full select-sm">
                  {COLORS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="label-text font-medium block mb-1">Titre *</label>
              <input name="title" value={form.title} onChange={handle} required
                className="input input-bordered w-full" placeholder="Titre du programme" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-text font-medium block mb-1">Jour</label>
                <input name="day" value={form.day || ''} onChange={handle}
                  className="input input-bordered w-full input-sm" placeholder="Ex: Dimanche" />
              </div>
              <div>
                <label className="label-text font-medium block mb-1">Horaire</label>
                <input name="time" value={form.time || ''} onChange={handle}
                  className="input input-bordered w-full input-sm" placeholder="Ex: 9h00 - 12h00" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-text font-medium block mb-1">Lieu</label>
                <input name="location" value={form.location || ''} onChange={handle}
                  className="input input-bordered w-full input-sm" placeholder="Ex: Salle principale" />
              </div>
              <div>
                <label className="label-text font-medium block mb-1">Capacité</label>
                <input name="capacity" value={form.capacity || ''} onChange={handle}
                  className="input input-bordered w-full input-sm" placeholder="Ex: 100 personnes" />
              </div>
            </div>

            <div>
              <label className="label-text font-medium block mb-1">Description</label>
              <textarea name="description" value={form.description || ''} onChange={handle} rows={3}
                className="textarea textarea-bordered w-full" placeholder="Brève description..." />
            </div>

            <div>
              <label className="label-text font-medium block mb-1">Description détaillée</label>
              <textarea name="long_description" value={form.long_description || ''} onChange={handle} rows={4}
                className="textarea textarea-bordered w-full" placeholder="Description complète..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-text font-medium block mb-1">Semaine</label>
                <input name="week" value={form.week || ''} onChange={handle}
                  className="input input-bordered w-full input-sm" placeholder="Ex: Semaine 1" />
              </div>
              <div>
                <label className="label-text font-medium block mb-1">Mois</label>
                <input name="month" value={form.month || ''} onChange={handle}
                  className="input input-bordered w-full input-sm" placeholder="Ex: Janvier" />
              </div>
            </div>

            <div>
              <label className="label-text font-medium block mb-1">Dates</label>
              <input name="dates" value={form.dates || ''} onChange={handle}
                className="input input-bordered w-full input-sm" placeholder="Ex: 15-17 Mars 2025" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-text font-medium block mb-1">Responsables (séparés par des virgules)</label>
                <input name="leaders" value={form.leaders || ''} onChange={handle}
                  className="input input-bordered w-full input-sm" placeholder="Pasteur Jean, Frère Paul" />
              </div>
              <div>
                <label className="label-text font-medium block mb-1">Icône</label>
                <input name="icon" value={form.icon || ''} onChange={handle}
                  className="input input-bordered w-full input-sm" placeholder="church, users, book..." />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn btn-ghost btn-sm">Annuler</button>
              <button type="submit" disabled={saving} className="btn btn-accent btn-sm gap-2">
                {saving ? <Loader size={14} className="animate-spin" /> : null}
                {isEdit ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ViewModal = ({ program, onClose }) => {
  if (!program) return null;
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
              <span className={`badge badge-sm badge-${program.color || 'accent'} mb-2`}>
                {CATEGORIES.find((c) => c.value === program.category)?.label || program.category}
              </span>
              <h2 className="text-xl font-bold">{program.title}</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-base-200 rounded-lg flex-shrink-0">
              <X size={18} />
            </button>
          </div>
          {program.description && (
            <p className="text-base-content/70">{program.description}</p>
          )}
          {program.long_description && (
            <p className="text-sm text-base-content/60 whitespace-pre-wrap">{program.long_description}</p>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-base-content/50 border-t border-base-200 pt-3">
            {program.day && <span className="flex items-center gap-1"><Calendar size={14} />{program.day}</span>}
            {program.time && <span className="flex items-center gap-1"><Clock size={14} />{program.time}</span>}
            {program.location && <span className="flex items-center gap-1"><MapPin size={14} />{program.location}</span>}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AdminPrograms = () => {
  const [programs, setPrograms]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filterCat, setFilterCat]     = useState('all');
  const [search, setSearch]           = useState('');
  const [page, setPage]               = useState(1);
  const [modalProgram, setModalProgram] = useState(null);
  const [modalOpen, setModalOpen]     = useState(false);
  const [viewProgram, setViewProgram] = useState(null);
  const PER_PAGE = 10;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/programs');
      setPrograms(data || []);
    } catch {
      toast.error('Impossible de charger les programmes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSaved = (saved, mode) => {
    if (mode === 'edit') setPrograms((p) => p.map((x) => (x.id === saved.id ? saved : x)));
    else setPrograms((p) => [saved, ...p]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce programme ?')) return;
    try {
      await api.delete(`/api/programs/${id}`);
      setPrograms((p) => p.filter((x) => x.id !== id));
      toast.success('Programme supprimé');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const filtered = programs.filter((p) => {
    const matchCat = filterCat === 'all' || p.category === filterCat;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                        (p.description || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const counts = {
    all: programs.length,
    weekly: programs.filter((p) => p.category === 'weekly').length,
    monthly: programs.filter((p) => p.category === 'monthly').length,
    annual: programs.filter((p) => p.category === 'annual').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Programmes</h1>
          <p className="text-sm text-base-content/50 mt-0.5">{counts.all} programme{counts.all !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} disabled={loading} className="btn btn-ghost btn-sm">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => { setModalProgram(null); setModalOpen(true); }} className="btn btn-accent btn-sm gap-2">
            <Plus size={16} /> Nouveau programme
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[{ value: 'all', label: `Tous (${counts.all})` },
          { value: 'weekly', label: `Hebdomadaire (${counts.weekly})` },
          { value: 'monthly', label: `Mensuel (${counts.monthly})` },
          { value: 'annual', label: `Annuel (${counts.annual})` },
        ].map(({ value, label }) => (
          <button key={value} onClick={() => { setFilterCat(value); setPage(1); }}
            className={`btn btn-sm ${filterCat === value ? 'btn-accent' : 'btn-ghost'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
        <input type="text" value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Rechercher par titre..."
          className="input input-bordered input-sm w-full pl-9" />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader size={28} className="animate-spin text-accent" />
        </div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-20 text-base-content/40">
          <Calendar size={40} className="mx-auto mb-3 opacity-30" />
          <p>Aucun programme trouvé</p>
        </div>
      ) : (
        <div className="bg-base-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="table w-full">
            <thead className="bg-base-200 text-xs text-base-content/50 uppercase">
              <tr>
                <th>Titre</th>
                <th>Catégorie</th>
                <th>Jour</th>
                <th>Horaire</th>
                <th>Lieu</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((program) => (
                <tr key={program.id} className="hover border-b border-base-200">
                  <td><span className="font-medium text-sm line-clamp-1">{program.title}</span></td>
                  <td>
                    <span className={`badge badge-xs badge-${program.color || 'accent'}`}>
                      {CATEGORIES.find((c) => c.value === program.category)?.label || program.category}
                    </span>
                  </td>
                  <td className="text-sm text-base-content/60">{program.day || '—'}</td>
                  <td className="text-sm text-base-content/60">{program.time || '—'}</td>
                  <td className="text-sm text-base-content/60">{program.location || '—'}</td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setViewProgram(program)}
                        className="btn btn-ghost btn-xs" title="Voir"><Eye size={14} /></button>
                      <button onClick={() => { setModalProgram(program); setModalOpen(true); }}
                        className="btn btn-ghost btn-xs text-info" title="Modifier">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => handleDelete(program.id)}
                        className="btn btn-ghost btn-xs text-error" title="Supprimer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
        {modalOpen && (
          <ProgramModal
            program={modalProgram}
            onClose={() => { setModalOpen(false); setModalProgram(null); }}
            onSaved={handleSaved}
          />
        )}
        {viewProgram && <ViewModal program={viewProgram} onClose={() => setViewProgram(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default AdminPrograms;
