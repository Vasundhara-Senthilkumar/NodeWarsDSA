const { v4: uuidv4 } = require('uuid');
const { db, toPublicUser } = require('../db');
const config = require('../config');

/** In-memory matchmaking queue (swap for Redis later). */
const queues = new Map(); // key -> [{ userId, socketId, joinedAt, rating }]
const socketToTicket = new Map(); // socketId -> { key, userId }

function queueKey({ mode, companyId, topicId }) {
  return `${mode}:${companyId}:${topicId}`;
}

function getProblemFor(companyId, topicId) {
  let rows = [];
  if (companyId && topicId) {
    rows = db
      .prepare('SELECT * FROM problems WHERE company_id = ? AND topic_id = ?')
      .all(companyId, topicId);
  }

  if (!rows || rows.length === 0) {
    if (topicId) {
      rows = db
        .prepare('SELECT * FROM problems WHERE topic_id = ?')
        .all(topicId);
    }
  }

  if (!rows || rows.length === 0) {
    rows = db.prepare('SELECT * FROM problems').all();
  }

  if (!rows || rows.length === 0) return null;

  return rows[Math.floor(Math.random() * rows.length)];
}

function mapProblem(row) {
  if (!row) return null;
  return {
    id: row.id,
    companyId: row.company_id,
    topicId: row.topic_id,
    title: row.title,
    difficulty: row.difficulty,
    timeLimit: row.time_limit,
    memoryLimit: row.memory_limit,
    description: row.description,
    examples: JSON.parse(row.examples_json || '[]'),
    constraints: JSON.parse(row.constraints_json || '[]'),
    hints: JSON.parse(row.hints_json || '[]'),
    starterCode: JSON.parse(row.starter_code_json || '{}'),
    testCases: JSON.parse(row.test_cases_json || '[]')
  };
}

/** Ensure a bot user exists for solo practice fills */
function ensureBotUser() {
  let bot = db.prepare('SELECT * FROM users WHERE username = ?').get('Arena_Bot');
  if (bot) return bot;

  const bcrypt = require('bcryptjs');
  const id = uuidv4();
  db.prepare(`
    INSERT INTO users
    (id, username, email, password_hash, archetype, title, target_company, rating, win_streak, wins, losses, duels_fought)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 12, 8, 20)
  `).run(
    id,
    'Arena_Bot',
    'bot@nodewars.dev',
    bcrypt.hashSync(uuidv4(), 8),
    'mech_overlord',
    'Training Drone',
    'Google',
    1450
  );
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
}

function enqueue({ userId, socketId, mode, companyId, topicId, rating }) {
  leave(socketId);

  const key = queueKey({ mode, companyId, topicId });
  if (!queues.has(key)) queues.set(key, []);

  const queue = queues.get(key);
  // prevent duplicate user
  const filtered = queue.filter((t) => t.userId !== userId);
  filtered.push({ userId, socketId, joinedAt: Date.now(), rating, mode, companyId, topicId });
  queues.set(key, filtered);
  socketToTicket.set(socketId, { key, userId });

  let result = tryMatch(key);

  // Solo: if still alone, fill with bot after short delay (handled by caller timer)
  return result;
}

/**
 * Called on an interval / timeout to fill solo queues with a bot
 * so a single client can test the full flow.
 */
function fillSoloWithBot(key) {
  const [mode] = key.split(':');
  if (mode !== 'solo') return { matched: false };

  const queue = queues.get(key) || [];
  if (queue.length !== 1) return { matched: false };

  const bot = ensureBotUser();
  queue.push({
    userId: bot.id,
    socketId: `bot:${bot.id}:${Date.now()}`,
    joinedAt: Date.now(),
    rating: bot.rating,
    isBot: true
  });
  queues.set(key, queue);
  return tryMatch(key);
}

function leave(socketId) {
  const ticket = socketToTicket.get(socketId);
  if (!ticket) return;
  const queue = queues.get(ticket.key) || [];
  queues.set(
    ticket.key,
    queue.filter((t) => t.socketId !== socketId)
  );
  socketToTicket.delete(socketId);
}

function tryMatch(key) {
  const [mode] = key.split(':');
  const needed = mode === 'team' ? 4 : 2;
  const queue = queues.get(key) || [];

  if (queue.length < needed) {
    return { matched: false, queueSize: queue.length, needed };
  }

  const players = queue.splice(0, needed);
  queues.set(key, queue);
  for (const p of players) socketToTicket.delete(p.socketId);

  const [, companyId, topicId] = key.split(':');
  const problemRow = getProblemFor(companyId, topicId);
  const matchId = uuidv4();

  db.prepare(`
    INSERT INTO matches (id, mode, status, company_id, topic_id, problem_id)
    VALUES (?, ?, 'countdown', ?, ?, ?)
  `).run(matchId, mode, companyId, topicId, problemRow?.id || null);

  const insertPlayer = db.prepare(`
    INSERT INTO match_players
    (id, match_id, user_id, team, rating_before, progress, charge)
    VALUES (?, ?, ?, ?, ?, 15, 35)
  `);

  const teams = mode === 'team'
    ? ['A', 'A', 'B', 'B']
    : ['A', 'B'];

  players.forEach((p, i) => {
    insertPlayer.run(uuidv4(), matchId, p.userId, teams[i], p.rating);
  });

  const playerProfiles = players.map((p, i) => {
    const row = db.prepare('SELECT * FROM users WHERE id = ?').get(p.userId);
    return {
      ...toPublicUser(row),
      socketId: p.socketId,
      team: teams[i]
    };
  });

  const company = db.prepare('SELECT * FROM companies WHERE id = ?').get(companyId);
  const topic = db.prepare('SELECT * FROM topics WHERE id = ?').get(topicId);

  return {
    matched: true,
    match: {
      id: matchId,
      mode,
      company: company
        ? {
            id: company.id,
            name: company.name,
            badge: company.badge,
            difficulty: company.difficulty,
            accentColor: company.accent_color,
            logoText: company.logo_text,
            description: company.description,
            perk: company.perk
          }
        : { id: companyId, name: companyId },
      topic: topic
        ? {
            id: topic.id,
            name: topic.name,
            tag: topic.tag,
            difficulty: topic.difficulty,
            icon: topic.icon,
            summary: topic.summary
          }
        : { id: topicId, name: topicId },
      problem: mapProblem(problemRow),
      durationSeconds: config.battleDurationSeconds,
      players: playerProfiles
    }
  };
}

function queueStats() {
  const stats = {};
  for (const [key, q] of queues.entries()) {
    stats[key] = q.length;
  }
  return stats;
}

module.exports = {
  enqueue,
  leave,
  tryMatch,
  fillSoloWithBot,
  queueStats,
  mapProblem,
  getProblemFor,
  queueKey
};
