const express = require('express');
const { db } = require('../db');

const router = express.Router();

router.get('/', (_req, res) => {
  const rows = db
    .prepare('SELECT id, text, created_at FROM activity_events ORDER BY created_at DESC LIMIT 30')
    .all();

  res.json({
    events: rows.map((r) => ({
      id: r.id,
      text: r.text,
      createdAt: r.created_at
    }))
  });
});

module.exports = router;
