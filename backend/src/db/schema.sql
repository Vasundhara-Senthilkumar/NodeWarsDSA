-- NodeWars schema (SQLite)

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE COLLATE NOCASE,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  archetype TEXT NOT NULL DEFAULT 'neon_ronin',
  title TEXT NOT NULL DEFAULT 'Rookie Coder',
  target_company TEXT NOT NULL DEFAULT 'Google',
  rating INTEGER NOT NULL DEFAULT 1200,
  win_streak INTEGER NOT NULL DEFAULT 0,
  wins INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  duels_fought INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  badge TEXT,
  difficulty TEXT,
  accent_color TEXT,
  logo_text TEXT,
  description TEXT,
  perk TEXT,
  questions_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS topics (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tag TEXT,
  difficulty TEXT,
  icon TEXT,
  summary TEXT,
  popularity TEXT
);

CREATE TABLE IF NOT EXISTS problems (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id),
  topic_id TEXT NOT NULL REFERENCES topics(id),
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  time_limit TEXT,
  memory_limit TEXT,
  description TEXT NOT NULL,
  examples_json TEXT NOT NULL DEFAULT '[]',
  constraints_json TEXT NOT NULL DEFAULT '[]',
  hints_json TEXT NOT NULL DEFAULT '[]',
  starter_code_json TEXT NOT NULL DEFAULT '{}',
  test_cases_json TEXT NOT NULL DEFAULT '[]',
  UNIQUE(company_id, topic_id)
);

CREATE TABLE IF NOT EXISTS matches (
  id TEXT PRIMARY KEY,
  mode TEXT NOT NULL CHECK (mode IN ('solo', 'team')),
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued', 'countdown', 'active', 'completed', 'forfeited', 'cancelled')),
  company_id TEXT REFERENCES companies(id),
  topic_id TEXT REFERENCES topics(id),
  problem_id TEXT REFERENCES problems(id),
  started_at TEXT,
  ended_at TEXT,
  winner_user_id TEXT REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS match_players (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id),
  team TEXT NOT NULL DEFAULT 'A' CHECK (team IN ('A', 'B')),
  role TEXT NOT NULL DEFAULT 'player',
  rating_before INTEGER NOT NULL,
  rating_after INTEGER,
  rating_change INTEGER,
  progress INTEGER NOT NULL DEFAULT 0,
  charge INTEGER NOT NULL DEFAULT 0,
  has_firewall INTEGER NOT NULL DEFAULT 0,
  submitted INTEGER NOT NULL DEFAULT 0,
  passed_all INTEGER NOT NULL DEFAULT 0,
  forfeit INTEGER NOT NULL DEFAULT 0,
  language TEXT DEFAULT 'javascript',
  final_code TEXT,
  UNIQUE(match_id, user_id)
);

CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id),
  language TEXT NOT NULL,
  code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'running', 'accepted', 'wrong_answer', 'runtime_error', 'time_limit', 'compile_error')),
  passed INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  runtime_ms INTEGER,
  results_json TEXT DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS ability_events (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  from_user_id TEXT NOT NULL REFERENCES users(id),
  to_user_id TEXT REFERENCES users(id),
  ability TEXT NOT NULL,
  payload_json TEXT DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS activity_events (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_rating ON users(rating DESC);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_match_players_match ON match_players(match_id);
CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_events(created_at DESC);
