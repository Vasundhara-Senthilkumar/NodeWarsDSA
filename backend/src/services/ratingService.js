const config = require('../config');
const { ratingToTier } = require('../db');

function expectedScore(ratingA, ratingB) {
  return 1 / (1 + 10 ** ((ratingB - ratingA) / 400));
}

function eloDelta(winnerRating, loserRating, k = config.eloK) {
  const expWin = expectedScore(winnerRating, loserRating);
  const expLose = expectedScore(loserRating, winnerRating);
  return {
    winnerChange: Math.round(k * (1 - expWin)),
    loserChange: Math.round(k * (0 - expLose))
  };
}

function applyMatchResult(db, { winnerId, loserId }) {
  const winner = db.prepare('SELECT * FROM users WHERE id = ?').get(winnerId);
  const loser = db.prepare('SELECT * FROM users WHERE id = ?').get(loserId);
  if (!winner || !loser) {
    throw Object.assign(new Error('Players not found for rating update'), { status: 404 });
  }

  const { winnerChange, loserChange } = eloDelta(winner.rating, loser.rating);
  const newWinnerRating = winner.rating + winnerChange;
  const newLoserRating = Math.max(800, loser.rating + loserChange);

  db.prepare(`
    UPDATE users SET
      rating = ?,
      win_streak = win_streak + 1,
      wins = wins + 1,
      duels_fought = duels_fought + 1,
      updated_at = datetime('now')
    WHERE id = ?
  `).run(newWinnerRating, winnerId);

  db.prepare(`
    UPDATE users SET
      rating = ?,
      win_streak = 0,
      losses = losses + 1,
      duels_fought = duels_fought + 1,
      updated_at = datetime('now')
    WHERE id = ?
  `).run(newLoserRating, loserId);

  return {
    winner: {
      userId: winnerId,
      ratingBefore: winner.rating,
      ratingAfter: newWinnerRating,
      ratingChange: winnerChange,
      tier: ratingToTier(newWinnerRating)
    },
    loser: {
      userId: loserId,
      ratingBefore: loser.rating,
      ratingAfter: newLoserRating,
      ratingChange: loserChange,
      tier: ratingToTier(newLoserRating)
    }
  };
}

module.exports = { eloDelta, expectedScore, applyMatchResult };
