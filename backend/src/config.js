require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'nodewars-dev-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  databasePath: process.env.DATABASE_PATH || './data/nodewars.db',
  battleDurationSeconds: Number(process.env.BATTLE_DURATION_SECONDS) || 900,
  matchmakingTimeoutMs: Number(process.env.MATCHMAKING_TIMEOUT_MS) || 30000,
  startingRating: 1200,
  eloK: 32,
  abilities: {
    hint: { cost: 30, name: 'Hint' },
    scan: { cost: 25, name: 'Code Scan' },
    firewall: { cost: 40, name: 'Firewall' },
    fog: { cost: 50, name: 'Syntax Fog' }
  }
};
