const express = require('express');
const pool = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/visitors (admin)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { statut } = req.query;
    let query = 'SELECT * FROM visitors';
    const params = [];

    if (statut) {
      params.push(statut);
      query += ` WHERE statut = $1`;
    }

    query += ' ORDER BY created_at DESC';
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des visiteurs' });
  }
});

// POST /api/visitors (public - formulaire visiteur)
router.post('/', async (req, res) => {
  try {
    const { nom, prenom, email, telephone, message, date_visite } = req.body;
    if (!nom) return res.status(400).json({ error: 'Le nom est requis' });

    const { rows } = await pool.query(
      `INSERT INTO visitors (nom, prenom, email, telephone, message, date_visite)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nom, prenom || null, email || null, telephone || null, message || null, date_visite || null]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de l'enregistrement" });
  }
});

// PUT /api/visitors/:id (admin - changer statut)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { statut, message } = req.body;
    const { rows, rowCount } = await pool.query(
      'UPDATE visitors SET statut=$1, message=$2 WHERE id=$3 RETURNING *',
      [statut, message || null, req.params.id]
    );
    if (rowCount === 0) return res.status(404).json({ error: 'Visiteur non trouvé' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

// DELETE /api/visitors/:id (admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM visitors WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Visiteur non trouvé' });
    res.json({ message: 'Visiteur supprimé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

module.exports = router;
