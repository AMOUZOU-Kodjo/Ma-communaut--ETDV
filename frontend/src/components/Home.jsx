import React, { memo, useMemo } from "react";
import { FaFacebook, FaWhatsapp, FaTwitter, FaYoutube, FaHeart, FaCross, FaBible } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import monImage from "../assets/logo.jpg";
import Footer from "./Footer";
import Title from "./Title";
import NavBar from "./NavBar";

// Configuration centralisée
const HOME_CONFIG = {
  socialLinks: [
    {
      icon: FaFacebook,
      url: "https://www.facebook.com/profile.php?id=61564484227797",
      label: "Facebook",
      color: "hover:bg-blue-600"
    },
    {
      icon: FaWhatsapp,
      url: "https://wa.me/228910387",
      label: "WhatsApp",
      color: "hover:bg-green-600"
    },
    {
      icon: FaTwitter,
      url: "https://twitter.com/etde815",
      label: "Twitter",
      color: "hover:bg-sky-500"
    },
    {
      icon: FaYoutube,
      url: "https://www.youtube.com/@etde815",
      label: "YouTube",
      color: "hover:bg-red-600"
    }
  ],
  bibleVerse: {
    text: "Venez à moi, vous tous qui êtes fatigués et chargés, et je vous donnerai du repos.",
    reference: "Matthieu 11:28"
  },
  features: [
    { icon: FaHeart, text: "Amour et Compassion" },
    { icon: FaCross, text: "Foi et Espérance" },
    { icon: FaBible, text: "Enseignement Biblique" }
  ]
};

// Composant pour les icônes sociales
const SocialIcon = memo(({ Icon, url, label, color }) => {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`
        group relative rounded-full border-2 border-accent p-3 text-2xl
        text-accent transition-all duration-300 hover:text-white
        hover:shadow-lg hover:-translate-y-1 ${color}
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Icon className="transition-transform duration-300 group-hover:scale-110" />
      
      {/* Tooltip */}
      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                       text-xs bg-base-300 px-2 py-1 rounded opacity-0 
                       group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        {label}
      </span>
    </motion.a>
  );
});

SocialIcon.displayName = 'SocialIcon';

// Composant pour les fonctionnalités
const FeatureCard = memo(({ Icon, text, index }) => {
  return (
    <motion.div
      className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="p-2 bg-accent/10 rounded-full">
        <Icon className="text-accent text-xl" />
      </div>
      <span className="text-base-content/80 font-medium">{text}</span>
    </motion.div>
  );
});

FeatureCard.displayName = 'FeatureCard';

// Composant principal
const Home = () => {
  // Mémorisation des données
  const { socialLinks, bibleVerse, features } = useMemo(() => HOME_CONFIG, []);

  // Variantes d'animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <NavBar />
      
      <main className="min-h-screen">
        {/* Hero Section avec parallax */}
        <section className="relative overflow-hidden bg-linear-to-br from-base-200 to-base-300">
          {/* Motif de fond décoratif */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />
          </div>

          {/* Éléments décoratifs flottants */}
          <motion.div
            className="absolute top-20 right-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center mb-12"
            >
              <Title 
                title="Bienvenue Au Temple du Dieu Vivant"
                subtitle="Un lieu de paix, d'amour et de renaissance spirituelle"
              />
            </motion.div>

            <div className="flex flex-col-reverse lg:flex-row justify-center items-center gap-12">
              {/* Section Texte */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="lg:w-3/4"
              >
                <div className="relative">
                  {/* Badge de bienvenue */}
                  <motion.div
                    className="absolute -top-9 left-4 bg-accent text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg"
                    initial={{ rotate: -10, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    🙏 Béni soit Dieu
                  </motion.div>

                  <div className="bg-base-200/80 backdrop-blur-sm border-l-4 border-accent p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    {/* Message d'accueil */}
                    <div className="prose prose-lg max-w-none">
                      <p className="text-base-content/80 leading-relaxed text-lg">
                        Nous sommes heureux de vous accueillir sur le site officiel de
                        notre communauté chrétienne. Ici, chaque âme est précieuse,
                        chaque cœur est une promesse, et chaque visite est une bénédiction.
                      </p>

                      {/* Verset biblique */}
                      <motion.div
                        className="my-8 p-6 bg-linear-to-r from-accent/20 to-transparent rounded-xl"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <blockquote className="text-center">
                          <p className="text-xl md:text-xl font-bold  mb-3">
                            "{bibleVerse.text}"
                          </p>
                          <footer className="text-accent font-semibold">
                            — {bibleVerse.reference}
                          </footer>
                        </blockquote>
                      </motion.div>

                      {/* Features */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
                        {features.map((feature, index) => (
                          <FeatureCard 
                            key={feature.text}
                            Icon={feature.icon}
                            text={feature.text}
                            index={index}
                          />
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-6 mt-8">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Link
                            to="/contact"
                            className="btn btn-accent btn-lg px-8 gap-2 shadow-lg hover:shadow-xl transition-all"
                          >
                            <span>Contactez-nous</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </Link>
                        </motion.div>

                        {/* Réseaux sociaux */}
                        <div className="flex gap-3">
                          {socialLinks.map((social, index) => (
                            <SocialIcon
                              key={index}
                              Icon={social.icon}
                              url={social.url}
                              label={social.label}
                              color={social.color}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Section Image */}
              <motion.div
                className="lg:w-1/2 flex justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="relative group">
                  {/* Cercles décoratifs */}
                  <div className="absolute inset-0 rounded-full bg-accent/20 blur-3xl group-hover:bg-accent/30 transition-all duration-500" />
                  
                  {/* Image principale */}
                  <motion.div
                    className="relative z-10"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img
                      src={monImage}
                      alt="Logo de l'église - Temple du Dieu Vivant"
                      className="w-64 h-64 md:w-96 md:h-96 object-cover rounded-full 
                               shadow-2xl border-4 border-accent
                               group-hover:shadow-accent/50 transition-all duration-300"
                      loading="lazy"
                    />
                  </motion.div>

                  {/* Badge flottant */}
                  <motion.div
                    className="absolute -bottom-4 -right-4 bg-accent text-white 
                               px-4 py-2 rounded-full text-sm font-semibold shadow-lg z-20"
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    Depuis 2000 ✨
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section Statistiques */}
        <section className="bg-base-200 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: "24+", label: "Années de service", icon: "⏳" },
                { value: "500+", label: "Membres", icon: "👥" },
                { value: "1000+", label: "Âmes touchées", icon: "❤️" },
                { value: "50+", label: "Projets", icon: "🤝" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-accent">{stat.value}</div>
                  <div className="text-sm text-base-content/60">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      
    </>
  );
};

// Optimisation avec memo
export default memo(Home);