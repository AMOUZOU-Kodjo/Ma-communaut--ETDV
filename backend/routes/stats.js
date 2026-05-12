const express = require('express');
const pool = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/stats (admin - résumé global)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [posts, media, programs, visitors, contacts, subscribers] = await Promise.all([
      pool.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE featured) as featured FROM posts'),
      pool.query('SELECT COUNT(*) as total, type, COUNT(*) FILTER (WHERE featured) as featured FROM media GROUP BY type'),
      pool.query('SELECT COUNT(*) as total FROM programs'),
      pool.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE statut = \'nouveau\') as nouveaux FROM visitors'),
      pool.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE lu = FALSE) as non_lus FROM contacts'),
      pool.query("SELECT COUNT(*) as total FROM subscribers WHERE active = TRUE"),
    ]);

    res.json({
      posts: posts.rows[0],
      media: media.rows,
      programs: programs.rows[0],
      visitors: visitors.rows[0],
      contacts: contacts.rows[0],
      subscribers: subscribers.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
});

// POST /api/stats/pageview (public - incrémenter les vues)
router.post('/pageview', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    await pool.query(
      `INSERT INTO stats (date, visitors, page_views)
       VALUES ($1, 1, 1)
       ON CONFLICT (date) DO UPDATE
       SET page_views = stats.page_views + 1`,
      [today]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur' });
  }
});

module.exports = router;
