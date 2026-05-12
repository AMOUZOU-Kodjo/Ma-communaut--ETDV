// src/components/Dashboard/UserManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, Trash2, Eye, EyeOff,
  Search, RefreshCw, Shield, X, Loader,
  Key, Mail, User, CheckCircle, XCircle
} from 'lucide-react';
import { api } from '../../context/AuthContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ROLE_CONFIG = {
  admin:       { label: 'Admin',       badge: 'badge-accent' },
  super_admin: { label: 'Super Admin', badge: 'badge-error'  },
  moderator:   { label: 'Modérateur',  badge: 'badge-info'   },
};

const EMPTY_FORM = { username: '', email: '', password: '', confirmPassword: '', role: 'admin' };

// ── Modal Ajout ───────────────────────────────────────
const AddUserModal = ({ onClose, onSaved }) => {
  const [form, setForm]         = useState({ ...EMPTY_FORM });
  const [showPwd, setShowPwd]   = useState(false);
  const [saving, setSaving]     = useState(false);

  const handle = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return toast.error('Les mots de passe ne correspondent pas');
    }
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!regex.test(form.password)) {
      return toast.error('Mot de passe : 8 caractères min, une majuscule, un chiffre');
    }
    setSaving(true);
    try {
      const { data } = await api.post('/api/auth/register', {
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      onSaved(data);
      toast.success('Compte créé avec succès');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur lors de la création');
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
            <h2 className="text-xl font-bold flex items-center gap-2">
              <UserPlus size={20} className="text-accent" /> Nouveau compte admin
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-base-200 rounded-lg"><X size={18} /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-text font-medium block mb-1">Nom d'utilisateur *</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input name="username" value={form.username} onChange={handle} required
                  className="input input-bordered w-full pl-9" placeholder="username" />
              </div>
            </div>

            <div>
              <label className="label-text font-medium block mb-1">Email *</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input name="email" type="email" value={form.email} onChange={handle} required
                  className="input input-bordered w-full pl-9" placeholder="email@exemple.com" />
              </div>
            </div>

            <div>
              <label className="label-text font-medium block mb-1">Rôle</label>
              <select name="role" value={form.role} onChange={handle} className="select select-bordered w-full">
                {Object.entries(ROLE_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-text font-medium block mb-1">Mot de passe *</label>
              <div className="relative">
                <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input name="password" type={showPwd ? 'text' : 'password'} value={form.password}
                  onChange={handle} required className="input input-bordered w-full pl-9 pr-10"
                  placeholder="Min 8 car., 1 maj., 1 chiffre" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="label-text font-medium block mb-1">Confirmer le mot de passe *</label>
              <div className="relative">
                <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input name="confirmPassword" type={showPwd ? 'text' : 'password'}
                  value={form.confirmPassword} onChange={handle} required
                  className="input input-bordered w-full pl-9" placeholder="Répéter le mot de passe" />
              </div>
            </div>

            {/* Indicateur force mot de passe */}
            {form.password && (
              <ul className="text-xs space-y-1">
                {[
                  { ok: form.password.length >= 8,   label: '8 caractères minimum' },
                  { ok: /[A-Z]/.test(form.password), label: 'Une lettre majuscule' },
                  { ok: /\d/.test(form.password),    label: 'Un chiffre' },
                ].map(({ ok, label }) => (
                  <li key={label} className={`flex items-center gap-2 ${ok ? 'text-success' : 'text-base-content/40'}`}>
                    {ok ? <CheckCircle size={12} /> : <XCircle size={12} />} {label}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn btn-ghost btn-sm">Annuler</button>
              <button type="submit" disabled={saving} className="btn btn-accent btn-sm gap-2">
                {saving && <Loader size={14} className="animate-spin" />}
                Créer le compte
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Main ──────────────────────────────────────────────
const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [modalOpen, setModal]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/auth/users');
      setUsers(data || []);
    } catch {
      toast.error('Impossible de charger les utilisateurs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (user) => {
    if (user.id === currentUser?.id) {
      return toast.error('Vous ne pouvez pas supprimer votre propre compte');
    }
    if (!window.confirm(`Supprimer le compte "${user.username}" ?`)) return;
    try {
      await api.delete(`/api/auth/users/${user.id}`);
      setUsers((p) => p.filter((u) => u.id !== user.id));
      toast.success('Compte supprimé');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur lors de la suppression');
    }
  };

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
          <p className="text-sm text-base-content/50 mt-0.5">
            {users.length} compte{users.length !== 1 ? 's' : ''} administrateur
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} disabled={loading} className="btn btn-ghost btn-sm">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => setModal(true)} className="btn btn-accent btn-sm gap-2">
            <UserPlus size={16} /> Ajouter un admin
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un utilisateur..."
          className="input input-bordered input-sm w-full pl-9" />
      </div>

      {/* Contenu */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader size={28} className="animate-spin text-accent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-base-content/40">
          <Users size={40} className="mx-auto mb-3 opacity-30" />
          <p>Aucun utilisateur trouvé</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((user) => {
            const cfg = ROLE_CONFIG[user.role] || ROLE_CONFIG.admin;
            const initials = user.username.slice(0, 2).toUpperCase();
            const isSelf = user.id === currentUser?.id;

            return (
              <motion.div
                key={user.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-base-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white font-bold flex-shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold truncate">{user.username}</p>
                        {isSelf && <span className="badge badge-ghost badge-xs">Vous</span>}
                      </div>
                      <p className="text-xs text-base-content/50 truncate">{user.email}</p>
                    </div>
                  </div>
                  <span className={`badge badge-sm flex-shrink-0 ${cfg.badge}`}>{cfg.label}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-base-200 flex items-center justify-between">
                  <div className="text-xs text-base-content/40 flex items-center gap-1">
                    <Shield size={12} />
                    Depuis {new Date(user.created_at).toLocaleDateString('fr-FR')}
                  </div>
                  {!isSelf && (
                    <button
                      onClick={() => handleDelete(user)}
                      className="btn btn-ghost btn-xs text-error gap-1"
                      title="Supprimer ce compte"
                    >
                      <Trash2 size={13} /> Supprimer
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <AddUserModal
            onClose={() => setModal(false)}
            onSaved={(newUser) => setUsers((p) => [...p, newUser])}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;
