import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Loader,
  Clock,
  Copy,
  Check,
  FileText,
  Download,
  Printer,
  XCircle,
  Info,
  Shield,
  Eye,
  EyeOff,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../context/AuthContext";

// ==================== CONFIGURATION ====================
const REQUEST_TIMEOUT = 15000;
const MAX_RETRY_COUNT = 3;

const CHURCH_INFO = {
  name: "Église Temple du Dieu Vivant",
  email: "contact@eglise.com",
  phone: "+228 90 00 00 00",
  phoneFormatted: "+228 90 00 00 00",
  address: "Lomé, Togo",
  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.123456!2d0.914092!3d6.683333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1026bf002690c053%3A0x34ca13adae2ad0f!2sETDV+BANIKOP%C3%89+(Temple+B%C3%A9thel),+Togo!5e0!3m2!1sfr!2stg!4v1690000000000!5m2!1sfr!2stg",
  hours: [
    { day: "Lundi - Vendredi", hours: "09:00 - 18:00" },
    { day: "Samedi", hours: "18:00 - 19:30" },
    { day: "Dimanche", hours: "09:00 - 12:00" }
  ]
};

const INITIAL_FORM_STATE = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: ""
};

// ==================== TYPES DE STATUT ====================
const STATUS_TYPES = {
  IDLE: null,
  INFO: "info",
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning"
};

// ==================== HOOK PERSONNALISÉ ====================
const useContactForm = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [status, setStatus] = useState({ type: STATUS_TYPES.IDLE, message: "" });
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [trackingId, setTrackingId] = useState(null);
  const abortControllerRef = useRef(null);

  // Validation en temps réel
  const validateField = useCallback((name, value) => {
    switch (name) {
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : "Format d'email invalide";
      case "phone":
        return !value || /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(value) ? null : "Format de téléphone invalide";
      case "name":
        return value.trim().length >= 2 ? null : "Le nom doit contenir au moins 2 caractères";
      case "subject":
        return value.trim().length >= 3 ? null : "Le sujet doit contenir au moins 3 caractères";
      case "message":
        return value.trim().length >= 10 ? null : "Le message doit contenir au moins 10 caractères";
      default:
        return null;
    }
  }, []);

  const [fieldErrors, setFieldErrors] = useState({});

  // Validation complète
  const validateForm = useCallback(() => {
    const errors = {};
    const requiredFields = ["name", "email", "subject", "message"];
    
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) errors[field] = error;
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, validateField]);

  // Générer un ID de suivi
  const generateTrackingId = () => {
    return `MSG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
  };

  // Sauvegarder dans l'historique
  const saveToHistory = (data, trackingId, status) => {
    const historyItem = {
      ...data,
      trackingId,
      timestamp: new Date().toISOString(),
      status,
      id: Date.now()
    };
    setSubmissionHistory(prev => [historyItem, ...prev].slice(0, 10));
    localStorage.setItem("contactHistory", JSON.stringify([historyItem, ...JSON.parse(localStorage.getItem("contactHistory") || "[]")].slice(0, 10)));
  };

  // Charger l'historique au montage
  useEffect(() => {
    const saved = localStorage.getItem("contactHistory");
    if (saved) setSubmissionHistory(JSON.parse(saved));
  }, []);

  // Soumission avec retry
  const submitWithRetry = async (data, retryAttempt = 0) => {
    try {
      const response = await api.post('/api/contact', {
        nom: data.name,
        email: data.email,
        sujet: data.subject,
        message: data.message,
      }, { timeout: REQUEST_TIMEOUT });

      return { success: true, data: response.data };
    } catch (error) {
      if (error.code === 'ECONNABORTED' && retryAttempt < MAX_RETRY_COUNT - 1) {
        setRetryCount(retryAttempt + 1);
        return submitWithRetry(data, retryAttempt + 1);
      }
      const msg = error.response?.data?.error || error.message || "Erreur serveur";
      throw new Error(msg);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setStatus({ 
        type: STATUS_TYPES.ERROR, 
        message: "Veuillez corriger les erreurs dans le formulaire" 
      });
      return;
    }

    // Annuler toute requête en cours
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setLoading(true);
    setRetryCount(0);
    const newTrackingId = generateTrackingId();
    setTrackingId(newTrackingId);
    
    setStatus({ 
      type: STATUS_TYPES.INFO, 
      message: "Envoi en cours...",
      trackingId: newTrackingId
    });

    try {
      const result = await submitWithRetry(formData);
      
      if (result.success) {
        const successMessage = result.data.acknowledged 
          ? "✅ Message envoyé ! Un accusé de réception vous a été envoyé par email."
          : "✅ Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.";

        setStatus({ 
          type: STATUS_TYPES.SUCCESS, 
          message: successMessage,
          trackingId: newTrackingId,
          acknowledged: result.data.acknowledged
        });

        saveToHistory(formData, newTrackingId, "SUCCESS");
        setFormData(INITIAL_FORM_STATE);
        setFieldErrors({});
      }
    } catch (error) {
      console.error("Erreur de soumission:", error);
      
      let errorMessage = "Une erreur est survenue. Veuillez réessayer.";
      if (!navigator.onLine) {
        errorMessage = "📡 Pas de connexion internet. Vérifiez votre réseau.";
      } else if (error.name === "AbortError") {
        errorMessage = "⏱️ Requête annulée. Veuillez réessayer.";
      } else if (error.message === "Failed to fetch") {
        errorMessage = "🔌 Impossible de joindre le serveur. Veuillez réessayer plus tard.";
      }

      setStatus({ type: STATUS_TYPES.ERROR, message: errorMessage, trackingId: newTrackingId });
      saveToHistory(formData, newTrackingId, "ERROR");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    status,
    loading,
    retryCount,
    fieldErrors,
    submissionHistory,
    trackingId,
    handleSubmit,
    validateField,
    setFieldErrors
  };
};

// ==================== COMPOSANT PRINCIPAL ====================
const ContactForm = () => {
  const {
    formData,
    setFormData,
    status,
    loading,
    retryCount,
    fieldErrors,
    submissionHistory,
    trackingId,
    handleSubmit,
    validateField,
    setFieldErrors
  } = useContactForm();

  const [showHistory, setShowHistory] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validation en temps réel
    const error = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, [setFormData, validateField, setFieldErrors]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <>
      {/* Accusé de réception */}
      <AnimatePresence>
        {status.trackingId && status.type === STATUS_TYPES.SUCCESS && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 right-4 z-50 max-w-md"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-l-4 border-green-500 p-4">
              <div className="flex items-start gap-3">
                <div className="shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-green-600 dark:text-green-400 mb-1">
                    Accusé de réception
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Votre message a bien été reçu. Un email de confirmation vous a été envoyé.
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs font-mono flex items-center justify-between">
                    <span>N° suivi: {status.trackingId}</span>
                    <button
                      onClick={() => copyToClipboard(status.trackingId)}
                      className="text-accent hover:text-accent/80"
                    >
                      {copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button className="shrink-0">
                  <XCircle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* En-tête avec statistiques */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-primary to-accent bg-clip-text text-transparent"
          >
            Contactez-nous
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-base-content/70"
          >
            Nous sommes là pour répondre à vos questions et prier avec vous
          </motion.p>

          {/* Bouton historique */}
          {/* <button
            onClick={() => setShowHistory(!showHistory)}
            className="mt-4 btn btn-sm btn-outline gap-2"
          >
            <Clock className="w-4 h-4" />
            {showHistory ? "Masquer l'historique" : "Voir mes derniers messages"}
          </button> */}
        </div>

        Historique des soumissions
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-base-200 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Historique des messages</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {submissionHistory.length === 0 ? (
                    <p className="text-center text-base-content/50 py-4">
                      Aucun message envoyé récemment
                    </p>
                  ) : (
                    submissionHistory.map((item) => (
                      <div key={item.id} className="bg-base-100 p-3 rounded-lg text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{item.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            item.status === "SUCCESS" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-xs text-base-content/50 mb-1">{item.subject}</p>
                        <p className="text-xs font-mono bg-base-200 p-1 rounded">
                          {item.trackingId}
                        </p>
                        <p className="text-xs text-base-content/50 mt-1">
                          {new Date(item.timestamp).toLocaleString('fr-FR')}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grille principale */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Informations de contact */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-base-200 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
          >
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-accent flex items-center gap-2">
                <Info className="w-6 h-6" />
                {CHURCH_INFO.name}
              </h2>
              
              <div className="space-y-6">
                <ContactInfo 
                  icon={Mail} 
                  href={`mailto:${CHURCH_INFO.email}`}
                  text={CHURCH_INFO.email}
                  label="Email"
                />
                
                <ContactInfo 
                  icon={Phone} 
                  href={`tel:${CHURCH_INFO.phone}`}
                  text={CHURCH_INFO.phoneFormatted}
                  label="Téléphone"
                />
                
                <ContactInfo 
                  icon={MapPin} 
                  text={CHURCH_INFO.address}
                  label="Adresse"
                />

                {/* Horaires */}
                <div className="border-t border-base-300 pt-4 ">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent" />
                    Horaires d'ouverture
                  </h3>
                  <div className="space-y-2 text-sm ">
                    {CHURCH_INFO.hours.map((schedule, index) => (
                      <div key={index} className="flex justify-between ">
                        <span className="text-base-content/60">{schedule.day}</span>
                        <span className="font-medium">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Carte Google Maps */}
            {CHURCH_INFO.mapUrl && (
              <div className="h-64 w-full relative group">
                <iframe
                  src={CHURCH_INFO.mapUrl}
                  className="w-full h-full"
                  allowFullScreen
                  loading="lazy"
                  title="Localisation de l'église"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
              </div>
            )}
          </motion.div>

          {/* Formulaire de contact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-base-200 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300"
          >
            <h2 className="text-2xl font-bold mb-6 text-accent flex items-center gap-2">
              <Send className="w-6 h-6" />
              Envoyez-nous un message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <FormField
                label="Nom complet"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Kodjo Marcellin"
                error={fieldErrors.name}
                required
                disabled={loading}
                icon={User}
              />

              <FormField
                label="Adresse email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@gmail.com"
                error={fieldErrors.email}
                required
                disabled={loading}
                icon={Mail}
              />

              <FormField
                label="Téléphone (optionnel)"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+228 90 00 00 00"
                error={fieldErrors.phone}
                disabled={loading}
                icon={Phone}
              />

              <FormField
                label="Sujet"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Question sur les cultes"
                error={fieldErrors.subject}
                required
                disabled={loading}
                icon={FileText}
              />

              <FormField
                label="Message"
                name="message"
                type="textarea"
                value={formData.message}
                onChange={handleChange}
                placeholder="Décrivez votre demande en détail..."
                rows={5}
                error={fieldErrors.message}
                required
                disabled={loading}
              />

              {/* Indicateur de tentative */}
              {retryCount > 0 && (
                <div className="text-xs text-accent flex items-center gap-1">
                  <Loader className="w-3 h-3 animate-spin" />
                  Tentative {retryCount + 1}/{MAX_RETRY_COUNT}
                </div>
              )}

              <button
                type="submit"
                // disabled={loading || Object.keys(fieldErrors).length > 0}
                className="btn btn-accent w-full group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="flex items-center justify-center space-x-2">
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      <span>Envoyer le message</span>
                    </>
                  )}
                </span>
              </button>

              {/* Message de statut */}
              <AnimatePresence mode="wait">
                {status.message && (
                  <motion.div
                    key={status.type}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <StatusMessage status={status} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mention sécurité */}
              <div className="flex items-center gap-2 text-xs text-base-content/50 mt-4">
                <Shield className="w-3 h-3" />
                <span>Vos données sont protégées et ne seront jamais partagées</span>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  );
};

// ==================== COMPOSANTS RÉUTILISABLES ====================

const FormField = ({ 
  label, 
  name, 
  type, 
  value, 
  onChange, 
  placeholder, 
  rows, 
  error, 
  required, 
  disabled,
  icon: Icon 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);

  const baseClassName = `
    w-full px-4 py-3 bg-base-100 border rounded-lg 
    focus:outline-none focus:ring-2 transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    ${error && touched 
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
      : 'border-base-300 focus:ring-accent focus:border-accent'
    }
    ${Icon ? 'pl-10' : ''}
  `;

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <label htmlFor={name} className="text-sm font-medium text-base-content/80">
          {label} {required && <span className="text-accent ml-1">*</span>}
        </label>
        {error && touched && (
          <span className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {error}
          </span>
        )}
      </div>
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Icon className="w-4 h-4 text-base-content/40" />
          </div>
        )}
        
        {type === "textarea" ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={() => setTouched(true)}
            placeholder={placeholder}
            rows={rows}
            required={required}
            disabled={disabled}
            className={`${baseClassName} resize-none min-h-30`}
          />
        ) : (
          <input
            type={inputType}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={() => setTouched(true)}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={baseClassName}
          />
        )}
        
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content/60"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
};

const ContactInfo = ({ icon: Icon, href, text, label }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-start space-x-3 group">
      <div className="shrink-0">
        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
          <Icon className="w-5 h-5 text-accent" />
        </div>
      </div>
      <div className="flex-1">
        <p className="text-sm text-base-content/60 flex items-center gap-2">
          {label}
          {href && (
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              title="Copier"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <Copy className="w-3 h-3 text-base-content/40 hover:text-base-content/60" />
              )}
            </button>
          )}
        </p>
        {href ? (
          <a 
            href={href} 
            className="text-base-content hover:text-accent transition-colors font-medium break-all"
          >
            {text}
          </a>
        ) : (
          <p className="text-base-content font-medium">{text}</p>
        )}
      </div>
    </div>
  );
};

const StatusMessage = ({ status }) => {
  const config = {
    success: { 
      icon: CheckCircle, 
      bgColor: "bg-green-500", 
      textColor: "text-white",
      borderColor: "border-green-600"
    },
    error: { 
      icon: AlertCircle, 
      bgColor: "bg-red-500", 
      textColor: "text-white",
      borderColor: "border-red-600"
    },
    info: { 
      icon: Loader, 
      bgColor: "bg-blue-500", 
      textColor: "text-white",
      borderColor: "border-blue-600"
    },
    warning: { 
      icon: AlertCircle, 
      bgColor: "bg-yellow-500", 
      textColor: "text-white",
      borderColor: "border-yellow-600"
    }
  };

  const { icon: Icon, bgColor, textColor, borderColor } = config[status.type] || config.info;

  return (
    <div className={`${bgColor} ${textColor} p-4 rounded-lg flex items-start space-x-3 border-l-4 ${borderColor} shadow-lg`}>
      <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${status.type === "info" ? "animate-spin" : ""}`} />
      <div className="flex-1">
        <p className="text-sm font-medium">{status.message}</p>
        {status.trackingId && (
          <p className="text-xs mt-1 opacity-90 font-mono">
            Réf: {status.trackingId}
          </p>
        )}
        {status.acknowledged && (
          <p className="text-xs mt-1 opacity-90 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Accusé de réception envoyé
          </p>
        )}
      </div>
    </div>
  );
};

// Styles supplémentaires
const styles = `
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse-slow {
  animation: pulse 2s ease-in-out infinite;
}
`;

export default ContactForm;