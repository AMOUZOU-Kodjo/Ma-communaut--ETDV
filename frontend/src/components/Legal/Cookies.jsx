// components/Legal/Cookies.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom"; // IMPORT MANQUANT AJOUTÉ
import LegalLayout from "../Layout/LegalLayout";
import { 
  Cookie, 
  Shield, 
  Settings, 
  Check, 
  X, 
  Info,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Database,
  Target,
  BarChart
} from "lucide-react";
import toast from "react-hot-toast";

const Cookies = () => {
  const [cookieSettings, setCookieSettings] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false
  });
  const [showBanner, setShowBanner] = useState(false);
  const [activeTab, setActiveTab] = useState("preferences");
  const [showDetails, setShowDetails] = useState({});

  // Vérifier si l'utilisateur a déjà fait un choix
  useEffect(() => {
    const savedSettings = localStorage.getItem("cookieSettings");
    if (!savedSettings) {
      setShowBanner(true);
    } else {
      setCookieSettings(JSON.parse(savedSettings));
    }
  }, []);

  const toggleDetails = (category) => {
    setShowDetails(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleSaveSettings = () => {
    localStorage.setItem("cookieSettings", JSON.stringify(cookieSettings));
    setShowBanner(false);
    toast.success("Préférences de cookies sauvegardées !", {
      icon: '🍪',
      duration: 3000
    });
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    };
    setCookieSettings(allAccepted);
    localStorage.setItem("cookieSettings", JSON.stringify(allAccepted));
    setShowBanner(false);
    toast.success("Tous les cookies ont été acceptés !", {
      icon: '✅',
      duration: 3000
    });
  };

  const handleRefuseAll = () => {
    const allRefused = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    };
    setCookieSettings(allRefused);
    localStorage.setItem("cookieSettings", JSON.stringify(allRefused));
    setShowBanner(false);
    toast.success("Préférences enregistrées. Seuls les cookies nécessaires sont actifs.", {
      icon: '🔒',
      duration: 4000
    });
  };

  const cookieCategories = [
    {
      id: "necessary",
      title: "Cookies nécessaires",
      icon: Shield,
      description: "Ces cookies sont essentiels au fonctionnement du site. Ils permettent d'utiliser les fonctionnalités principales comme la navigation et l'accès aux zones sécurisées.",
      mandatory: true,
      color: "from-blue-500 to-cyan-500",
      details: [
        "Session utilisateur",
        "Authentification",
        "Sécurité",
        "Gestion du panier (si applicable)"
      ],
      duration: "Session ou 1 an"
    },
    {
      id: "functional",
      title: "Cookies fonctionnels",
      icon: Settings,
      description: "Ces cookies permettent d'améliorer et de personnaliser votre expérience sur notre site. Ils mémorisent vos préférences et vos choix.",
      mandatory: false,
      color: "from-green-500 to-emerald-500",
      details: [
        "Préférences de langue",
        "Région géographique",
        "Personnalisation de l'interface",
        "Sauvegarde des paramètres"
      ],
      duration: "6 mois"
    },
    {
      id: "analytics",
      title: "Cookies analytiques",
      icon: BarChart,
      description: "Ces cookies nous aident à comprendre comment les visiteurs interagissent avec notre site. Ils nous permettent d'améliorer nos contenus et votre expérience.",
      mandatory: false,
      color: "from-purple-500 to-pink-500",
      details: [
        "Pages visitées",
        "Temps passé sur le site",
        "Taux de rebond",
        "Provenance des visiteurs"
      ],
      duration: "13 mois"
    },
    {
      id: "marketing",
      title: "Cookies marketing",
      icon: Target,
      description: "Ces cookies sont utilisés pour vous proposer des contenus et offres adaptés à vos centres d'intérêt. Ils peuvent être déposés par des partenaires.",
      mandatory: false,
      color: "from-orange-500 to-red-500",
      details: [
        "Publicités ciblées",
        "Partage sur réseaux sociaux",
        "Suivi des conversions",
        "Remarketing"
      ],
      duration: "3 mois"
    }
  ];

  const cookieList = [
    {
      name: "_ga",
      provider: "Google Analytics",
      purpose: "Analytics - Distingue les utilisateurs",
      duration: "2 ans",
      category: "analytics"
    },
    {
      name: "_gid",
      provider: "Google Analytics",
      purpose: "Analytics - Distingue les utilisateurs",
      duration: "24 heures",
      category: "analytics"
    },
    {
      name: "_gat",
      provider: "Google Analytics",
      purpose: "Analytics - Limite le taux de requêtes",
      duration: "1 minute",
      category: "analytics"
    },
    {
      name: "session_id",
      provider: "ETDV",
      purpose: "Nécessaire - Gestion de session",
      duration: "Session",
      category: "necessary"
    },
    {
      name: "cookie_consent",
      provider: "ETDV",
      purpose: "Nécessaire - Sauvegarde vos préférences",
      duration: "1 an",
      category: "necessary"
    },
    {
      name: "language",
      provider: "ETDV",
      purpose: "Fonctionnel - Préférence de langue",
      duration: "6 mois",
      category: "functional"
    }
  ];

  return (
    <LegalLayout
      title="Politique des Cookies"
      subtitle="Comment nous utilisons les cookies pour améliorer votre expérience"
      icon={Cookie}
    >
      {/* Bannière de cookies (si non acceptés) */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-base-200 shadow-2xl border-t border-base-300 p-4 z-50"
          >
            <div className="container mx-auto max-w-6xl">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Cookie className="w-5 h-5 text-accent" />
                    <h3 className="font-bold">Nous utilisons des cookies</h3>
                  </div>
                  <p className="text-sm text-base-content/70">
                    Nous utilisons des cookies pour améliorer votre expérience, 
                    analyser le trafic et personnaliser le contenu. Vous pouvez 
                    choisir vos préférences ci-dessous.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleRefuseAll}
                    className="btn btn-sm btn-outline"
                  >
                    Tout refuser
                  </button>
                  <button
                    onClick={() => {
                      setShowBanner(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="btn btn-sm btn-outline btn-accent"
                  >
                    Personnaliser
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="btn btn-sm btn-accent"
                  >
                    Tout accepter
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenu principal */}
      <div className="space-y-8">
        {/* Introduction */}
        <section className="bg-accent/5 p-6 rounded-xl border border-accent/20">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold mb-2">Bienvenue sur notre page Cookies</h2>
              <p className="text-base-content/80 leading-relaxed">
                Cette page vous explique ce que sont les cookies, comment nous les utilisons 
                et comment vous pouvez gérer vos préférences. Nous respectons votre vie privée 
                et nous nous engageons à protéger vos données personnelles.
              </p>
            </div>
          </div>
        </section>

        {/* Navigation par onglets */}
        <div className="flex border-b border-base-300 mb-6">
          <button
            onClick={() => setActiveTab("preferences")}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === "preferences" 
                ? 'text-accent' 
                : 'text-base-content/60 hover:text-base-content'
            }`}
          >
            <span>Préférences</span>
            {activeTab === "preferences" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("details")}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === "details" 
                ? 'text-accent' 
                : 'text-base-content/60 hover:text-base-content'
            }`}
          >
            <span>Liste des cookies</span>
            {activeTab === "details" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
              />
            )}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* Onglet Préférences */}
          {activeTab === "preferences" && (
            <motion.div
              key="preferences"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {cookieCategories.map((category, index) => {
                const Icon = category.icon;
                const isChecked = cookieSettings[category.id];
                
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-base-200 rounded-xl overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg bg-gradient-to-r ${category.color} bg-opacity-10`}>
                            <Icon className={`w-5 h-5 text-transparent bg-clip-text bg-gradient-to-r ${category.color}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold mb-1">
                              {category.title}
                              {category.mandatory && (
                                <span className="ml-2 text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                                  Nécessaire
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-base-content/70 mb-3">
                              {category.description}
                            </p>
                            
                            {/* Détails extensibles */}
                            <button
                              onClick={() => toggleDetails(category.id)}
                              className="text-xs text-accent flex items-center gap-1 mb-3"
                            >
                              {showDetails[category.id] ? 'Voir moins' : 'Voir plus de détails'}
                              {showDetails[category.id] ? 
                                <ChevronUp className="w-3 h-3" /> : 
                                <ChevronDown className="w-3 h-3" />
                              }
                            </button>

                            <AnimatePresence>
                              {showDetails[category.id] && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="bg-base-300/50 p-4 rounded-lg space-y-2">
                                    <div className="flex items-center gap-2 text-xs">
                                      <Clock className="w-3 h-3 text-accent" />
                                      <span>Durée de conservation : {category.duration}</span>
                                    </div>
                                    <div className="space-y-1">
                                      {category.details.map((detail, i) => (
                                        <div key={i} className="flex items-start gap-2 text-xs">
                                          <Check className="w-3 h-3 text-green-500 mt-0.5" />
                                          <span>{detail}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* Toggle switch */}
                        <div className="ml-4">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={isChecked}
                              onChange={(e) => {
                                if (!category.mandatory) {
                                  setCookieSettings({
                                    ...cookieSettings,
                                    [category.id]: e.target.checked
                                  });
                                }
                              }}
                              disabled={category.mandatory}
                            />
                            <div className={`
                              w-11 h-6 rounded-full peer 
                              ${category.mandatory ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                              ${isChecked 
                                ? 'bg-accent' 
                                : 'bg-base-300'
                              }
                              peer-checked:after:translate-x-full 
                              after:content-[''] 
                              after:absolute after:top-[2px] after:left-[2px] 
                              after:bg-white after:rounded-full 
                              after:h-5 after:w-5 after:transition-all
                            `} />
                          </label>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Boutons de sauvegarde */}
              <div className="flex flex-wrap justify-end gap-4 pt-4">
                <button
                  onClick={() => setCookieSettings({
                    necessary: true,
                    functional: false,
                    analytics: false,
                    marketing: false
                  })}
                  className="btn btn-outline"
                >
                  Réinitialiser
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="btn btn-accent"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Sauvegarder mes préférences
                </button>
              </div>
            </motion.div>
          )}

          {/* Onglet Liste des cookies */}
          {activeTab === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="bg-base-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-base-300">
                        <th className="px-6 py-4 text-left text-sm font-bold">Nom du cookie</th>
                        <th className="px-6 py-4 text-left text-sm font-bold">Fournisseur</th>
                        <th className="px-6 py-4 text-left text-sm font-bold">Objectif</th>
                        <th className="px-6 py-4 text-left text-sm font-bold">Durée</th>
                        <th className="px-6 py-4 text-left text-sm font-bold">Catégorie</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cookieList.map((cookie, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-base-300 hover:bg-base-300/50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-mono">{cookie.name}</td>
                          <td className="px-6 py-4 text-sm">{cookie.provider}</td>
                          <td className="px-6 py-4 text-sm">{cookie.purpose}</td>
                          <td className="px-6 py-4 text-sm">{cookie.duration}</td>
                          <td className="px-6 py-4">
                            <span className={`
                              px-2 py-1 text-xs rounded-full capitalize
                              ${cookie.category === 'necessary' ? 'bg-blue-100 text-blue-600' :
                                cookie.category === 'functional' ? 'bg-green-100 text-green-600' :
                                cookie.category === 'analytics' ? 'bg-purple-100 text-purple-600' :
                                'bg-orange-100 text-orange-600'}
                            `}>
                              {cookie.category}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="text-xs text-base-content/50 mt-4">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section droits */}
        <section className="mt-8 p-6 bg-base-200 rounded-xl">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-accent" />
            Vos droits concernant les cookies
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-base-300/50 rounded-lg">
              <h4 className="font-semibold mb-2">1. Consentement</h4>
              <p className="text-sm text-base-content/70">
                Vous pouvez accepter ou refuser les cookies non-essentiels à tout moment.
              </p>
            </div>
            
            <div className="p-4 bg-base-300/50 rounded-lg">
              <h4 className="font-semibold mb-2">2. Modification</h4>
              <p className="text-sm text-base-content/70">
                Vous pouvez modifier vos préférences à tout moment via ce panneau.
              </p>
            </div>
            
            <div className="p-4 bg-base-300/50 rounded-lg">
              <h4 className="font-semibold mb-2">3. Navigateur</h4>
              <p className="text-sm text-base-content/70">
                Vous pouvez également gérer les cookies via les paramètres de votre navigateur.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <div className="mt-8 p-4 bg-accent/5 rounded-xl border border-accent/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <p className="text-sm">
            <strong>Vous avez des questions ?</strong> Pour toute question concernant notre 
            utilisation des cookies, n'hésitez pas à nous contacter à{' '}
            <a href="mailto:privacy@eglise.com" className="text-accent hover:underline">
              privacy@eglise.com
            </a>
          </p>
        </div>
      </div>
    </LegalLayout>
  );
};

export default Cookies;