const express = require('express');
const pool = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/posts
router.get('/', async (req, res) => {
  try {
    const { type, featured, limit } = req.query;
    let query = 'SELECT * FROM posts';
    const params = [];
    const conditions = [];

    if (type) {
      params.push(type);
      conditions.push(`type = $${params.length}`);
    }
    if (featured !== undefined) {
      params.push(featured === 'true');
      conditions.push(`featured = $${params.length}`);
    }

    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY date DESC';

    if (limit) {
      params.push(parseInt(limit));
      query += ` LIMIT $${params.length}`;
    }

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des posts' });
  }
});

// GET /api/posts/:id
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM posts WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Post non trouvé' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du post' });
  }
});

// POST /api/posts (admin)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content, type, author, featured } = req.body;
    if (!title || !content || !type) {
      return res.status(400).json({ error: 'Titre, contenu et type sont requis' });
    }

    const { rows } = await pool.query(
      'INSERT INTO posts (title, content, type, author, featured) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, content, type, author || null, featured || false]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création du post' });
  }
});

// PUT /api/posts/:id (admin)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, content, type, author, featured } = req.body;
    const { rows, rowCount } = await pool.query(
      `UPDATE posts SET title=$1, content=$2, type=$3, author=$4, featured=$5, updated_at=NOW()
       WHERE id=$6 RETURNING *`,
      [title, content, type, author || null, featured || false, req.params.id]
    );
    if (rowCount === 0) return res.status(404).json({ error: 'Post non trouvé' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du post' });
  }
});

// DELETE /api/posts/:id (admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM posts WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Post non trouvé' });
    res.json({ message: 'Post supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du post' });
  }
});

// POST /api/posts/:id/view
router.post('/:id/view', async (req, res) => {
  try {
    await pool.query('UPDATE posts SET views = views + 1 WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur' });
  }
});

// POST /api/posts/:id/like
router.post('/:id/like', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING likes',
      [req.params.id]
    );
    res.json({ success: true, likes: rows[0]?.likes });
  } catch (error) {
    res.status(500).json({ error: 'Erreur' });
  }
});

module.exports = router;
