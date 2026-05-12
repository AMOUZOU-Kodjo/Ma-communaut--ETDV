// scripts/check.js — Lance ce script pour vérifier votre configuration
// Usage: node scripts/check.js
require('dotenv').config();

console.log('\n===== DIAGNOSTIC ETDV Backend =====\n');

// ── Variables d'environnement ─────────────────────────
const checks = [
  { key: 'DATABASE_URL',           required: true,  secret: true },
  { key: 'JWT_SECRET',             required: true,  secret: true },
  { key: 'CLOUDINARY_CLOUD_NAME',  required: true,  secret: false },
  { key: 'CLOUDINARY_API_KEY',     required: true,  secret: true },
  { key: 'CLOUDINARY_API_SECRET',  required: true,  secret: true },
  { key: 'ALLOWED_ORIGINS',        required: false, secret: false },
  { key: 'SMTP_USER',              required: false, secret: false },
  { key: 'NODE_ENV',               required: false, secret: false },
  { key: 'PORT',                   required: false, secret: false },
];

let hasError = false;
for (const { key, required, secret } of checks) {
  const val = process.env[key];
  if (!val) {
    if (required) {
      console.log(`  MANQUANT  ${key}  ← REQUIS`);
      hasError = true;
    } else {
      console.log(`  OPTIONNEL ${key}  (non défini)`);
    }
  } else {
    const display = secret
      ? val.slice(0, 6) + '...' + val.slice(-4)
      : val.length > 60 ? val.slice(0, 60) + '…' : val;
    console.log(`  OK        ${key} = ${display}`);
  }
}

if (hasError) {
  console.log('\n  Certaines variables requises sont manquantes.');
  console.log('  Copiez .env.example en .env et remplissez les valeurs.\n');
  process.exit(1);
}

console.log('\n── Test de connexion PostgreSQL ──');
const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL || '';
const isRemote = databaseUrl.includes('render.com') ||
                 databaseUrl.includes('neon.tech') ||
                 databaseUrl.includes('supabase.co');

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: isRemote ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 8000,
});

(async () => {
  try {
    const start = Date.now();
    const client = await pool.connect();
    const res = await client.query('SELECT NOW() as now, current_database() as db, version() as ver');
    const ms = Date.now() - start;
    client.release();

    const row = res.rows[0];
    console.log(`  Connecté en ${ms}ms`);
    console.log(`  Base : ${row.db}`);
    console.log(`  Heure serveur : ${new Date(row.now).toLocaleString('fr-FR')}`);
    console.log(`  Version : ${row.ver.split(',')[0]}`);

    if (ms > 1500) {
      console.log('\n  Note : latence élevée (base distante depuis dev local).');
      console.log('  Le cache intégré compensera cette latence en production.');
    }

    // Vérifier les tables
    console.log('\n── Tables existantes ──');
    const tables = await pool.query(`
      SELECT tablename, pg_size_pretty(pg_total_relation_size(quote_ident(tablename))) as size
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);
    if (tables.rows.length === 0) {
      console.log('  Aucune table trouvée — lancez: npm run db:migrate');
    } else {
      for (const t of tables.rows) {
        console.log(`  ${t.tablename.padEnd(20)} ${t.size}`);
      }
    }

    console.log('\n  Tout est OK ! Vous pouvez lancer: npm run dev\n');
  } catch (err) {
    console.log(`  ERREUR de connexion: ${err.message}`);
    console.log('  Vérifiez DATABASE_URL dans votre .env\n');
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
