import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Search, RefreshCw, Trash2, Eye, X, Loader,
  ChevronLeft, ChevronRight, MessageSquare, User, Clock,
  CheckCheck, Reply
} from 'lucide-react';
import { api } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ViewModal = ({ message, onClose, onMarkRead }) => {
  const handleMarkRead = async () => {
    try {
      await api.put(`/api/contact/${message.id}/lu`);
      onMarkRead({ ...message, lu: true });
      toast.success('Marqué comme lu');
      onClose();
    } catch {
      toast.error('Erreur');
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
            <h2 className="text-xl font-bold">Message</h2>
            <button onClick={onClose} className="p-2 hover:bg-base-200 rounded-lg"><X size={18} /></button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-xl">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {message.nom.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{message.nom}</p>
                <p className="text-xs text-base-content/50">{message.email}</p>
              </div>
              <span className={`ml-auto badge badge-sm ${message.lu ? 'badge-ghost' : 'badge-accent'}`}>
                {message.lu ? 'Lu' : 'Nouveau'}
              </span>
            </div>

            {message.sujet && (
              <div className="flex items-center gap-2 text-sm">
                <MessageSquare size={14} className="text-accent flex-shrink-0" />
                <span className="font-medium">{message.sujet}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-base-content/50">
              <Clock size={14} />
              <span>{new Date(message.created_at).toLocaleString('fr-FR')}</span>
            </div>

            <div className="p-4 bg-base-200 rounded-xl">
              <p className="text-sm whitespace-pre-wrap">{message.message}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            {!message.lu && (
              <button onClick={handleMarkRead} className="btn btn-accent btn-sm gap-2">
                <CheckCheck size={15} /> Marquer comme lu
              </button>
            )}
            <a href={`mailto:${message.email}?subject=Re: ${message.sujet || 'Votre message'}`}
              className="btn btn-outline btn-accent btn-sm gap-2">
              <Reply size={15} /> Répondre
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewItem, setViewItem] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/contact');
      setMessages(data || []);
    } catch {
      toast.error('Impossible de charger les messages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce message ?')) return;
    try {
      await api.delete(`/api/contact/${id}`);
      setMessages((p) => p.filter((m) => m.id !== id));
      toast.success('Message supprimé');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleMarkRead = (updated) => {
    setMessages((p) => p.map((m) => (m.id === updated.id ? updated : m)));
  };

  const filtered = messages.filter((m) => {
    const matchFilter = filter === 'all' || (filter === 'unread' && !m.lu) || (filter === 'read' && m.lu);
    const matchSearch = !search ||
      m.nom.toLowerCase().includes(search.toLowerCase()) ||
      (m.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.sujet || '').toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const counts = {
    all: messages.length,
    unread: messages.filter((m) => !m.lu).length,
    read: messages.filter((m) => m.lu).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-sm text-base-content/50 mt-0.5">
            {counts.all} message{counts.all !== 1 ? 's' : ''}
            {counts.unread > 0 && ` · ${counts.unread} non lu${counts.unread !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button onClick={load} disabled={loading} className="btn btn-ghost btn-sm gap-2">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Actualiser
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { key: 'all', label: 'Tous', value: counts.all, color: 'bg-accent' },
          { key: 'unread', label: 'Non lus', value: counts.unread, color: 'bg-warning' },
          { key: 'read', label: 'Lus', value: counts.read, color: 'bg-success' },
        ].map((s) => (
          <div key={s.key} className="bg-base-100 rounded-xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-accent">{s.value}</p>
            <p className="text-xs text-base-content/60 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Nom, email, sujet..."
            className="input input-bordered input-sm pl-9 w-56" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            ['all', `Tous (${counts.all})`],
            ['unread', `Non lus (${counts.unread})`],
            ['read', `Lus (${counts.read})`],
          ].map(([key, label]) => (
            <button key={key} onClick={() => { setFilter(key); setPage(1); }}
              className={`btn btn-xs ${filter === key ? 'btn-accent' : 'btn-ghost'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader size={28} className="animate-spin text-accent" /></div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-20 text-base-content/40">
          <Mail size={40} className="mx-auto mb-3 opacity-30" />
          <p>Aucun message trouvé</p>
        </div>
      ) : (
        <div className="bg-base-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="table w-full">
            <thead className="bg-base-200 text-xs text-base-content/50 uppercase">
              <tr>
                <th>Expéditeur</th>
                <th>Sujet</th>
                <th>Date</th>
                <th>Statut</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((m) => (
                <tr key={m.id} className={`hover border-b border-base-200 ${!m.lu ? 'font-semibold bg-accent/5' : ''}`}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center text-accent text-xs font-bold flex-shrink-0">
                        {m.nom.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm">{m.nom}</p>
                        <p className="text-xs text-base-content/40">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-sm">{m.sujet || <span className="text-base-content/30">—</span>}</td>
                  <td className="text-xs text-base-content/50">
                    {new Date(m.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td>
                    <span className={`badge badge-sm ${m.lu ? 'badge-ghost' : 'badge-accent'}`}>
                      {m.lu ? 'Lu' : 'Nouveau'}
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setViewItem(m)}
                        className="btn btn-ghost btn-xs text-info" title="Voir">
                        <Eye size={14} />
                      </button>
                      <a href={`mailto:${m.email}?subject=Re: ${m.sujet || 'Votre message'}`}
                        className="btn btn-ghost btn-xs text-accent" title="Répondre">
                        <Reply size={14} />
                      </a>
                      <button onClick={() => handleDelete(m.id)}
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
        {viewItem && (
          <ViewModal message={viewItem} onClose={() => setViewItem(null)} onMarkRead={handleMarkRead} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminMessages;
