const express = require('express');
const { db } = require('../db');
const { authRequired } = require('../middleware/auth');
const { loadMatchBundle } = require('../services/battleService');
const { queueStats } = require('../services/matchmakingService');

const router = express.Router();

router.get('/queue-stats', (_req, res) => {
  res.json({ queues: queueStats() });
});

router.get('/:id', authRequired, (req, res) => {
  const bundle = loadMatchBundle(req.params.id);
  if (!bundle) return res.status(404).json({ error: 'Match not found' });

  const allowed = bundle.players.some((p) => p.user_id === req.user.id);
  if (!allowed) return res.status(403).json({ error: 'Not a participant' });

  res.json({
    match: {
      id: bundle.match.id,
      mode: bundle.match.mode,
      status: bundle.match.status,
      companyId: bundle.match.company_id,
      topicId: bundle.match.topic_id,
      winnerUserId: bundle.match.winner_user_id,
      startedAt: bundle.match.started_at,
      endedAt: bundle.match.ended_at
    },
    problem: bundle.problem,
    players: bundle.players.map((p) => ({
      userId: p.user_id,
      username: p.username,
      team: p.team,
      ratingBefore: p.rating_before,
      ratingAfter: p.rating_after,
      ratingChange: p.rating_change,
      progress: p.progress,
      submitted: !!p.submitted,
      passedAll: !!p.passed_all,
      forfeit: !!p.forfeit
    }))
  });
});

router.get('/', authRequired, (req, res) => {
  const rows = db
    .prepare(
      `SELECT m.* FROM matches m
       JOIN match_players mp ON mp.match_id = m.id
       WHERE mp.user_id = ?
       ORDER BY m.created_at DESC
       LIMIT 20`
    )
    .all(req.user.id);

  res.json({ matches: rows });
});

module.exports = router;
