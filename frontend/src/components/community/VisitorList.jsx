// components/community/VisitorList.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
  UserPlus,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { useCommunity } from '../../context/CommunityContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import * as XLSX from 'xlsx';

const VisitorList = () => {
  const { visitors, loading, stats, updateVisitorStatus, deleteVisitor, refreshVisitors } = useCommunity();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Filtrer et trier les visiteurs
  const filteredVisitors = visitors
    .filter(visitor => {
      const matchesSearch = 
        visitor.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        visitor.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        visitor.email?.toLowerCase().includes(search.toLowerCase()) ||
        visitor.phone?.includes(search);
      
      const matchesStatus = statusFilter === 'all' || visitor.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'date':
          return new Date(b.visitDate) - new Date(a.visitDate);
        case 'name':
          return (a.lastName + a.firstName).localeCompare(b.lastName + b.firstName);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  // Exporter en Excel
  const exportToExcel = () => {
    const data = filteredVisitors.map(v => ({
      'Prénom': v.firstName,
      'Nom': v.lastName,
      'Email': v.email,
      'Téléphone': v.phone,
      'Date de naissance': v.birthDate,
      'Adresse': v.address,
      'Ville': v.city,
      'Pays': v.country,
      'Date de visite': v.visitDate,
      'Heure': v.visitTime,
      'Personnes': v.numberOfPeople,
      'Message': v.message,
      'Statut': v.status,
      "Date d'inscription": v.createdAt
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Visiteurs');
    XLSX.writeFile(wb, `visiteurs_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { color: 'bg-yellow-500/10 text-yellow-500', icon: Clock, label: 'En attente' },
      confirmed: { color: 'bg-green-500/10 text-green-500', icon: CheckCircle, label: 'Confirmé' },
      visited: { color: 'bg-blue-500/10 text-blue-500', icon: Users, label: 'Visité' },
      cancelled: { color: 'bg-red-500/10 text-red-500', icon: XCircle, label: 'Annulé' }
    };
    const StatusIcon = config[status]?.icon || Clock;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config[status]?.color}`}>
        <StatusIcon className="w-3 h-3" />
        {config[status]?.label}
      </span>
    );
  };

  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Users className="w-8 h-8 text-accent" />
          Gestion des visiteurs
        </h1>
        <p className="text-base-content/70">
          Gérez les personnes souhaitant visiter l'église
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-base-200 rounded-xl p-4">
          <p className="text-sm text-base-content/50 mb-1">Total visiteurs</p>
          <p className="text-3xl font-bold text-accent">{stats.total}</p>
        </div>
        <div className="bg-base-200 rounded-xl p-4">
          <p className="text-sm text-base-content/50 mb-1">Aujourd'hui</p>
          <p className="text-3xl font-bold text-accent">{stats.today}</p>
        </div>
        <div className="bg-base-200 rounded-xl p-4">
          <p className="text-sm text-base-content/50 mb-1">Cette semaine</p>
          <p className="text-3xl font-bold text-accent">{stats.thisWeek}</p>
        </div>
        <div className="bg-base-200 rounded-xl p-4">
          <p className="text-sm text-base-content/50 mb-1">Ce mois</p>
          <p className="text-3xl font-bold text-accent">{stats.thisMonth}</p>
        </div>
      </div>

      {/* Barre d'outils */}
      <div className="bg-base-200 rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40" />
            <input
              type="text"
              placeholder="Rechercher un visiteur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-base-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-base-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmé</option>
              <option value="visited">Visité</option>
              <option value="cancelled">Annulé</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-base-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="date">Date</option>
              <option value="name">Nom</option>
              <option value="status">Statut</option>
            </select>

            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exporter
            </button>

            <button
              onClick={refreshVisitors}
              className="p-2 bg-base-300 rounded-lg hover:bg-base-400 transition-colors"
              title="Actualiser"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Liste des visiteurs */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
      ) : (
        <div className="bg-base-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-base-300">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Visiteur</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date visite</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Personnes</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Statut</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredVisitors.map((visitor) => (
                    <motion.tr
                      key={visitor.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-base-300 hover:bg-base-300/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{visitor.firstName} {visitor.lastName}</p>
                          <p className="text-xs text-base-content/50">
                            Né(e) le {format(new Date(visitor.birthDate), 'dd/MM/yyyy')}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm flex items-center gap-2">
                            <Mail className="w-3 h-3 text-base-content/50" />
                            {visitor.email}
                          </p>
                          <p className="text-sm flex items-center gap-2">
                            <Phone className="w-3 h-3 text-base-content/50" />
                            {visitor.phone}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">
                            {format(new Date(visitor.visitDate), 'dd/MM/yyyy')}
                          </p>
                          {visitor.visitTime && (
                            <p className="text-xs text-base-content/50">{visitor.visitTime}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
                          {visitor.numberOfPeople} pers.
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={visitor.status}
                          onChange={(e) => updateVisitorStatus(visitor.id, e.target.value)}
                          className="px-3 py-1 bg-base-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                          <option value="pending">En attente</option>
                          <option value="confirmed">Confirmé</option>
                          <option value="visited">Visité</option>
                          <option value="cancelled">Annulé</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedVisitor(visitor)}
                            className="p-2 bg-base-300 rounded-lg hover:bg-accent hover:text-white transition-colors"
                            title="Voir détails"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(visitor.id)}
                            className="p-2 bg-base-300 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {filteredVisitors.length === 0 && (
            <div className="text-center py-20">
              <Users className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
              <p className="text-lg text-base-content/50">Aucun visiteur trouvé</p>
            </div>
          )}
        </div>
      )}

      {/* Modal de détails */}
      <AnimatePresence>
        {selectedVisitor && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVisitor(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-4 md:inset-10 z-50 overflow-y-auto"
            >
              <div className="min-h-full flex items-center justify-center p-4">
                <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-2xl">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold">Détails du visiteur</h2>
                      <button
                        onClick={() => setSelectedVisitor(null)}
                        className="p-2 rounded-lg bg-base-200 hover:bg-base-300"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-base-content/50">Nom complet</p>
                          <p className="font-medium">{selectedVisitor.firstName} {selectedVisitor.lastName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-base-content/50">Date de naissance</p>
                          <p>{format(new Date(selectedVisitor.birthDate), 'dd MMMM yyyy', { locale: fr })}</p>
                        </div>
                        <div>
                          <p className="text-sm text-base-content/50">Email</p>
                          <p>{selectedVisitor.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-base-content/50">Téléphone</p>
                          <p>{selectedVisitor.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-base-content/50">Adresse</p>
                          <p>{selectedVisitor.address || 'Non spécifié'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-base-content/50">Ville / Pays</p>
                          <p>{selectedVisitor.city || 'Non spécifié'} - {selectedVisitor.country}</p>
                        </div>
                        <div>
                          <p className="text-sm text-base-content/50">Date de visite</p>
                          <p>{format(new Date(selectedVisitor.visitDate), 'dd MMMM yyyy', { locale: fr })}</p>
                        </div>
                        <div>
                          <p className="text-sm text-base-content/50">Heure</p>
                          <p>{selectedVisitor.visitTime || 'Non spécifié'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-base-content/50">Nombre de personnes</p>
                          <p>{selectedVisitor.numberOfPeople}</p>
                        </div>
                        <div>
                          <p className="text-sm text-base-content/50">Statut</p>
                          <div className="mt-1">{getStatusBadge(selectedVisitor.status)}</div>
                        </div>
                      </div>

                      {selectedVisitor.message && (
                        <div className="pt-4">
                          <p className="text-sm text-base-content/50 mb-2">Message</p>
                          <p className="p-4 bg-base-200 rounded-lg italic">{selectedVisitor.message}</p>
                        </div>
                      )}

                      <div className="pt-4 text-xs text-base-content/40">
                        Inscrit le {format(new Date(selectedVisitor.createdAt), 'dd/MM/yyyy à HH:mm')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal de confirmation de suppression */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Confirmer la suppression</h3>
                  <p className="text-base-content/70">
                    Êtes-vous sûr de vouloir supprimer ce visiteur ? Cette action est irréversible.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 bg-base-200 hover:bg-base-300 rounded-lg font-medium transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      deleteVisitor(showDeleteConfirm);
                      setShowDeleteConfirm(null);
                    }}
                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VisitorList;