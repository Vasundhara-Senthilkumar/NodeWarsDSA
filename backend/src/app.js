const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const config = require('./config');
const { errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const problemRoutes = require('./routes/problems');
const matchRoutes = require('./routes/matches');
const activityRoutes = require('./routes/activity');

function createApp() {
  const app = express();

  app.use(
    cors({
      origin: config.clientOrigin,
      credentials: true
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  app.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'nodewars-api', env: config.nodeEnv });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api', problemRoutes);
  app.use('/api/matches', matchRoutes);
  app.use('/api/activity', activityRoutes);

  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
