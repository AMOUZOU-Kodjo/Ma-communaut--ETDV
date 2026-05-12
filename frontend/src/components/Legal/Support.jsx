// components/Legal/Support.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import LegalLayout from "../Layout/LegalLayout";
import { 
  HeadphonesIcon, 
  Mail, 
  MessageCircle, 
  Phone, 
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Loader
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const Support = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: "normal"
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Votre message a été envoyé avec succès !");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        priority: "normal"
      });
    } catch (error) {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const supportOptions = [
    {
      icon: Mail,
      title: "Email",
      description: "support@eglise.com",
      action: "Envoyer un email",
      link: "mailto:support@eglise.com"
    },
    {
      icon: Phone,
      title: "Téléphone",
      description: "+228 91 03 87 27",
      action: "Appeler",
      link: "tel:+22891038727"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Disponible 24/7",
      action: "Chat",
      link: "https://wa.me/22891038727"
    },
    {
      icon: Clock,
      title: "Horaires",
      description: "Lun-Ven: 9h-18h",
      action: "Nous contacter",
      link: "/contact"
    }
  ];

  return (
    <LegalLayout
      title="Support"
      subtitle="Besoin d'aide ? Notre équipe est là pour vous"
      icon={HeadphonesIcon}
    >
      {/* Options de contact rapide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {supportOptions.map((option, index) => {
          const Icon = option.icon;
          
          return (
            <motion.a
              key={index}
              href={option.link}
              target={option.link.startsWith('http') ? "_blank" : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-base-200 rounded-xl hover:bg-base-300 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{option.title}</h3>
                  <p className="text-sm text-base-content/60 mb-2">
                    {option.description}
                  </p>
                  <span className="text-xs text-accent font-medium">
                    {option.action} →
                  </span>
                </div>
              </div>
            </motion.a>
          );
        })}
      </div>

      {/* Formulaire de contact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-base-200 rounded-2xl p-6"
      >
        <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nom complet *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Votre nom"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Sujet *
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Sujet de votre message"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Priorité
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="low">Basse (Question générale)</option>
              <option value="normal">Normale (Support standard)</option>
              <option value="high">Haute (Urgent)</option>
              <option value="critical">Critique (Problème majeur)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="6"
              className="w-full px-4 py-2 bg-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              placeholder="Décrivez votre problème ou votre question..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-accent py-3 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Envoi en cours...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Envoyer le message</span>
              </>
            )}
          </button>
        </form>
      </motion.div>

      {/* Engagement de réponse */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3"
      >
        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
        <p className="text-sm">
          <strong>Engagement de réponse :</strong> Nous nous engageons à répondre à 
          votre demande dans les 24 à 48 heures ouvrées.
        </p>
      </motion.div>
    </LegalLayout>
  );
};

export default Support;