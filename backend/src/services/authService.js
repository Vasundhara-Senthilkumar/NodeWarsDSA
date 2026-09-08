const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { z } = require('zod');
const { db, toPublicUser } = require('../db');
const { signToken } = require('../utils/tokens');
const config = require('../config');

const signupSchema = z.object({
  username: z.string().min(3).max(24).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(6).max(72),
  archetype: z.string().default('neon_ronin'),
  targetCompany: z.string().default('Google')
});

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

const TITLES = {
  neon_ronin: 'Syntax Assassin',
  quantum_hacker: 'Neural Matrix Adept',
  byte_reaper: 'Brute Force Marauder',
  mech_overlord: 'Apex Titan',
  glitch_valkyrie: 'Two-Pointer Anchor',
  core_sentinel: 'Shield Master'
};

function signup(input) {
  const data = signupSchema.parse(input);
  const existing = db
    .prepare('SELECT id FROM users WHERE username = ? OR email = ?')
    .get(data.username, data.email);
  if (existing) {
    const err = new Error('Username or email already taken');
    err.status = 409;
    throw err;
  }

  const id = uuidv4();
  const passwordHash = bcrypt.hashSync(data.password, 10);
  const title = TITLES[data.archetype] || 'Rookie Coder';

  db.prepare(`
    INSERT INTO users
    (id, username, email, password_hash, archetype, title, target_company, rating)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.username,
    data.email,
    passwordHash,
    data.archetype,
    title,
    data.targetCompany,
    config.startingRating
  );

  const user = toPublicUser(db.prepare('SELECT * FROM users WHERE id = ?').get(id));
  return { user, token: signToken(user) };
}

function login(input) {
  const data = loginSchema.parse(input);
  const row = db
    .prepare('SELECT * FROM users WHERE username = ? OR email = ?')
    .get(data.username, data.username);

  if (!row || !bcrypt.compareSync(data.password, row.password_hash)) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const user = toPublicUser(row);
  return { user, token: signToken(user) };
}

module.exports = { signup, login, signupSchema, loginSchema };
