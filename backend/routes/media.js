const express = require('express');
const pool = require('../config/db');
const { upload, cloudinary } = require('../config/cloudinary');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/media
router.get('/', async (req, res) => {
  try {
    const { type, featured, limit } = req.query;
    let query = 'SELECT * FROM media';
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
    res.status(500).json({ error: 'Erreur lors de la récupération des médias' });
  }
});

// GET /api/media/:id
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM media WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Média non trouvé' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du média' });
  }
});

// POST /api/media/upload (admin) - upload via Cloudinary
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier uploadé' });
    }

    const { title, description, tags, featured } = req.body;
    if (!title) return res.status(400).json({ error: 'Le titre est requis' });

    const fileUrl = req.file.path; // Cloudinary URL
    const publicId = req.file.filename; // Cloudinary public_id

    // Déterminer le type
    const ext = req.file.originalname.split('.').pop().toLowerCase();
    let mediaType = 'photo';
    if (['mp4', 'webm', 'mov'].includes(ext)) mediaType = 'video';
    else if (['mp3', 'wav', 'ogg'].includes(ext)) mediaType = 'audio';

    const { rows } = await pool.query(
      `INSERT INTO media (title, description, url, public_id, type, tags, featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, description || null, fileUrl, publicId, mediaType, tags || '', featured === 'true']
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: "Erreur lors de l'upload du média" });
  }
});

// POST /api/media/link (admin) — ajouter un lien vidéo/audio (YouTube, SoundCloud...)
router.post('/link', authenticateToken, async (req, res) => {
  try {
    const { title, description, url, type, tags, featured } = req.body;
    if (!title) return res.status(400).json({ error: 'Le titre est requis' });
    if (!url) return res.status(400).json({ error: "L'URL est requise" });
    if (!['video', 'audio'].includes(type)) {
      return res.status(400).json({ error: 'Le type doit être video ou audio' });
    }

    const { rows } = await pool.query(
      `INSERT INTO media (title, description, url, type, tags, featured)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description || null, url, type, tags || '', featured === true]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Link add error:', error);
    res.status(500).json({ error: "Erreur lors de l'ajout du lien" });
  }
});

// PUT /api/media/:id (admin)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, url, tags, featured } = req.body;
    const { rows, rowCount } = await pool.query(
      `UPDATE media SET title=$1, description=$2, tags=$3, featured=$4, updated_at=NOW()
       WHERE id=$5 RETURNING *`,
      [title, description || null, tags || '', featured || false, req.params.id]
    );
    if (rowCount === 0) return res.status(404).json({ error: 'Média non trouvé' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du média' });
  }
});

// DELETE /api/media/:id (admin) - supprime aussi de Cloudinary
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT url, public_id, type FROM media WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Média non trouvé' });

    const media = rows[0];

    // Supprimer de Cloudinary si public_id existe
    if (media.public_id) {
      const resourceType = media.type === 'video' ? 'video' : media.type === 'audio' ? 'raw' : 'image';
      try {
        await cloudinary.uploader.destroy(media.public_id, { resource_type: resourceType });
      } catch (cloudErr) {
        console.warn('Cloudinary delete warning:', cloudErr.message);
      }
    }

    await pool.query('DELETE FROM media WHERE id = $1', [req.params.id]);
    res.json({ message: 'Média supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression du média' });
  }
});

// POST /api/media/:id/view
router.post('/:id/view', async (req, res) => {
  try {
    await pool.query('UPDATE media SET views = views + 1 WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur' });
  }
});

// POST /api/media/:id/download
router.post('/:id/download', async (req, res) => {
  try {
    await pool.query('UPDATE media SET downloads = downloads + 1 WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur' });
  }
});

module.exports = router;
