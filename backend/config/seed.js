require('dotenv').config();
const pool = require('./db');

async function seed() {
  const client = await pool.connect();
  try {
    console.log('Insertion des données de test...');

    // ── Posts ──────────────────────────────────────────
    await client.query(`
      INSERT INTO posts (title, content, type, author, featured) VALUES
      (
        'Message du Pasteur - Janvier 2025',
        'Bien-aimés frères et sœurs, en ce début d''année, je voudrais vous encourager à rester fermes dans la foi. Que la grâce de notre Seigneur Jésus-Christ soit avec vous tous.',
        'message', 'Pasteur Jean AGBELI', TRUE
      ),
      (
        'Verset du jour - Jean 3:16',
        'Car Dieu a tant aimé le monde qu''il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu''il ait la vie éternelle.',
        'verse', NULL, TRUE
      ),
      (
        'Retraite spirituelle 2025',
        'Nous avons le plaisir de vous annoncer notre retraite spirituelle annuelle qui se tiendra du 15 au 17 mars 2025. Le thème cette année est : "Renouvelés par l''Esprit".',
        'news', 'Secrétariat ETDV', FALSE
      )
      ON CONFLICT DO NOTHING
    `);

    // ── Programs ───────────────────────────────────────
    await client.query(`
      INSERT INTO programs (title, description, day, time, location, category, color, icon) VALUES
      (
        'Culte du Dimanche',
        'Service de culte dominical avec louange, adoration et prédication de la Parole.',
        'Dimanche', '9h00 - 12h00', 'Salle principale', 'weekly', 'accent', 'church'
      ),
      (
        'Étude Biblique',
        'Étude approfondie de la Parole de Dieu chaque mercredi soir.',
        'Mercredi', '18h30 - 20h00', 'Salle de conférence', 'weekly', 'info', 'book'
      ),
      (
        'Réunion de Prière',
        'Moment de prière collective et d''intercession pour l''Église et la nation.',
        'Vendredi', '19h00 - 21h00', 'Chapelle', 'weekly', 'success', 'hands'
      )
      ON CONFLICT DO NOTHING
    `);

    // ── Visiteurs ──────────────────────────────────────
    await client.query(`
      INSERT INTO visitors (nom, prenom, email, telephone, statut, date_visite) VALUES
      ('MENSAH', 'Koffi', 'koffi.mensah@email.com', '+228 90 11 22 33', 'nouveau', CURRENT_DATE),
      ('AGBOKA', 'Abla',  'abla.agboka@email.com',  '+228 91 44 55 66', 'suivi',   CURRENT_DATE - 7),
      ('DOSSOU', 'Eric',  'eric.dossou@email.com',   '+228 92 77 88 99', 'membre',  CURRENT_DATE - 30)
      ON CONFLICT DO NOTHING
    `);

    console.log('Données de test insérées avec succès');
    console.log('  - 3 posts (message, verset, actualité)');
    console.log('  - 3 programmes (culte, étude, prière)');
    console.log('  - 3 visiteurs (nouveau, suivi, membre)');
  } catch (error) {
    console.error('Erreur de seed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
