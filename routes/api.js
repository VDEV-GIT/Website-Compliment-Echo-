// all the routes are found on this page

const express = require('express');
const router = express.Router();
const db = require('../database/db'); // gets the resposne of the db.js
const rateLimit = require('express-rate-limit'); 
const { body, validationResult } = require('express-validator');// validates the input see router.post of compliments it's used there

// Silent IP-based rate limiter with logging
const postLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  handler: (req, res, next, options) => {
    console.warn(`Rate limit exceeded by IP: ${req.ip}`);
    res.status(options.statusCode).end(); // no message sent
  }
});

// Custom emoji and text regex: matches most common emoji characters
const allowedInputRegex = /^[\p{L}\p{N}\p{Emoji}\p{Extended_Pictographic}\s.,!?*#_~'":;() \[\]\-+/\\=]+$/u;
// 
// In post the rate limit is added to make sure nobody starts to spam
router.post('/compliments', postLimiter, 
    [
    body('compliment')
      .trim()
      .isLength({ min: 1, max: 300 }).withMessage('Compliment must be between 1 and 300 characters')
      .matches(allowedInputRegex).withMessage('Only text and emojis allowed! ')
  ],
     (req, res) => {
      // Honeypot trap — reject if filled
      if (req.body.nickname) {
      console.warn(`🕵️ Honeypot triggered by IP: ${req.ip}, value: "${req.body.nickname}"`);
      return res.status(400).json({ error: 'Bot submission detected' });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Return first validation error
        return res.status(400).json({ error: errors.array()[0].msg });
      } 

      const { compliment } = req.body;

      if (!compliment) return res.status(400).json({ error: 'No compliment provided' });

      const query = 'INSERT INTO compliments (content) VALUES (?)';
      db.run(query, [compliment], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id: this.lastID });
  });
});




//the rout for getting back a random compliment
router.get('/random-compliment', (req, res) => {
  const query = 'SELECT * FROM compliments ORDER BY RANDOM() LIMIT 1';

  db.get(query, [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'No compliments found' });

    res.json({id: row.id, compliment: row.content });
  });
});


router.post('/compliments/:id/flag', (req, res) => {
  const id = req.params.id;
  db.run(`UPDATE compliments SET flagged = 1 WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});


module.exports = router;