require('dotenv').config();
const express = require('express');
const router = express.Router();
const db = require('../database/db');

router.get('/compliments', (req, res) => {
  const key = req.headers['x-api-key'];
  if (key !== process.env.API_KEY) {
    return res.status(403).json({ error: 'Access denied 🔐' });
  }

  db.all('SELECT * FROM compliments ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ compliments: rows });
   
  });
});

router.delete('/compliment/:id', (req, res) => {
  const key = req.headers['x-api-key'];
  if (key !== process.env.API_KEY) {
    return res.status(403).json({ error: 'Access denied 🔐' });
  }

  const query = 'DELETE FROM compliments WHERE id = ?';
  db.run(query, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Compliment not found' });
    }
    res.json({ success: true, deletedId: req.params.id });
  });
});

module.exports = router;
