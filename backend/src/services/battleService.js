const { v4: uuidv4 } = require('uuid');
const { db, toPublicUser } = require('../db');
const config = require('../config');
const { runSimulatedJudge, getHint, getScanFeedback } = require('./judgeService');
const { applyMatchResult } = require('./ratingService');
const { mapProblem } = require('./matchmakingService');

/** Live battle rooms in memory */
const rooms = new Map(); // matchId -> room state

function getRoom(matchId) {
  return rooms.get(matchId);
}

function createRoom(match) {
  const state = {
    matchId: match.id,
    mode: match.mode,
    problem: match.problem,
    durationSeconds: match.durationSeconds || config.battleDurationSeconds,
    startedAt: Date.now(),
    ended: false,
    players: {}
  };

  for (const p of match.players) {
    state.players[p.id] = {
      userId: p.id,
      username: p.username,
      team: p.team,
      progress: 15,
      charge: 35,
      hasFirewall: false,
      unlockedHints: 0,
      language: 'javascript',
      code: match.problem?.starterCode?.javascript || '',
      submitted: false,
      socketId: p.socketId
    };
  }

  rooms.set(match.id, state);

  db.prepare(`
    UPDATE matches SET status = 'active', started_at = datetime('now') WHERE id = ?
  `).run(match.id);

  return state;
}

function bindSocket(matchId, userId, socketId) {
  const room = rooms.get(matchId);
  if (!room || !room.players[userId]) return null;
  room.players[userId].socketId = socketId;
  return room;
}

function publicRoomState(room) {
  return {
    matchId: room.matchId,
    mode: room.mode,
    timeLeft: Math.max(
      0,
      room.durationSeconds - Math.floor((Date.now() - room.startedAt) / 1000)
    ),
    ended: room.ended,
    players: Object.values(room.players).map((p) => ({
      userId: p.userId,
      username: p.username,
      team: p.team,
      progress: p.progress,
      charge: p.charge,
      hasFirewall: p.hasFirewall,
      submitted: p.submitted
    }))
  };
}

function updateCode(matchId, userId, { code, language }) {
  const room = rooms.get(matchId);
  if (!room || room.ended || !room.players[userId]) return null;

  const player = room.players[userId];
  player.code = code;
  if (language) player.language = language;

  const starterLen = (room.problem?.starterCode?.[player.language] || '').length || 100;
  const typedDelta = Math.max(0, (code || '').length - starterLen);
  player.progress = Math.min(95, Math.floor(20 + typedDelta / 12));
  player.charge = Math.min(100, Math.floor(35 + typedDelta / 8));

  db.prepare(`
    UPDATE match_players SET progress = ?, charge = ?, language = ?, final_code = ?
    WHERE match_id = ? AND user_id = ?
  `).run(player.progress, player.charge, player.language, code, matchId, userId);

  return publicRoomState(room);
}

function useAbility(matchId, userId, abilityId, targetUserId) {
  const room = rooms.get(matchId);
  if (!room || room.ended) {
    throw Object.assign(new Error('Battle not active'), { status: 400 });
  }
  const player = room.players[userId];
  if (!player) throw Object.assign(new Error('Not in battle'), { status: 403 });

  const ability = config.abilities[abilityId];
  if (!ability) throw Object.assign(new Error('Unknown ability'), { status: 400 });
  if (player.charge < ability.cost) {
    throw Object.assign(new Error('Not enough charge'), { status: 400 });
  }

  player.charge -= ability.cost;
  let payload = {};
  let blocked = false;
  const targetId = targetUserId || Object.keys(room.players).find((id) => id !== userId);
  const target = targetId ? room.players[targetId] : null;

  if (abilityId === 'hint') {
    payload = { hint: getHint(room.problem, player.unlockedHints) };
    player.unlockedHints += 1;
  } else if (abilityId === 'scan') {
    payload = { tips: getScanFeedback(player.code) };
  } else if (abilityId === 'firewall') {
    player.hasFirewall = true;
    payload = { active: true };
  } else if (abilityId === 'fog') {
    if (target?.hasFirewall) {
      target.hasFirewall = false;
      blocked = true;
      payload = { blocked: true };
    } else {
      payload = { blocked: false, durationMs: 3000 };
    }
  }

  db.prepare(`
    INSERT INTO ability_events (id, match_id, from_user_id, to_user_id, ability, payload_json)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(uuidv4(), matchId, userId, targetId || null, abilityId, JSON.stringify(payload));

  db.prepare(`
    UPDATE match_players SET charge = ?, has_firewall = ?
    WHERE match_id = ? AND user_id = ?
  `).run(player.charge, player.hasFirewall ? 1 : 0, matchId, userId);

  db.prepare('INSERT INTO activity_events (id, text) VALUES (?, ?)').run(
    uuidv4(),
    abilityId === 'fog'
      ? `🌫️ @${player.username} deployed [Syntax Fog]`
      : `⚡ @${player.username} used [${ability.name}]`
  );

  return {
    abilityId,
    fromUserId: userId,
    toUserId: targetId,
    blocked,
    payload,
    room: publicRoomState(room)
  };
}

function runCode(matchId, userId, mode = 'run') {
  const room = rooms.get(matchId);
  if (!room || room.ended) {
    throw Object.assign(new Error('Battle not active'), { status: 400 });
  }
  const player = room.players[userId];
  if (!player) throw Object.assign(new Error('Not in battle'), { status: 403 });

  const verdict = runSimulatedJudge({
    code: player.code,
    language: player.language,
    problem: room.problem,
    mode
  });

  player.progress = Math.max(player.progress, verdict.progressBoost);

  const submissionId = uuidv4();
  db.prepare(`
    INSERT INTO submissions
    (id, match_id, user_id, language, code, status, passed, total, runtime_ms, results_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    submissionId,
    matchId,
    userId,
    player.language,
    player.code,
    verdict.status,
    verdict.passed,
    verdict.total,
    verdict.runtimeMs,
    JSON.stringify(verdict.results)
  );

  db.prepare(`
    UPDATE match_players SET progress = ?, submitted = ?, passed_all = ?, final_code = ?
    WHERE match_id = ? AND user_id = ?
  `).run(
    player.progress,
    mode === 'submit' ? 1 : 0,
    verdict.allPassed && mode === 'submit' ? 1 : 0,
    player.code,
    matchId,
    userId
  );

  if (mode === 'submit' && verdict.allPassed) {
    player.submitted = true;
    player.progress = 100;
  }

  return { submissionId, verdict, room: publicRoomState(room) };
}

function finishMatch(matchId, { winnerId, reason = 'solved' } = {}) {
  const room = rooms.get(matchId);
  if (!room || room.ended) return null;
  room.ended = true;

  const playerIds = Object.keys(room.players);
  let winner = winnerId;
  let loser = null;

  if (!winner) {
    // Highest progress wins; tie -> first submitter else first player
    const ranked = Object.values(room.players).sort((a, b) => b.progress - a.progress);
    winner = ranked[0]?.userId;
  }

  loser = playerIds.find((id) => id !== winner) || null;

  let rating = null;
  if (winner && loser) {
    rating = applyMatchResult(db, { winnerId: winner, loserId: loser });
    db.prepare(`
      UPDATE match_players SET rating_after = ?, rating_change = ?
      WHERE match_id = ? AND user_id = ?
    `).run(rating.winner.ratingAfter, rating.winner.ratingChange, matchId, winner);
    db.prepare(`
      UPDATE match_players SET rating_after = ?, rating_change = ?
      WHERE match_id = ? AND user_id = ?
    `).run(rating.loser.ratingAfter, rating.loser.ratingChange, matchId, loser);
  }

  db.prepare(`
    UPDATE matches SET status = ?, ended_at = datetime('now'), winner_user_id = ?
    WHERE id = ?
  `).run(reason === 'forfeit' ? 'forfeited' : 'completed', winner, matchId);

  const winnerUser = winner
    ? toPublicUser(db.prepare('SELECT * FROM users WHERE id = ?').get(winner))
    : null;

  if (winnerUser) {
    db.prepare('INSERT INTO activity_events (id, text) VALUES (?, ?)').run(
      uuidv4(),
      `🏆 @${winnerUser.username} won a duel (${reason})`
    );
  }

  const result = {
    matchId,
    reason,
    didWinByUser: {},
    winnerUserId: winner,
    rating,
    room: publicRoomState(room)
  };

  for (const id of playerIds) {
    result.didWinByUser[id] = id === winner;
  }

  // Keep room briefly for clients, then drop
  setTimeout(() => rooms.delete(matchId), 60_000);
  return result;
}

function forfeit(matchId, userId) {
  const room = rooms.get(matchId);
  if (!room || room.ended) return null;
  const opponent = Object.keys(room.players).find((id) => id !== userId);
  db.prepare(`
    UPDATE match_players SET forfeit = 1 WHERE match_id = ? AND user_id = ?
  `).run(matchId, userId);
  return finishMatch(matchId, { winnerId: opponent, reason: 'forfeit' });
}

function loadMatchBundle(matchId) {
  const match = db.prepare('SELECT * FROM matches WHERE id = ?').get(matchId);
  if (!match) return null;
  const problem = match.problem_id
    ? mapProblem(db.prepare('SELECT * FROM problems WHERE id = ?').get(match.problem_id))
    : null;
  const players = db
    .prepare(
      `SELECT mp.*, u.username, u.archetype, u.title, u.rating
       FROM match_players mp JOIN users u ON u.id = mp.user_id
       WHERE mp.match_id = ?`
    )
    .all(matchId);

  return { match, problem, players };
}

module.exports = {
  getRoom,
  createRoom,
  bindSocket,
  publicRoomState,
  updateCode,
  useAbility,
  runCode,
  finishMatch,
  forfeit,
  loadMatchBundle,
  rooms
};
