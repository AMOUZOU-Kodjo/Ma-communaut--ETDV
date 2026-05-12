const express = require('express');
const pool = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/programs
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM programs';
    const params = [];

    if (category) {
      params.push(category);
      query += ` WHERE category = $1`;
    }

    query += ' ORDER BY created_at DESC';
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des programmes' });
  }
});

// GET /api/programs/:id
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM programs WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Programme non trouvé' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du programme' });
  }
});

// POST /api/programs (admin)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      title, description, long_description, day, time, location,
      category, type, week, month, dates, capacity, leaders, highlights, color, icon
    } = req.body;

    if (!title || !category) {
      return res.status(400).json({ error: 'Titre et catégorie sont requis' });
    }

    const { rows } = await pool.query(
      `INSERT INTO programs
       (title, description, long_description, day, time, location, category, type,
        week, month, dates, capacity, leaders, highlights, color, icon)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
      [
        title, description || null, long_description || null, day || null, time || null,
        location || null, category, type || null, week || null, month || null,
        dates || null, capacity || null,
        leaders ? JSON.stringify(leaders) : null,
        highlights ? JSON.stringify(highlights) : null,
        color || null, icon || null,
      ]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création du programme' });
  }
});

// PUT /api/programs/:id (admin)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const {
      title, description, long_description, day, time, location,
      category, type, week, month, dates, capacity, leaders, highlights, color, icon
    } = req.body;

    const { rows, rowCount } = await pool.query(
      `UPDATE programs SET
        title=$1, description=$2, long_description=$3, day=$4, time=$5, location=$6,
        category=$7, type=$8, week=$9, month=$10, dates=$11, capacity=$12,
        leaders=$13, highlights=$14, color=$15, icon=$16, updated_at=NOW()
       WHERE id=$17 RETURNING *`,
      [
        title, description || null, long_description || null, day || null, time || null,
        location || null, category, type || null, week || null, month || null,
        dates || null, capacity || null,
        leaders ? JSON.stringify(leaders) : null,
        highlights ? JSON.stringify(highlights) : null,
        color || null, icon || null, req.params.id,
      ]
    );

    if (rowCount === 0) return res.status(404).json({ error: 'Programme non trouvé' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du programme' });
  }
});

// DELETE /api/programs/:id (admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM programs WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Programme non trouvé' });
    res.json({ message: 'Programme supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du programme' });
  }
});

module.exports = router;
