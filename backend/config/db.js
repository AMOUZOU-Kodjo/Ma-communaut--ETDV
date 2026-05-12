const { Pool } = require('pg');

// ── Détection de l'environnement ──────────────────────
// En dev local avec DATABASE_URL pointant vers Render (externe),
// on doit activer SSL mais sans vérification stricte du certificat.
// En production (Render → Render interne), on peut désactiver SSL
// ou utiliser l'URL interne sans SSL.
const isProduction = process.env.NODE_ENV === 'production';
const databaseUrl  = process.env.DATABASE_URL || '';

// Render External URL contient toujours "render.com" dans le host
const isRemoteDB = databaseUrl.includes('render.com') ||
                   databaseUrl.includes('neon.tech') ||
                   databaseUrl.includes('supabase.co') ||
                   databaseUrl.includes('railway.app') ||
                   databaseUrl.includes('amazonaws.com');

// Choisir la config SSL :
// - DB distante (dev local → Render) : SSL sans vérif de cert
// - DB locale (localhost) : pas de SSL
// - Production → on laisse pg-connection-string gérer via l'URL interne Render
let sslConfig = false;
if (isRemoteDB && !isProduction) {
  sslConfig = { rejectUnauthorized: false };
} else if (isProduction) {
  sslConfig = { rejectUnauthorized: false };
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: sslConfig,

  // ── Tuning du pool ────────────────────────────────
  // Garder des connexions ouvertes évite le coût de reconnexion SSL à chaque requête
  max: 10,                  // max 10 connexions simultanées
  min: 2,                   // garder 2 connexions "chaudes" en permanence
  idleTimeoutMillis: 30000, // fermer une connexion inactive après 30s
  connectionTimeoutMillis: 5000, // timeout si impossible de se connecter en 5s
  allowExitOnIdle: false,   // ne pas quitter si inactif
});

// ── Gestion des erreurs ───────────────────────────────
pool.on('error', (err, client) => {
  console.error('❌ Erreur inattendue du pool PostgreSQL:', err.message);
});

pool.on('connect', () => {
  // Connexion établie (silencieux pour ne pas spammer les logs)
});

// ── Test de connexion au démarrage ────────────────────
async function testConnection() {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW() as now, version() as version');
    client.release();
    const pgVersion = res.rows[0].version.split(' ').slice(0, 2).join(' ');
    console.log(`✅ PostgreSQL connecté — ${pgVersion}`);
    console.log(`📊 Pool: min=${pool.options.min}, max=${pool.options.max}`);
  } catch (err) {
    console.error('❌ Impossible de se connecter à PostgreSQL:', err.message);
    console.error('   Vérifiez DATABASE_URL dans votre fichier .env');
    process.exit(1);
  }
}

module.exports = pool;
module.exports.testConnection = testConnection;
