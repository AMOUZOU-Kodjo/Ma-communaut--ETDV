const express = require('express');
const pool = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/subscribe (public)
router.post('/', async (req, res) => {
  try {
    const { email, nom } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email requis' });
    }

    const { rows } = await pool.query(
      `INSERT INTO subscribers (email, nom)
       VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET active = TRUE, nom = COALESCE($2, subscribers.nom)
       RETURNING id, email, nom, created_at`,
      [email, nom || null]
    );

    res.status(201).json({ message: 'Inscription réussie', subscriber: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
});

// GET /api/subscribe/count (public)
router.get('/count', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT COUNT(*)::int AS total FROM subscribers WHERE active = TRUE');
    res.json({ total: rows[0].total });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/subscribe (admin)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, email, nom, active, created_at FROM subscribers ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/subscribe/:id (admin - désabonner)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM subscribers WHERE id = $1', [req.params.id]);
    res.json({ message: 'Désabonné' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
