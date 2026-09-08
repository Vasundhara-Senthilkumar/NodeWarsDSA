const express = require('express');
const { db, toPublicUser, ratingToTier } = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

router.get('/leaderboard', (_req, res) => {
  const rows = db
    .prepare(
      `SELECT * FROM users ORDER BY rating DESC, wins DESC LIMIT 20`
    )
    .all();

  res.json({
    leaderboard: rows.map((row, index) => {
      const user = toPublicUser(row);
      return {
        rank: index + 1,
        username: user.username,
        title: user.title,
        archetype: user.archetype,
        rating: user.rating,
        tier: user.tier,
        winStreak: user.winStreak,
        winRate: user.winRate,
        duels: user.duelsFought,
        isUser: false
      };
    })
  });
});

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'User not found' });
  res.json({ user: toPublicUser(row) });
});

router.patch('/me', authRequired, (req, res) => {
  const { archetype, title, targetCompany } = req.body || {};
  db.prepare(`
    UPDATE users SET
      archetype = COALESCE(?, archetype),
      title = COALESCE(?, title),
      target_company = COALESCE(?, target_company),
      updated_at = datetime('now')
    WHERE id = ?
  `).run(archetype || null, title || null, targetCompany || null, req.user.id);

  const user = toPublicUser(db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id));
  res.json({ user, tier: ratingToTier(user.rating) });
});

module.exports = router;
