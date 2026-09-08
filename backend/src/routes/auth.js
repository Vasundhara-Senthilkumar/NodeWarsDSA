const express = require('express');
const authService = require('../services/authService');

const router = express.Router();

router.post('/signup', (req, res, next) => {
  try {
    const result = authService.signup(req.body);
    res.status(201).json(result);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation failed', details: err.issues });
    }
    next(err);
  }
});

router.post('/login', (req, res, next) => {
  try {
    const result = authService.login(req.body);
    res.json(result);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation failed', details: err.issues });
    }
    next(err);
  }
});

router.get('/me', require('../middleware/auth').authRequired, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
