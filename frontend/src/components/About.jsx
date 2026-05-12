import React, { memo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Title from "./Title";
import NavBar from "./NavBar";
import Footer from "./Footer";

// ================= CONFIG =================
const SECTIONS = [
  {
    id: "histoire",
    title: "Notre Histoire",
    icon: "\U0001F4DC",
    content:
      "Notre église a été fondée en 2000 avec pour mission de servir notre communauté chrétienne.",
    color: "border-yellow-500",
    gradient: "from-yellow-500/10",
  },
  {
    id: "mission",
    title: "Notre Mission",
    icon: "\u2728",
    content:
      "Aimer Dieu, servir notre prochain et faire grandir la foi en Jésus-Christ.",
    color: "border-blue-500",
    gradient: "from-blue-500/10",
  },
  {
    id: "engagement",
    title: "Notre Engagement",
    icon: "\U0001F91D",
    content:
      "Nous servons notre communauté avec amour et dévouement depuis 2000.",
    color: "border-green-500",
    gradient: "from-green-500/10",
  },
];

const STATS = [
  { label: "Années d'existence", value: "24+", icon: "\u23F3" },
  { label: "Membres actifs", value: "500+", icon: "\U0001F465" },
  { label: "Projets", value: "50+", icon: "\U0001F932" },
];

// ================= COMPONENTS =================

const SectionCard = memo(({ section }) => (
  <article
    className={`group relative bg-base-200 border-l-4 ${section.color}
    rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300`}
  >
    <div
      className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-0 group-hover:opacity-100 transition`}
    />

    <div className="relative z-10 text-center space-y-4">
      <div className="text-4xl">{section.icon}</div>

      <h3 className="text-xl font-bold">{section.title}</h3>

      <p className="text-base-content/70">{section.content}</p>
    </div>
  </article>
));

SectionCard.propTypes = {
  section: PropTypes.object.isRequired,
};

const StatsSection = () => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {STATS.map((stat) => (
      <div
        key={stat.label}
        className="bg-base-200 p-6 rounded-2xl text-center shadow-md hover:shadow-lg transition"
      >
        <div className="text-3xl mb-2">{stat.icon}</div>
        <p className="text-2xl font-bold text-accent">{stat.value}</p>
        <p className="text-sm opacity-70">{stat.label}</p>
      </div>
    ))}
  </div>
);

// ================= MAIN =================

const About = () => {
  return (
    <>
      <NavBar />

      <main className="min-h-screen">

        {/* HERO */}
        <section className="bg-gradient-to-br from-base-200 to-base-300 py-20 text-center">
          <div className="container mx-auto px-4 max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-accent">À Propos</span> de Nous
            </h1>
            <p className="text-lg opacity-70">
              Découvrez notre mission, notre vision et notre communauté.
            </p>
          </div>
        </section>

        {/* SECTIONS */}
        <section className="container mx-auto px-4 py-16">
          <Title
            title="En savoir plus"
            subtitle="Notre foi et notre engagement"
          />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-10">
            {SECTIONS.map((section) => (
              <SectionCard key={section.id} section={section} />
            ))}
          </div>
        </section>

        {/* STATS */}
        <section className="bg-base-200 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10">
              Notre Impact
            </h2>
            <StatsSection />
          </div>
        </section>

        {/* COMMUNITY */}
        <section className="bg-base-200 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Notre Communauté
            </h2>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto mb-8">
              Rejoignez notre communauté chrétienne chaleureuse et vivante. 
              Ensemble, nous grandissons dans la foi, l'amour et le service.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/contact"
                className="btn btn-accent btn-lg px-8"
              >
                Nous contacter
              </Link>
              <Link
                to="/visite"
                className="btn btn-outline btn-lg px-8"
              >
                Planifier une visite
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-accent to-accent/80 py-16 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Rejoignez-nous
          </h2>
          <p className="mb-6 opacity-90">
            Venez vivre la foi avec nous.
          </p>

          <Link
            to="/visite"
            className="btn btn-outline border-white text-white hover:bg-white hover:text-accent"
          >
            Nous rendre visite
          </Link>
        </section>

      </main>

     
    </>
  );
};

export default About;