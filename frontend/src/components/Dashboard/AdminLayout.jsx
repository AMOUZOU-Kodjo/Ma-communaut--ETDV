// src/components/Dashboard/AdminLayout.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Menu, X, LayoutDashboard, Image, Calendar,
  Users, Settings, LogOut, Bell, Church, Users2, BarChart3, BookOpen, Mail
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { path: '/dashboardadmin', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/galleryadmin',   icon: Image,           label: 'Galerie & Médias' },
  { path: '/eventsadmin',    icon: Calendar,        label: 'Événements' },
  { path: '/admin/programs', icon: BookOpen,        label: 'Programmes' },
  { path: '/admin/users',    icon: Users,           label: 'Utilisateurs' },
  { path: '/community-dashboard', icon: BarChart3,  label: 'Communauté' },
  { path: '/admin/visiteurs', icon: Church,         label: 'Visiteurs' },
  { path: '/admin/messages',  icon: Mail,           label: 'Messages' },
  { path: '/admin/settings',  icon: Settings,        label: 'Paramètres' },
];

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { user, logout } = useAuth();

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'AD';

  const currentLabel =
    menuItems.find((item) => item.path === location.pathname)?.label || 'Dashboard';

  return (
    <div className="min-h-screen bg-base-200 flex">
      {/* ── Sidebar ────────────────────────────────────── */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 72 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="bg-base-100 shadow-xl fixed h-full z-30 overflow-hidden flex-shrink-0"
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-4 flex items-center justify-between border-b border-base-200 min-h-[65px]">
            {sidebarOpen && (
              <span className="text-lg font-bold text-accent truncate">Admin ETDV</span>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-base-200 rounded-lg ml-auto flex-shrink-0"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-3 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map(({ path, icon: Icon, label }) => {
                const isActive = location.pathname === path;
                return (
                  <li key={path}>
                    <Link
                      to={path}
                      title={!sidebarOpen ? label : undefined}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-accent text-white shadow-md'
                          : 'hover:bg-base-200 text-base-content/70 hover:text-base-content'
                      }`}
                    >
                      <Icon size={20} className="flex-shrink-0" />
                      {sidebarOpen && (
                        <span className="text-sm font-medium truncate">{label}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User + Logout */}
          <div className="p-3 border-t border-base-200 space-y-1">
            {sidebarOpen && user && (
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-base-200 mb-1">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{user.username}</p>
                  <p className="text-xs text-base-content/50 truncate">{user.role}</p>
                </div>
              </div>
            )}
            <button
              onClick={logout}
              title={!sidebarOpen ? 'Déconnexion' : undefined}
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl hover:bg-error/10 text-error transition-colors"
            >
              <LogOut size={20} className="flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">Déconnexion</span>}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* ── Main ────────────────────────────────────────── */}
      <motion.div
        animate={{ marginLeft: sidebarOpen ? 260 : 72 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="flex-1 min-w-0"
      >
        {/* Header */}
        <header className="bg-base-100 shadow-sm sticky top-0 z-20 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{currentLabel}</h2>

          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-base-200 rounded-lg relative" aria-label="Notifications">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
              {user && (
                <div className="hidden md:block leading-tight">
                  <p className="text-sm font-semibold">{user.username}</p>
                  <p className="text-xs text-base-content/50 capitalize">{user.role}</p>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">{children}</main>
      </motion.div>
    </div>
  );
};

export default AdminLayout;
