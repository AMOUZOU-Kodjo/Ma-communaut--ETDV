import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaFacebook, FaWhatsapp, FaTwitter, FaYoutube
} from "react-icons/fa";
import { 
  Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle,
  Loader, Heart, ChevronUp, ChevronDown, Sun, Moon,
  Home, Info, CalendarDays, NotebookPen, Image as ImageIcon, MessageSquare,
  ArrowRight
} from "lucide-react";
import monImage from "../assets/logo.jpg";
import { Link, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const FOOTER_CONFIG = {
  API_URL: '/api/subscribe',
  churchInfo: {
    name: "Temple du Dieu Vivant",
    phone: "+228 91 03 87 27",
    email: "etdv@gmail.com",
    address: "Lomé, Togo",
    founded: 2000,
    hours: [
      { day: "Lun - Ven", hours: "09:00 - 18:00" },
      { day: "Samedi", hours: "09:00 - 12:00" },
      { day: "Dimanche", hours: "08:00 - 12:00" }
    ]
  },
  navigationLinks: [
    { name: "Accueil", path: "/", Icon: Home },
    { name: "À propos", path: "/about", Icon: Info },
    { name: "Événements", path: "/events", Icon: CalendarDays },
    { name: "Programmes", path: "/programs", Icon: NotebookPen },
    { name: "Galerie", path: "/gallery", Icon: ImageIcon },
    { name: "Contact", path: "/contact", Icon: MessageSquare }
  ],
  socialLinks: [
    { icon: FaFacebook, url: "https://www.facebook.com/profile.php?id=61564484227797", label: "Facebook", color: "hover:bg-[#1877f2]" },
    { icon: FaWhatsapp, url: "https://wa.me/22891038727", label: "WhatsApp", color: "hover:bg-[#25D366]" },
    { icon: FaTwitter, url: "https://twitter.com/etde815", label: "Twitter", color: "hover:bg-[#1DA1F2]" },
    { icon: FaYoutube, url: "https://www.youtube.com/@etde815", label: "YouTube", color: "hover:bg-[#FF0000]" }
  ],
  quickLinks: [
    { name: "Mentions légales", path: "/legal" },
    { name: "Politique de confidentialité", path: "/privacy" },
    { name: "FAQ", path: "/faq" },
    { name: "Support", path: "/support" }
  ],
  animationVariants: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }
};

const NewsletterForm = ({ onSubscribe }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) { setError("Email invalide"); return; }
    setLoading(true); setError("");
    try {
      await onSubscribe({ email, name, type: "abonnee" });
      setSuccess(true); setEmail(""); setName("");
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Erreur lors de l'inscription");
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input type="text" placeholder="Votre nom (optionnel)" value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-2 bg-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all text-sm" />
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
        <input type="email" placeholder="Votre email" value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }} required
          className={`w-full pl-10 pr-4 py-2 bg-base-300 rounded-lg focus:outline-none focus:ring-2 transition-all text-sm ${error ? 'focus:ring-red-500 border-red-500' : 'focus:ring-accent'}`} />
      </div>
      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />{error}
        </motion.p>
      )}
      <button type="submit" disabled={loading || success}
        className={`w-full py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 text-sm
          ${success ? 'bg-green-500 text-white' : 'bg-accent hover:bg-accent/80 text-white hover:scale-105'}
          disabled:opacity-50 disabled:cursor-not-allowed`}>
        {loading ? <><Loader className="w-4 h-4 animate-spin" /><span>Inscription...</span></>
        : success ? <><CheckCircle className="w-4 h-4" /><span>Inscrit !</span></>
        : <><Send className="w-4 h-4" /><span>S'abonner</span></>}
      </button>
      <p className="text-xs text-base-content/50 text-center">En vous inscrivant, vous acceptez de recevoir nos actualités</p>
    </form>
  );
};

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const toggle = () => setIsVisible(window.pageYOffset > 300);
    window.addEventListener("scroll", toggle);
    return () => window.removeEventListener("scroll", toggle);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 right-4 p-3 bg-accent text-white rounded-full shadow-lg hover:shadow-xl transition-all z-50 group"
          aria-label="Retour en haut">
          <ChevronUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const ThemeToggleMini = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
      onClick={toggleTheme} className="p-2 rounded-lg bg-base-300 hover:bg-base-400 transition-colors"
      aria-label={isDarkMode ? "Mode clair" : "Mode sombre"}>
      {isDarkMode ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-blue-500" />}
    </motion.button>
  );
};

const Footer = () => {
  const [stats, setStats] = useState({ subscribers: 0, yearFounded: 2000 });
  const [showFullLinks, setShowFullLinks] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const loadSubscribers = async () => {
      try {
        const { data } = await api.get('/api/subscribe/count');
        setStats(prev => ({ ...prev, subscribers: data.total || 0 }));
      } catch { /* silencieux */ }
    };
    loadSubscribers();
  }, []);

  const handleSubscribe = useCallback(async (data) => {
    try {
      await api.post(FOOTER_CONFIG.API_URL, { email: data.email, nom: data.name });
      setStats(prev => ({ ...prev, subscribers: prev.subscribers + 1 }));
      toast.success("Inscription réussie ! Merci de nous rejoindre.", { icon: '🎉', duration: 4000 });
    } catch {
      toast.error("Échec de l'inscription. Veuillez réessayer.");
      throw new Error();
    }
  }, []);

  const yearsActive = useMemo(() => new Date().getFullYear() - stats.yearFounded, [stats.yearFounded]);

  return (
    <>
      <footer className="relative bg-base-200 text-base-content pt-16 pb-8 overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-pink-500 to-accent" />

        <div className="container mx-auto  relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Logo et infos */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={FOOTER_CONFIG.animationVariants} className="space-y-4">
              <div className="flex items-center gap-3">
                <motion.img whileHover={{ scale: 1.1, rotate: 5 }}
                  src={monImage} alt="Logo" className="w-10 h-10 rounded-full border border-accent shadow-lg" />
                <div>
                  <h3 className="text-lg font-bold text-accent">{FOOTER_CONFIG.churchInfo.name}</h3>
                  <p className="text-xs text-base-content/60">Depuis {FOOTER_CONFIG.churchInfo.founded}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-base-content/80">
                Une communauté de foi vivante, engagée à servir Dieu et à aimer notre prochain.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{yearsActive}+</div>
                  <div className="text-xs text-base-content/60">Ans de service</div>
                </div>
                <div className="w-px h-8 bg-base-300" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{stats.subscribers}+</div>
                  <div className="text-xs text-base-content/60">Abonnés</div>
                </div>
              </div>
            </motion.div>

            {/* Navigation */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={FOOTER_CONFIG.animationVariants} transition={{ delay: 0.1 }}>
              <h3 className="text-lg font-bold text-accent mb-4 flex items-center gap-2">
                <span>Navigation</span>
                <div className="h-px flex-1 bg-gradient-to-r from-accent to-transparent" />
              </h3>
              <ul className="space-y-2">
                {FOOTER_CONFIG.navigationLinks.map((link) => (
                  <motion.li key={link.path} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Link to={link.path}
                      className={`flex items-center gap-3 text-sm hover:text-accent transition-colors group
                        ${location.pathname === link.path ? 'text-accent font-medium' : ''}`}>
                      <span className="w-7 h-7 rounded-lg bg-base-300/50 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                        <link.Icon className="w-3.5 h-3.5" />
                      </span>
                      <span>{link.name}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <button onClick={() => setShowFullLinks(!showFullLinks)}
                className="mt-4 text-xs text-accent hover:underline flex items-center gap-1">
                {showFullLinks ? 'Voir moins' : 'Plus de liens'}
                {showFullLinks ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              <AnimatePresence>
                {showFullLinks && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-2">
                    <ul className="space-y-2 pl-6 border-l-2 border-accent/30">
                      {FOOTER_CONFIG.quickLinks.map((link) => (
                        <li key={link.path}>
                          <Link to={link.path} className="text-xs hover:text-accent transition-colors">{link.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Contact */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={FOOTER_CONFIG.animationVariants} transition={{ delay: 0.2 }}>
              <h3 className="text-lg font-bold text-accent mb-4 flex items-center gap-2">
                <span>Contact</span>
                <div className="h-px flex-1 bg-gradient-to-r from-accent to-transparent" />
              </h3>
              <ul className="space-y-3">
                {[
                  { Icon: Phone, href: `tel:${FOOTER_CONFIG.churchInfo.phone}`, text: FOOTER_CONFIG.churchInfo.phone },
                  { Icon: Mail, href: `mailto:${FOOTER_CONFIG.churchInfo.email}`, text: FOOTER_CONFIG.churchInfo.email },
                  { Icon: MapPin, href: null, text: FOOTER_CONFIG.churchInfo.address }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <item.Icon className="w-4 h-4 text-accent" />
                    </div>
                    {item.href ? (
                      <a href={item.href} className="hover:text-accent transition-colors">{item.text}</a>
                    ) : (
                      <span>{item.text}</span>
                    )}
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-3 bg-base-300/50 rounded-lg">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent" />Horaires
                </h4>
                <ul className="space-y-1 text-xs text-base-content/70">
                  {FOOTER_CONFIG.churchInfo.hours.map((item, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{item.day}</span>
                      <span className="font-medium">{item.hours}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Newsletter */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={FOOTER_CONFIG.animationVariants} transition={{ delay: 0.3 }}>
              <h3 className="text-lg font-bold text-accent mb-4 flex items-center gap-2">
                <span>Newsletter</span>
                <div className="h-px flex-1 bg-gradient-to-r from-accent to-transparent" />
              </h3>
              <p className="text-sm text-base-content/70 mb-4">
                Recevez nos dernières actualités et méditations directement dans votre boîte mail.
              </p>
              <NewsletterForm onSubscribe={handleSubscribe} />
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-3">Suivez-nous</h4>
                <div className="flex items-center gap-2">
                  {FOOTER_CONFIG.socialLinks.map((social, i) => {
                    const Icon = social.icon;
                    return (
                      <motion.a key={i} whileHover={{ y: -3, scale: 1.1 }}
                        href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.label}
                        className={`p-3 rounded-full border border-accent text-accent transition-all duration-300 ${social.color} hover:text-white`}>
                        <Icon className="w-4 h-4" />
                      </motion.a>
                    );
                  })}
                  <div className="ml-auto"><ThemeToggleMini /></div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-accent to-transparent my-8" />

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-base-content/60">
              © {new Date().getFullYear()}
              <span className="text-accent font-bold mx-1">Temple du Dieu Vivant</span>
              - Tous droits réservés
            </p>
            <div className="flex gap-4 text-xs">
              <Link to="/legal" className="hover:text-accent transition-colors">Mentions légales</Link>
              <Link to="/privacy" className="hover:text-accent transition-colors">Confidentialité</Link>
              <Link to="/cookies" className="hover:text-accent transition-colors">Cookies</Link>
            </div>
            <p className="text-xs text-base-content/40 flex items-center gap-1">
              Fait avec <Heart className="w-3 h-3 text-red-500 fill-current" /> pour Dieu
            </p>
          </motion.div>
        </div>
      </footer>
      <BackToTop />
    </>
  );
};

export default Footer;