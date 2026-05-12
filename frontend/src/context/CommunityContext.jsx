// context/CommunityContext.jsx
import React, { createContext, useState, useContext } from 'react';
import { api } from './AuthContext';
import toast from 'react-hot-toast';

const CommunityContext = createContext();

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within CommunityProvider');
  }
  return context;
};

export const CommunityProvider = ({ children }) => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0
  });

  // Ajouter un visiteur (public)
  const addVisitor = async (visitorData) => {
    setLoading(true);
    try {
      const response = await api.post('/api/visitors', {
        nom:        visitorData.lastName || visitorData.nom,
        prenom:     visitorData.firstName,
        email:      visitorData.email,
        telephone:  visitorData.phone || visitorData.telephone,
        message:    visitorData.message,
        date_visite: visitorData.visitDate || null,
      });
      setVisitors(prev => [response.data, ...prev]);
      toast.success('Inscription réussie ! Nous vous contacterons bientôt.', {
        icon: '🎉', duration: 5000
      });
      return response.data;
    } catch (error) {
      console.error('Error adding visitor:', error);
      toast.error("Erreur lors de l'inscription");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour le statut d'un visiteur (admin)
  const updateVisitorStatus = async (id, statut) => {
    try {
      const response = await api.put(`/api/visitors/${id}`, { statut });
      setVisitors(prev =>
        prev.map(v => v.id === id ? response.data : v)
      );
      toast.success(`Statut mis à jour: ${statut}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Erreur de mise à jour');
    }
  };

  // Supprimer un visiteur (admin)
  const deleteVisitor = async (id) => {
    try {
      await api.delete(`/api/visitors/${id}`);
      setVisitors(prev => prev.filter(v => v.id !== id));
      toast.success('Visiteur supprimé');
    } catch (error) {
      console.error('Error deleting visitor:', error);
      toast.error('Erreur de suppression');
    }
  };

  return (
    <CommunityContext.Provider value={{
      visitors,
      loading,
      stats,
      addVisitor,
      updateVisitorStatus,
      deleteVisitor,
    }}>
      {children}
    </CommunityContext.Provider>
  );
};
