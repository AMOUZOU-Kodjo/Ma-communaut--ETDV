// context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const AuthContext = createContext();

// URL de l'API - configure dans .env.local (Vite utilise VITE_ prefix)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Instance axios avec base URL
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

// Injecteur automatique du token JWT dans chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur de réponse : déconnecter si 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    }
    return Promise.reject(error);
  }
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Recharger la session depuis localStorage au démarrage
  useEffect(() => {
    const savedUser = localStorage.getItem('authUser');
    const savedToken = localStorage.getItem('authToken');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Connexion
  const login = async (username, password) => {
    try {
      const { data } = await api.post('/api/auth/login', { username, password });
      const { token, user: userData } = data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(userData));
      setUser(userData);

      toast.success('Connexion réussie !');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Erreur de connexion';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Inscription (admin crée un nouveau compte)
  const register = async (userData) => {
    try {
      if (userData.password !== userData.confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }

      const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(userData.password)) {
        throw new Error('Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre');
      }

      await api.post('/api/auth/register', {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'admin',
      });

      toast.success('Compte créé avec succès !');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || error.message || "Erreur lors de l'inscription";
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Déconnexion
  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    toast.success('Déconnexion réussie');
    navigate('/login');
  };

  // Changer mot de passe
  const changePassword = async (oldPassword, newPassword) => {
    try {
      await api.post('/api/auth/change-password', { oldPassword, newPassword });
      toast.success('Mot de passe modifié avec succès');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Erreur lors du changement';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    changePassword,
    isAuthenticated: !!user,
    api, // expose axios instance pour usage dans les composants
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
