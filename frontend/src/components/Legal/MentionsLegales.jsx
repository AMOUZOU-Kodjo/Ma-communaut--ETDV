// components/Legal/MentionsLegales.jsx
import React from "react";
import LegalLayout from "../Layout/LegalLayout";
import { Scale } from "lucide-react";

const MentionsLegales = () => {
  return (
    <LegalLayout
      title="Mentions Légales"
      subtitle="Informations légales concernant l'Église Temple du Dieu Vivant"
      icon={Scale}
    >
      <div className="space-y-8">
        {/* Éditeur du site */}
        <section>
          <h2 className="text-2xl font-bold text-accent mb-4">1. Éditeur du site</h2>
          <div className="bg-base-200 p-6 rounded-xl">
            <p className="mb-2"><strong>Dénomination :</strong> Église Temple du Dieu Vivant (ETDV)</p>
            <p className="mb-2"><strong>Statut :</strong> Association cultuelle</p>
            <p className="mb-2"><strong>Adresse :</strong> Lomé, Togo</p>
            <p className="mb-2"><strong>Téléphone :</strong> +228 91 03 87 27</p>
            <p className="mb-2"><strong>Email :</strong> etdv@gmail.com</p>
            <p><strong>Responsable de publication :</strong> Pasteur Jean Komlan</p>
          </div>
        </section>

        {/* Hébergement */}
        <section>
          <h2 className="text-2xl font-bold text-accent mb-4">2. Hébergement</h2>
          <div className="bg-base-200 p-6 rounded-xl">
            <p className="mb-2"><strong>Hébergeur :</strong> Vercel Inc.</p>
            <p className="mb-2"><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
            <p><strong>Site web :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">www.vercel.com</a></p>
          </div>
        </section>

        {/* Propriété intellectuelle */}
        <section>
          <h2 className="text-2xl font-bold text-accent mb-4">3. Propriété intellectuelle</h2>
          <div className="bg-base-200 p-6 rounded-xl">
            <p className="mb-4">
              L'ensemble du contenu de ce site (textes, images, vidéos, logos, etc.) est la propriété exclusive de 
              l'Église Temple du Dieu Vivant ou de ses partenaires. Toute reproduction, distribution, modification 
              ou utilisation sans autorisation préalable est strictement interdite.
            </p>
            <p>
              Les marques et logos présents sur le site sont déposés et protégés par le droit des marques.
            </p>
          </div>
        </section>

        {/* Collecte de données */}
        <section>
          <h2 className="text-2xl font-bold text-accent mb-4">4. Collecte de données personnelles</h2>
          <div className="bg-base-200 p-6 rounded-xl">
            <p className="mb-4">
              Conformément à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification 
              et de suppression des données vous concernant. Pour exercer ce droit, contactez-nous à :
            </p>
            <p className="font-medium">etdv@gmail.com</p>
          </div>
        </section>

        {/* Limitation de responsabilité */}
        <section>
          <h2 className="text-2xl font-bold text-accent mb-4">5. Limitation de responsabilité</h2>
          <div className="bg-base-200 p-6 rounded-xl">
            <p>
              L'Église Temple du Dieu Vivant s'efforce d'assurer l'exactitude des informations publiées sur ce site, 
              mais ne saurait être tenue responsable des erreurs, omissions ou indisponibilités temporaires du site. 
              Les liens hypertextes présents sur le site peuvent diriger vers des sites tiers dont nous ne maîtrisons 
              pas le contenu.
            </p>
          </div>
        </section>

        {/* Droit applicable */}
        <section>
          <h2 className="text-2xl font-bold text-accent mb-4">6. Droit applicable</h2>
          <div className="bg-base-200 p-6 rounded-xl">
            <p>
              Les présentes mentions légales sont régies par le droit togolais. En cas de litige, les tribunaux 
              de Lomé (Togo) sont seuls compétents.
            </p>
          </div>
        </section>

        {/* Date de mise à jour */}
        <div className="text-sm text-base-content/50 text-right pt-4 border-t">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>
    </LegalLayout>
  );
};

export default MentionsLegales;