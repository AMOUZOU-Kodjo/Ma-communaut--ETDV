import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { CommunityProvider } from './context/CommunityContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// ── Composants publics ─────────────────────────────────────────────────────
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import About from "./components/About";
import Events from "./components/Events";
import Programs from "./components/Programs";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";
import Inscription from "./components/connexion/Inscription";

// ── Pages ──────────────────────────────────────────────────────────────────
import MediaPage from './pages/MediaPage';
import VisitPage from './pages/VisitPage';

// ── Pages légales ──────────────────────────────────────────────────────────
import MentionsLegales from "./components/Legal/MentionsLegales";
import PolitiqueConfidentialite from "./components/Legal/PolitiqueConfidentialite";
import Support from "./components/Legal/Support";
import CGU from "./components/Legal/CGU";
import Cookies from "./components/Legal/Cookies";
import FAQ from "./components/Legal/FAQ";

// ── Auth ───────────────────────────────────────────────────────────────────
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// ── Dashboard admin ────────────────────────────────────────────────────────
// NOTE : Le dossier a été renommé "Dashboard" (corrigé depuis "Dashboad")
import AdminLayout from "./components/Dashboard/AdminLayout";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import AdminGallery from "./components/Dashboard/AdminGallery";
import EventsManager from "./components/Dashboard/EventsManager";
import UserManagement from "./components/Dashboard/UserManagement";
import VisiteursManager from "./components/Dashboard/VisiteursManager";
import CommunityDashboard from "./components/Dashboard/CommunityDashboard";
import AdminPrograms from "./components/Dashboard/AdminPrograms";
import AdminMessages from "./components/Dashboard/AdminMessages";
import AdminSettings from "./components/Dashboard/AdminSettings";

// ── Layouts ────────────────────────────────────────────────────────────────
const PublicLayout = ({ children }) => (
  <>
    <NavBar />
    <main className="pt-20 min-h-screen bg-base-100 text-base-content transition-colors duration-300">
      {children}
    </main>
    <Footer />
  </>
);

const LegalLayout = ({ children }) => (
  <>
    <NavBar />
    <main className="min-h-screen pt-20 bg-base-100 text-base-content transition-colors duration-300">
      {children}
    </main>
    <Footer />
  </>
);

const AuthLayout = ({ children }) => (
  <main className="min-h-screen bg-base-100">{children}</main>
);

// AdminLayout wrappé dans ProtectedRoute, pas besoin de double wrapper
const AdminRoute = ({ children }) => (
  <ProtectedRoute>
    <AdminLayout>{children}</AdminLayout>
  </ProtectedRoute>
);

// ── App ────────────────────────────────────────────────────────────────────
const App = () => (
  <BrowserRouter>
    <ThemeProvider>
      <CommunityProvider>
        <AuthProvider>
          <Routes>
            {/* ── Routes publiques ── */}
            <Route path="/"           element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/about"      element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/events"     element={<PublicLayout><Events /></PublicLayout>} />
            <Route path="/programs"   element={<PublicLayout><Programs /></PublicLayout>} />
            <Route path="/gallery"    element={<PublicLayout><Gallery /></PublicLayout>} />
            <Route path="/contact"    element={<PublicLayout><Contact /></PublicLayout>} />
            <Route path="/visite"     element={<PublicLayout><VisitPage /></PublicLayout>} />
            <Route path="/mediatheque" element={<PublicLayout><MediaPage /></PublicLayout>} />
            <Route path="/inscription" element={<PublicLayout><Inscription /></PublicLayout>} />

            {/* ── Pages légales ── */}
            <Route path="/legal"   element={<LegalLayout><MentionsLegales /></LegalLayout>} />
            <Route path="/privacy" element={<LegalLayout><PolitiqueConfidentialite /></LegalLayout>} />
            <Route path="/support" element={<LegalLayout><Support /></LegalLayout>} />
            <Route path="/cgu"     element={<LegalLayout><CGU /></LegalLayout>} />
            <Route path="/cookies" element={<LegalLayout><Cookies /></LegalLayout>} />
            <Route path="/faq"     element={<LegalLayout><FAQ /></LegalLayout>} />

            {/* ── Auth ── */}
            <Route path="/login"    element={<AuthLayout><Login /></AuthLayout>} />
            <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />

            {/* ── Admin protégé ── */}
            <Route path="/dashboardadmin"     element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/galleryadmin"        element={<AdminRoute><AdminGallery /></AdminRoute>} />
            <Route path="/eventsadmin"         element={<AdminRoute><EventsManager /></AdminRoute>} />
            <Route path="/admin/programs"       element={<AdminRoute><AdminPrograms /></AdminRoute>} />
            <Route path="/admin/users"         element={<AdminRoute><UserManagement /></AdminRoute>} />
            <Route path="/admin/visiteurs"     element={<AdminRoute><VisiteursManager /></AdminRoute>} />
            <Route path="/community-dashboard" element={<AdminRoute><CommunityDashboard /></AdminRoute>} />
            <Route path="/admin/messages"      element={<AdminRoute><AdminMessages /></AdminRoute>} />
            <Route path="/admin/settings"      element={<AdminRoute><AdminSettings /></AdminRoute>} />

            {/* ── 404 ── */}
            <Route path="*" element={
              <PublicLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                  <h1 className="text-6xl font-bold text-accent">404</h1>
                  <p className="text-xl text-base-content/60">Cette page n'existe pas</p>
                  <a href="/" className="btn btn-accent">Retour à l'accueil</a>
                </div>
              </PublicLayout>
            } />
          </Routes>
        </AuthProvider>
      </CommunityProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default App;
