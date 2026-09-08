const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const config = require('../config');

const dbPath = path.isAbsolute(config.databasePath)
  ? config.databasePath
  : path.join(__dirname, '..', '..', config.databasePath.replace(/^\.\//, ''));

const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);

function toPublicUser(row) {
  if (!row) return null;
  const fights = row.duels_fought || 0;
  const winRate = fights > 0 ? `${Math.round((row.wins / fights) * 100)}%` : '0%';
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    archetype: row.archetype,
    title: row.title,
    targetCompany: row.target_company,
    rating: row.rating,
    tier: ratingToTier(row.rating),
    winStreak: row.win_streak,
    wins: row.wins,
    losses: row.losses,
    duelsFought: row.duels_fought,
    winRate,
    createdAt: row.created_at
  };
}

function ratingToTier(rating) {
  if (rating >= 2400) return 'Grandmaster';
  if (rating >= 2100) return 'Diamond I';
  if (rating >= 1900) return 'Platinum II';
  if (rating >= 1700) return 'Gold I';
  if (rating >= 1500) return 'Gold III';
  if (rating >= 1400) return 'Silver III';
  if (rating >= 1300) return 'Silver II';
  if (rating >= 1200) return 'Silver I';
  return 'Bronze I';
}

module.exports = {
  db,
  dbPath,
  toPublicUser,
  ratingToTier
};
