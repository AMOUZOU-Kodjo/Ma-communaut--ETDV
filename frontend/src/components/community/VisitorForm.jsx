// components/community/VisitorForm.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Users, 
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Loader,
  Heart,
  Church,
  Clock
} from 'lucide-react';
import { useCommunity } from '../../context/CommunityContext';

const VisitorForm = () => {
  const { addVisitor, loading } = useCommunity();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    address: '',
    city: '',
    country: 'Togo',
    visitDate: '',
    visitTime: '',
    numberOfPeople: 1,
    message: '',
    consent: false
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = 'Prénom requis';
    if (!formData.lastName) newErrors.lastName = 'Nom requis';
    if (!formData.email) {
      newErrors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.phone) newErrors.phone = 'Téléphone requis';
    if (!formData.birthDate) newErrors.birthDate = 'Date de naissance requise';
    if (!formData.visitDate) newErrors.visitDate = "Date de visite requise";
    if (!formData.consent) newErrors.consent = 'Vous devez accepter les conditions';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      try {
        await addVisitor(formData);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            birthDate: '',
            address: '',
            city: '',
            country: 'Togo',
            visitDate: '',
            visitTime: '',
            numberOfPeople: 1,
            message: '',
            consent: false
          });
          setCurrentStep(1);
        }, 3000);
      } catch (error) {
        console.error('Submission error:', error);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const steps = [
    { number: 1, title: 'Informations personnelles', icon: User },
    { number: 2, title: 'Détails de la visite', icon: Calendar },
    { number: 3, title: 'Confirmation', icon: CheckCircle }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-block p-4 bg-accent/10 rounded-full mb-4">
          <Church className="w-12 h-12 text-accent" />
        </div>
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-accent to-pink-500 bg-clip-text text-transparent">
          Nous rendre visite
        </h1>
        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
          Remplissez ce formulaire pour planifier votre visite. Nous serons ravis de vous accueillir !
        </p>
      </motion.div>

      {/* Barre de progression */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step) => (
            <div key={step.number} className="flex-1 text-center">
              <div className={`
                w-10 h-10 mx-auto rounded-full flex items-center justify-center
                transition-all duration-300
                ${currentStep >= step.number 
                  ? 'bg-accent text-white' 
                  : 'bg-base-300 text-base-content/50'
                }
              `}>
                <step.icon className="w-5 h-5" />
              </div>
              <p className={`
                text-sm mt-2 font-medium
                ${currentStep >= step.number ? 'text-accent' : 'text-base-content/50'}
              `}>
                {step.title}
              </p>
            </div>
          ))}
        </div>
        <div className="relative mt-4">
          <div className="absolute top-0 left-0 h-1 bg-base-300 w-full rounded" />
          <motion.div 
            className="absolute top-0 left-0 h-1 bg-accent rounded"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-green-500/10 border border-green-500 rounded-2xl p-8 text-center"
          >
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Inscription réussie !</h2>
            <p className="text-base-content/70 mb-4">
              Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-base-content/50">
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>Que Dieu vous bénisse</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="bg-base-200 rounded-2xl p-6 md:p-8 shadow-xl"
          >
            {/* Étape 1: Informations personnelles */}
            {currentStep === 1 && (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-accent" />
                  Informations personnelles
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Prénom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`
                        w-full px-4 py-3 bg-base-100 rounded-lg border-2 transition-all
                        ${errors.firstName 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-transparent focus:border-accent focus:ring-accent'
                        }
                      `}
                      placeholder="Votre prénom"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`
                        w-full px-4 py-3 bg-base-100 rounded-lg border-2 transition-all
                        ${errors.lastName 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-transparent focus:border-accent focus:ring-accent'
                        }
                      `}
                      placeholder="Votre nom"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`
                        w-full px-4 py-3 bg-base-100 rounded-lg border-2 transition-all
                        ${errors.email 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-transparent focus:border-accent focus:ring-accent'
                        }
                      `}
                      placeholder="votre@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Téléphone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`
                        w-full px-4 py-3 bg-base-100 rounded-lg border-2 transition-all
                        ${errors.phone 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-transparent focus:border-accent focus:ring-accent'
                        }
                      `}
                      placeholder="+228 XX XX XX XX"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Date de naissance <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className={`
                      w-full px-4 py-3 bg-base-100 rounded-lg border-2 transition-all
                      ${errors.birthDate 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-transparent focus:border-accent focus:ring-accent'
                      }
                    `}
                  />
                  {errors.birthDate && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.birthDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Adresse
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-base-100 rounded-lg border-2 border-transparent focus:border-accent focus:ring-accent transition-all"
                    placeholder="Votre adresse"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Ville
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-base-100 rounded-lg border-2 border-transparent focus:border-accent focus:ring-accent transition-all"
                      placeholder="Votre ville"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Pays
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-base-100 rounded-lg border-2 border-transparent focus:border-accent focus:ring-accent transition-all"
                    >
                      <option value="Togo">Togo</option>
                      <option value="Bénin">Bénin</option>
                      <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                      <option value="France">France</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Étape 2: Détails de la visite */}
            {currentStep === 2 && (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-accent" />
                  Détails de la visite
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Date de visite <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="visitDate"
                      value={formData.visitDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`
                        w-full px-4 py-3 bg-base-100 rounded-lg border-2 transition-all
                        ${errors.visitDate 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-transparent focus:border-accent focus:ring-accent'
                        }
                      `}
                    />
                    {errors.visitDate && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.visitDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Heure de visite
                    </label>
                    <input
                      type="time"
                      name="visitTime"
                      value={formData.visitTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-base-100 rounded-lg border-2 border-transparent focus:border-accent focus:ring-accent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nombre de personnes
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ 
                        ...prev, 
                        numberOfPeople: Math.max(1, prev.numberOfPeople - 1)
                      }))}
                      className="w-10 h-10 rounded-full bg-base-300 hover:bg-accent hover:text-white transition-colors"
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold w-12 text-center">
                      {formData.numberOfPeople}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ 
                        ...prev, 
                        numberOfPeople: prev.numberOfPeople + 1
                      }))}
                      className="w-10 h-10 rounded-full bg-base-300 hover:bg-accent hover:text-white transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Message (optionnel)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 bg-base-100 rounded-lg border-2 border-transparent focus:border-accent focus:ring-accent transition-all"
                    placeholder="Dites-nous en plus sur votre visite..."
                  />
                </div>
              </motion.div>
            )}

            {/* Étape 3: Confirmation */}
            {currentStep === 3 && (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  Confirmation
                </h2>

                <div className="bg-base-100 rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-lg">Récapitulatif</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-base-content/50">Nom complet</p>
                      <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-base-content/50">Email</p>
                      <p className="font-medium">{formData.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-base-content/50">Téléphone</p>
                      <p className="font-medium">{formData.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-base-content/50">Date de naissance</p>
                      <p className="font-medium">{new Date(formData.birthDate).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-base-content/50">Date de visite</p>
                      <p className="font-medium">{new Date(formData.visitDate).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-base-content/50">Nombre de personnes</p>
                      <p className="font-medium">{formData.numberOfPeople}</p>
                    </div>
                  </div>

                  {formData.message && (
                    <div>
                      <p className="text-sm text-base-content/50">Message</p>
                      <p className="text-base-content/80 italic">"{formData.message}"</p>
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-3 p-4 bg-base-100 rounded-lg">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-accent rounded focus:ring-accent"
                  />
                  <div>
                    <label className="text-sm font-medium">
                      J'accepte que mes données soient utilisées pour organiser ma visite
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <p className="text-xs text-base-content/50 mt-1">
                      Conformément à la politique de confidentialité, vos données sont sécurisées 
                      et utilisées uniquement dans le cadre de votre visite.
                    </p>
                    {errors.consent && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.consent}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Boutons de navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-base-300">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="px-6 py-3 bg-base-300 hover:bg-base-400 rounded-lg font-medium transition-colors"
                >
                  Précédent
                </button>
              )}
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="ml-auto px-6 py-3 bg-accent hover:bg-accent/80 text-white rounded-lg font-medium transition-colors"
                >
                  Suivant
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto px-8 py-3 bg-accent hover:bg-accent/80 text-white rounded-lg font-medium transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    'Confirmer ma visite'
                  )}
                </button>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Informations supplémentaires */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-10 grid md:grid-cols-3 gap-6"
      >
        <div className="bg-base-200 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-accent" />
          </div>
          <h3 className="font-semibold mb-2">Horaires des cultes</h3>
          <p className="text-sm text-base-content/70">Dimanche: 08h00 - 12h00</p>
          <p className="text-sm text-base-content/70">Mercredi: 18h00 - 20h00</p>
        </div>

        <div className="bg-base-200 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-6 h-6 text-accent" />
          </div>
          <h3 className="font-semibold mb-2">Notre adresse</h3>
          <p className="text-sm text-base-content/70">Lomé, Togo</p>
          <p className="text-sm text-base-content/70">Quartier Tokoin</p>
        </div>

        <div className="bg-base-200 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-accent" />
          </div>
          <h3 className="font-semibold mb-2">Accueil des visiteurs</h3>
          <p className="text-sm text-base-content/70">Un accueil chaleureux vous attend</p>
          <p className="text-sm text-base-content/70">Visite guidée sur demande</p>
        </div>
      </motion.div>
    </div>
  );
};

export default VisitorForm;