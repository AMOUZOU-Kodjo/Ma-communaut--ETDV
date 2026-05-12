// components/Legal/FAQ.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LegalLayout from "../Layout/LegalLayout";
import { Link } from "react-router-dom";
import { HelpCircle, ChevronDown, Search, MessageCircle } from "lucide-react";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState([]);

  const faqData = [
    {
      category: "Général",
      questions: [
        {
          q: "Quels sont les horaires des cultes ?",
          a: "Nos cultes ont lieu tous les dimanches à 9h00 et 18h00. Nous avons également des réunions de prière du mardi au samedi à 18h00."
        },
        {
          q: "Comment puis-je devenir membre de l'église ?",
          a: "Pour devenir membre, vous pouvez participer à nos cultes pendant quelques semaines, puis rencontrer le pasteur après un culte pour exprimer votre désir de vous engager. Nous organisons également des classes de membership plusieurs fois par an."
        },
        {
          q: "Où se situe l'église exactement ?",
          a: "Notre église est située à Lomé, Togo. L'adresse exacte vous sera communiquée lors de votre première visite ou sur demande par email."
        }
      ]
    },
    {
      category: "Dons et offrandes",
      questions: [
        {
          q: "Comment puis-je faire un don ?",
          a: "Vous pouvez faire un don en espèces lors des cultes, par virement bancaire (coordonnées disponibles sur demande), ou via notre plateforme de don en ligne (bientôt disponible)."
        },
        {
          q: "Les dons sont-ils déductibles ?",
          a: "En tant qu'association cultuelle, nous pouvons fournir des reçus pour les dons. Veuillez nous contacter pour plus d'informations sur la déductibilité selon votre situation."
        }
      ]
    },
    {
      category: "Événements",
      questions: [
        {
          q: "Comment puis-je participer aux événements spéciaux ?",
          a: "Tous nos événements sont ouverts à tous. Vous pouvez vous inscrire via notre site web dans la section Événements, ou simplement vous présenter le jour de l'événement."
        },
        {
          q: "Organisez-vous des événements pour les enfants ?",
          a: "Oui, nous avons une école du dimanche pour les enfants pendant le culte principal, ainsi que des camps de vacances et des activités spéciales pendant les vacances scolaires."
        }
      ]
    },
    {
      category: "Médias",
      questions: [
        {
          q: "Puis-je regarder les cultes en ligne ?",
          a: "Oui, nous diffusons certains de nos cultes en direct sur notre chaîne YouTube et les replays sont disponibles sur notre site dans la section Galerie."
        },
        {
          q: "Comment puis-je télécharger les enseignements audio ?",
          a: "Tous nos enseignements audio sont disponibles en téléchargement gratuit dans la section Galerie/Audios de notre site."
        }
      ]
    },
    {
      category: "Contact",
      questions: [
        {
          q: "Comment contacter le pasteur ?",
          a: "Vous pouvez contacter le pasteur via notre formulaire de contact, par email à pasteur@eglise.com, ou après les cultes."
        },
        {
          q: "Puis-je demander une prière spécifique ?",
          a: "Absolument ! Vous pouvez soumettre vos demandes de prière via notre formulaire de contact, et notre équipe de prière intercédera pour vous."
        }
      ]
    }
  ];

  const toggleItem = (categoryIndex, questionIndex) => {
    const itemId = `${categoryIndex}-${questionIndex}`;
    setOpenItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const filteredFaq = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <LegalLayout
      title="Foire Aux Questions"
      subtitle="Trouvez rapidement des réponses à vos questions"
      icon={HelpCircle}
    >
      {/* Barre de recherche */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
          <input
            type="text"
            placeholder="Rechercher une question..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-base-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      {/* FAQ par catégorie */}
      <div className="space-y-8">
        {filteredFaq.map((category, categoryIndex) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
          >
            <h2 className="text-2xl font-bold text-accent mb-4">
              {category.category}
            </h2>
            <div className="space-y-3">
              {category.questions.map((item, questionIndex) => {
                const itemId = `${categoryIndex}-${questionIndex}`;
                const isOpen = openItems.includes(itemId);
                
                return (
                  <motion.div
                    key={questionIndex}
                    className="bg-base-200 rounded-xl overflow-hidden"
                    initial={false}
                  >
                    <button
                      onClick={() => toggleItem(categoryIndex, questionIndex)}
                      className="w-full p-4 text-left flex items-start justify-between gap-4 hover:bg-base-300 transition-colors"
                    >
                      <span className="font-medium flex-1">{item.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-accent transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0 border-t border-base-300">
                            <p className="text-base-content/80 leading-relaxed">
                              {item.a}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}

        {filteredFaq.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <MessageCircle className="w-16 h-16 mx-auto text-base-content/20 mb-4" />
            <p className="text-lg text-base-content/50 mb-4">
              Aucune question ne correspond à votre recherche
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="btn btn-accent"
            >
              Voir toutes les questions
            </button>
          </motion.div>
        )}
      </div>

      {/* Contact rapide */}
      <div className="mt-12 p-6 bg-accent/5 rounded-2xl border border-accent/20">
        <h3 className="text-xl font-bold mb-4">Vous ne trouvez pas votre réponse ?</h3>
        <p className="mb-6">
          Notre équipe est disponible pour répondre à toutes vos questions.
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
    </LegalLayout>
  );
};

export default FAQ;