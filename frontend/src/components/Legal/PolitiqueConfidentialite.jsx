// components/Legal/PolitiqueConfidentialite.jsx
import React from "react";
import LegalLayout from "../Layout/LegalLayout";
import { Shield } from "lucide-react";

const PolitiqueConfidentialite = () => {
  return (
    <LegalLayout
      title="Politique de Confidentialité"
      subtitle="Comment nous protégeons vos données personnelles"
      icon={Shield}
    >
      <div className="space-y-8">
        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-bold text-accent mb-4">Introduction</h2>
          <div className="bg-base-200 p-6 rounded-xl">
            <p>
              L'Église Temple du Dieu Vivant accorde une importance particulière à la protection de vos données 
              personnelles. Cette politique vous informe de la manière dont nous collectons, utilisons et protégeons 
              vos informations lorsque vous utilisez notre site web.
            </p>
          </div>
        </section>

        {/* Données collectées */}
        <section>
          <h2 className="text-2xl font-bold text-accent mb-4">1. Données que nous collectons</h2>
          <div className="bg-base-200 p-6 rounded-xl">
            <p className="mb-4">Nous pouvons collecter les informations suivantes :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Données d'identification :</strong> nom, prénom, adresse email (via formulaire de contact)</li>
              <li><strong>Données de navigation :</strong> adresse IP, type de navigateur, pages visitées</li>
              <li><strong>Cookies :</strong> informations de session et préférences utilisateur</li>
              <li><strong>Messages :</strong> contenu des messages que vous nous envoyez</li>
            </ul>
          </div>
        </section>

        {/* Utilisation des données */}
        <section>
          <h2 className="text-2xl font-bold text-accent mb-4">2. Utilisation de vos données</h2>
          <div className="bg-base-200 p-6 rounded-xl">
            <p className="mb-4">Vos données sont utilisées pour :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Répondre à vos demandes de contact</li>
              <li>Vous envoyer notre newsletter (avec votre consentement)</li>
              <li>Améliorer notre site et votre expérience utilisateur</li>
              <li>Respecter nos obligations légales</li>
            </ul>
          </div>
        </section>

        {/* Base légale */}
        <section>
          <h2 className="text-2xl font-bold text-accent mb-4">3. Base légale du traitement</h2>
          <div className="bg-base-200 p-6 rounded-xl">
            <p className="mb-4">Nous traitons vos données sur les bases légales suivantes :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Consentement :</strong> pour l'envoi de newsletters</li>
              <li><strong>Intérêt légitime :</strong> pour améliorer nos services</li>
              <li><strong>Obligation légale :</strong> pour respecter la loi</li>
            </ul>
          </div>
        </section>

        {/* Durée de conservation */}
        <section>
          <h2 className="text-2xl font-bold text-accent mb-4">4. Durée de conservation</h2>
          <div className="bg-base-200 p-6 rounded-xl">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Données de contact :</strong> 3 ans après dernier contact</li>
              <li><strong>Newsletter :</strong> jusqu'au désabonnement</li>
              <li><strong>Cookies :</strong> 13 mois maximum</li>
              <li><strong>Données de navigation :</strong> 1 an</li>
            </ul>
          </div>
        </section>

        {/* Vos droits */}
        <section>
          <h2 className="text-2xl font-bold text-accent mb-4">5. Vos droits</h2>
          <div className="bg-base-200 p-6 rounded-xl">
            <p className="mb-4">Vous disposez des droits suivants :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Droit d'accès :</strong> connaître les données que nous détenons</li>
              <li><strong>Droit de rectification :</strong> modifier vos données</li>
              <li><strong>Droit à l'effacement :</strong> demander la suppression</li>
              <li><strong>Droit d'opposition :</strong> vous opposer au traitement</li>
              <li><strong>Droit à la portabilité :</strong> récupérer vos données</li>
            </ul>
            <p className="mt-4">
              Pour exercer ces droits, contactez-nous à : <strong className="text-accent">etdv@gmail.com</strong>
            </p>
          </div>
        </section>

        {/* Sécurité */}
        <section>
          <h2 className="text-2xl font-bold text-accent mb-4">6. Sécurité des données</h2>
          <div className="bg-base-200 p-6 rounded-xl">
            <p>
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées 
              pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction.
            </p>
          </div>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="text-2xl font-bold text-accent mb-4">7. Cookies</h2>
          <div className="bg-base-200 p-6 rounded-xl">
            <p className="mb-4">
              Notre site utilise des cookies pour améliorer votre expérience. Vous pouvez gérer vos préférences 
              de cookies dans les paramètres de votre navigateur.
            </p>
            <p>
              Pour plus d'informations, consultez notre <a href="/cookies" className="text-accent hover:underline">Politique des cookies</a>.
            </p>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
};

export default PolitiqueConfidentialite;