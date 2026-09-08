const express = require('express');
const { db } = require('../db');
const { mapProblem } = require('../services/matchmakingService');

const router = express.Router();

router.get('/companies', (_req, res) => {
  const rows = db.prepare('SELECT * FROM companies ORDER BY name').all();
  res.json({
    companies: rows.map((c) => ({
      id: c.id,
      name: c.name,
      badge: c.badge,
      difficulty: c.difficulty,
      accentColor: c.accent_color,
      logoText: c.logo_text,
      description: c.description,
      perk: c.perk,
      questionsCount: c.questions_count
    }))
  });
});

router.get('/topics', (_req, res) => {
  const rows = db.prepare('SELECT * FROM topics ORDER BY name').all();
  res.json({
    topics: rows.map((t) => ({
      id: t.id,
      name: t.name,
      tag: t.tag,
      difficulty: t.difficulty,
      icon: t.icon,
      summary: t.summary,
      popularity: t.popularity
    }))
  });
});

router.get('/problems/:companyId/:topicId', (req, res) => {
  const row = db
    .prepare('SELECT * FROM problems WHERE company_id = ? AND topic_id = ?')
    .get(req.params.companyId, req.params.topicId);

  if (!row) {
    const fallback = db.prepare('SELECT * FROM problems LIMIT 1').get();
    return res.json({ problem: mapProblem(fallback), fallback: true });
  }
  res.json({ problem: mapProblem(row) });
});

router.get('/problems/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM problems WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Problem not found' });
  res.json({ problem: mapProblem(row) });
});

module.exports = router;
