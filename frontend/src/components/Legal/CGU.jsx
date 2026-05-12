// components/Legal/CGU.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import LegalLayout from "../Layout/LegalLayout";
import { 
  FileText, 
  Shield, 
  Scale, 
  Lock, 
  AlertCircle, 
  CheckCircle,
  HelpCircle,
  Mail
} from "lucide-react";

const CGU = () => {
  const sections = [
    {
      id: "acceptation",
      title: "1. Acceptation des conditions",
      icon: CheckCircle,
      content: (
        <div className="space-y-4">
          <p>
            En accédant et en utilisant le site web de l'Église Temple du Dieu Vivant (ETDV), 
            vous acceptez d'être lié par les présentes Conditions Générales d'Utilisation. 
            Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site.
          </p>
          <div className="bg-accent/5 p-4 rounded-lg">
            <p className="text-sm font-medium">📅 Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>
        </div>
      )
    },
    {
      id: "acces",
      title: "2. Accès au site",
      icon: Lock,
      content: (
        <div className="space-y-4">
          <p>
            L'accès au site est gratuit. Les frais d'accès et d'utilisation du réseau de 
            télécommunication sont à la charge de l'utilisateur.
          </p>
          <p>
            Nous nous réservons le droit de modifier, interrompre ou suspendre l'accès 
            à tout ou partie du site, sans préavis, pour des raisons de maintenance, 
            de mise à jour ou pour toute autre raison.
          </p>
        </div>
      )
    },
    {
      id: "contenu",
      title: "3. Propriété intellectuelle",
      icon: Scale,
      content: (
        <div className="space-y-4">
          <p>
            L'ensemble du contenu présent sur ce site (textes, images, vidéos, logos, 
        icônes, etc.) est la propriété exclusive de l'Église Temple du Dieu Vivant, 
            sauf mention contraire.
          </p>
          <p className="font-medium">Toute reproduction, représentation, modification ou diffusion est strictement interdite sans autorisation préalable.</p>
          <div className="bg-base-300/50 p-4 rounded-lg">
            <p className="text-sm">Pour toute demande d'utilisation, contactez-nous à : 
              <a href="mailto:contact@eglise.com" className="text-accent hover:underline ml-1">
                contact@eglise.com
              </a>
            </p>
          </div>
        </div>
      )
    },
    {
      id: "responsabilite",
      title: "4. Limitation de responsabilité",
      icon: Shield,
      content: (
        <div className="space-y-4">
          <p>
            Nous nous efforçons de maintenir l'exactitude des informations publiées, 
            mais nous ne pouvons garantir l'exhaustivité ou l'actualité du contenu.
          </p>
          <p>
            L'Église Temple du Dieu Vivant ne saurait être tenue responsable des 
            dommages directs ou indirects résultant de l'utilisation du site ou 
            de l'impossibilité d'y accéder.
          </p>
          <p>
            Les liens hypertextes présents sur le site peuvent diriger vers des sites 
            tiers. Nous n'exerçons aucun contrôle sur ces sites et déclinons toute 
            responsabilité quant à leur contenu.
          </p>
        </div>
      )
    },
    {
      id: "donnees",
      title: "5. Données personnelles",
      icon: Lock,
      content: (
        <div className="space-y-4">
          <p>
            Les informations recueillies via les formulaires de contact et d'inscription 
            sont traitées conformément à notre 
            <Link to="/privacy" className="text-accent hover:underline mx-1">
              Politique de Confidentialité
            </Link>.
          </p>
          <p>
            Conformément à la réglementation en vigueur, vous disposez d'un droit 
            d'accès, de rectification et de suppression de vos données.
          </p>
          <p className="text-sm">
            Pour exercer ces droits : <a href="mailto:privacy@eglise.com" className="text-accent">privacy@eglise.com</a>
          </p>
        </div>
      )
    },
    {
      id: "cookies",
      title: "6. Cookies",
      icon: FileText,
      content: (
        <div className="space-y-4">
          <p>
            Notre site utilise des cookies pour améliorer votre expérience de navigation. 
            En continuant à utiliser notre site, vous consentez à l'utilisation des cookies 
            conformément à notre 
            <Link to="/cookies" className="text-accent hover:underline mx-1">
              Politique des Cookies
            </Link>.
          </p>
          <p>
            Vous pouvez à tout moment modifier vos préférences en matière de cookies 
            via les paramètres de votre navigateur.
          </p>
        </div>
      )
    },
    {
      id: "modification",
      title: "7. Modification des CGU",
      icon: FileText,
      content: (
        <div className="space-y-4">
          <p>
            Nous nous réservons le droit de modifier les présentes conditions à tout moment. 
            Les modifications prennent effet dès leur publication sur le site.
          </p>
          <p>
            Il vous appartient de consulter régulièrement cette page pour prendre 
            connaissance des éventuelles modifications.
          </p>
        </div>
      )
    },
    {
      id: "loi",
      title: "8. Droit applicable",
      icon: Scale,
      content: (
        <div className="space-y-4">
          <p>
            Les présentes conditions sont régies par le droit togolais. En cas de litige, 
            les tribunaux de Lomé (Togo) sont seuls compétents.
          </p>
        </div>
      )
    }
  ];

  const summaryPoints = [
    {
      icon: CheckCircle,
      text: "Utilisation gratuite du site"
    },
    {
      icon: Lock,
      text: "Contenu protégé par le droit d'auteur"
    },
    {
      icon: Shield,
      text: "Protection de vos données personnelles"
    },
    {
      icon: Scale,
      text: "Droit togolais applicable"
    }
  ];

  return (
    <LegalLayout
      title="Conditions Générales d'Utilisation"
      subtitle="Les règles qui régissent l'utilisation de notre site web"
      icon={FileText}
    >
      <div className="space-y-8">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-accent/5 p-6 rounded-xl border border-accent/20"
        >
          <p className="text-lg leading-relaxed">
            Bienvenue sur le site officiel de l'<strong>Église Temple du Dieu Vivant (ETDV)</strong>. 
            Les présentes conditions générales d'utilisation définissent les règles d'accès et d'utilisation 
            de notre site web. Nous vous invitons à les lire attentivement.
          </p>
        </motion.div>

        {/* Résumé rapide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {summaryPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div key={index} className="bg-base-200 p-4 rounded-xl text-center">
                <Icon className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="text-xs font-medium">{point.text}</p>
              </div>
            );
          })}
        </motion.div>

        {/* Sections détaillées */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            
            return (
              <motion.section
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-base-200 rounded-xl overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold text-accent">{section.title}</h2>
                  </div>
                  
                  <div className="prose max-w-none text-base-content/80 leading-relaxed">
                    {section.content}
                  </div>
                </div>
              </motion.section>
            );
          })}
        </div>

        {/* Contact et support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 bg-gradient-to-r from-accent/10 to-accent/5 rounded-2xl border border-accent/20"
        >
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-accent" />
                Besoin d'aide ?
              </h3>
              <p className="mb-4">
                Si vous avez des questions concernant nos conditions générales d'utilisation, 
                n'hésitez pas à nous contacter.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/support" className="btn btn-accent">
                  <Mail className="w-4 h-4 mr-2" />
                  Page de support
                </Link>
                <a 
                  href="mailto:legal@eglise.com" 
                  className="btn btn-outline"
                >
                  legal@eglise.com
                </a>
              </div>
            </div>
            
            <div className="bg-base-300/50 p-4 rounded-lg">
              <p className="text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-accent" />
                Version 1.0 - Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Acceptation implicite */}
        <div className="text-sm text-base-content/50 text-center pt-4 border-t">
          <p>
            En continuant à utiliser ce site, vous reconnaissez avoir lu et accepté 
            nos Conditions Générales d'Utilisation.
          </p>
        </div>
      </div>
    </LegalLayout>
  );
};

export default CGU;