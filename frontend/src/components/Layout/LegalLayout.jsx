// components/Layout/LegalLayout.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { 
  Scale, 
  FileText, 
  HelpCircle, 
  HeadphonesIcon,
  Cookie,
  Shield,
  ChevronRight
} from "lucide-react";
import NavBar from "../NavBar";
import Footer from "../Footer";

const LegalLayout = ({ children, title, subtitle, icon: Icon }) => {
  const location = useLocation();

  const navigationLinks = [
    { path: "/legal", label: "Mentions légales", icon: Scale },
    { path: "/privacy", label: "Politique de confidentialité", icon: Shield },
    { path: "/cgu", label: "Conditions d'utilisation", icon: FileText },
    { path: "/cookies", label: "Politique des cookies", icon: Cookie },
    { path: "/faq", label: "FAQ", icon: HelpCircle },
    { path: "/support", label: "Support", icon: HeadphonesIcon },
  ];

  return (
    <>
      <NavBar />
      
      <main className="min-h-screen bg-base-100">
        {/* Hero Section */}
        <section className="relative bg-linear-to-br from-base-200 via-base-100 to-base-200 py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-accent/10 rounded-full">
                  {Icon && <Icon className="w-12 h-12 text-accent" />}
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="text-lg md:text-xl text-base-content/70">
                {subtitle}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Navigation secondaire */}
        <div className="bg-base-200 border-b border-base-300 sticky top-0 z-40">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto py-3 gap-2 no-scrollbar">
              {navigationLinks.map((link) => {
                const LinkIcon = link.icon;
                const isActive = location.pathname === link.path;
                
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap
                      transition-all duration-300
                      ${isActive 
                        ? 'bg-accent text-white shadow-lg' 
                        : 'hover:bg-base-300 text-base-content/70 hover:text-base-content'
                      }
                    `}
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <section className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-base-content/50 mb-8">
              <Link to="/" className="hover:text-accent transition-colors">Accueil</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-accent">{title}</span>
            </div>

            {/* Contenu de la page */}
            <div className="prose prose-lg max-w-none">
              {children}
            </div>

            {/* Section contact pour support */}
            {location.pathname === "/support" && (
              <div className="mt-12 p-6 bg-accent/5 rounded-2xl border border-accent/20">
                <h3 className="text-xl font-bold mb-4">Vous n'avez pas trouvé de réponse ?</h3>
                <p className="mb-6">
                  Notre équipe est là pour vous aider. N'hésitez pas à nous contacter directement.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/contact" className="btn btn-accent">
                    Contactez-nous
                  </Link>
                  <a href="mailto:support@eglise.com" className="btn btn-outline">
                    support@eglise.com
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </section>
      </main>

      
    </>
  );
};

export default LegalLayout;