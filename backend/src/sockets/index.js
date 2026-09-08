const { verifyToken } = require('../utils/tokens');
const { db, toPublicUser } = require('../db');
const matchmaking = require('../services/matchmakingService');
const battle = require('../services/battleService');
const config = require('../config');

function registerSockets(io) {
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        return next(new Error('Unauthorized'));
      }

      const payload = verifyToken(token);
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(payload.sub);
      if (!user) return next(new Error('Unauthorized'));

      socket.user = toPublicUser(user);
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`[socket] connected ${socket.user.username} (${socket.id})`);

    socket.on('matchmaking:join', (payload = {}, ack) => {
      try {
        const mode = payload.mode === 'team' ? 'team' : 'solo';
        const companyId = payload.companyId || payload.company?.id;
        const topicId = payload.topicId || payload.topic?.id;

        if (!companyId || !topicId) {
          const err = { error: 'companyId and topicId required' };
          if (typeof ack === 'function') ack(err);
          return socket.emit('matchmaking:error', err);
        }

        // Team mode MVP: still queues 4 humans; if alone too long, client can keep waiting.
        const result = matchmaking.enqueue({
          userId: socket.user.id,
          socketId: socket.id,
          mode,
          companyId,
          topicId,
          rating: socket.user.rating
        });

        socket.emit('matchmaking:searching', {
          mode,
          companyId,
          topicId,
          queueSize: result.queueSize || 0,
          needed: result.needed || (mode === 'team' ? 4 : 2)
        });

        if (typeof ack === 'function') {
          ack({ ok: true, matched: result.matched, queueSize: result.queueSize });
        }

        if (result.matched) {
          startMatchedBattle(io, result.match);
        } else if (mode === 'solo') {
          // After 2.5s alone, match vs Arena_Bot for local testing
          const key = matchmaking.queueKey({ mode, companyId, topicId });
          setTimeout(() => {
            const filled = matchmaking.fillSoloWithBot(key);
            if (filled.matched) startMatchedBattle(io, filled.match);
          }, 2500);
        }
      } catch (err) {
        console.error(err);
        socket.emit('matchmaking:error', { error: err.message });
      }
    });

    socket.on('matchmaking:leave', () => {
      matchmaking.leave(socket.id);
      socket.emit('matchmaking:left');
    });

    socket.on('battle:join', ({ matchId } = {}) => {
      if (!matchId) return;
      const room = battle.bindSocket(matchId, socket.user.id, socket.id);
      if (!room) {
        return socket.emit('battle:error', { error: 'Unable to join battle' });
      }
      socket.join(`match:${matchId}`);
      socket.emit('battle:state', battle.publicRoomState(room));
    });

    socket.on('battle:code', ({ matchId, code, language } = {}) => {
      const state = battle.updateCode(matchId, socket.user.id, { code, language });
      if (!state) return;
      io.to(`match:${matchId}`).emit('battle:progress', state);
    });

    socket.on('battle:ability', ({ matchId, abilityId, targetUserId } = {}, ack) => {
      try {
        const result = battle.useAbility(matchId, socket.user.id, abilityId, targetUserId);
        io.to(`match:${matchId}`).emit('battle:ability', {
          abilityId: result.abilityId,
          fromUserId: result.fromUserId,
          toUserId: result.toUserId,
          blocked: result.blocked,
          payload: result.payload,
          room: result.room
        });
        if (typeof ack === 'function') ack({ ok: true, result });
      } catch (err) {
        if (typeof ack === 'function') ack({ ok: false, error: err.message });
        socket.emit('battle:error', { error: err.message });
      }
    });

    socket.on('battle:run', async ({ matchId } = {}, ack) => {
      try {
        const result = battle.runCode(matchId, socket.user.id, 'run');
        socket.emit('battle:runResult', result);
        io.to(`match:${matchId}`).emit('battle:progress', result.room);
        if (typeof ack === 'function') ack({ ok: true, result });
      } catch (err) {
        if (typeof ack === 'function') ack({ ok: false, error: err.message });
        socket.emit('battle:error', { error: err.message });
      }
    });

    socket.on('battle:submit', ({ matchId } = {}, ack) => {
      try {
        const result = battle.runCode(matchId, socket.user.id, 'submit');
        socket.emit('battle:submitResult', result);
        io.to(`match:${matchId}`).emit('battle:progress', result.room);

        if (result.verdict.allPassed) {
          const finished = battle.finishMatch(matchId, {
            winnerId: socket.user.id,
            reason: 'solved'
          });
          if (finished) {
            io.to(`match:${matchId}`).emit('battle:ended', finished);
          }
        }

        if (typeof ack === 'function') ack({ ok: true, result });
      } catch (err) {
        if (typeof ack === 'function') ack({ ok: false, error: err.message });
        socket.emit('battle:error', { error: err.message });
      }
    });

    socket.on('battle:forfeit', ({ matchId } = {}) => {
      const finished = battle.forfeit(matchId, socket.user.id);
      if (finished) {
        io.to(`match:${matchId}`).emit('battle:ended', finished);
      }
    });

    socket.on('disconnect', () => {
      matchmaking.leave(socket.id);
      console.log(`[socket] disconnected ${socket.user?.username}`);
    });
  });
}

function startMatchedBattle(io, match) {
  // Notify each player
  for (const player of match.players) {
    io.to(player.socketId).emit('matchmaking:found', {
      matchId: match.id,
      mode: match.mode,
      company: match.company,
      topic: match.topic,
      players: match.players.map(({ socketId, ...rest }) => rest),
      countdown: 3
    });
  }

  // Countdown then open room
  setTimeout(() => {
    const room = battle.createRoom(match);
    for (const player of match.players) {
      const s = io.sockets.sockets.get(player.socketId);
      if (s) s.join(`match:${match.id}`);
      io.to(player.socketId).emit('battle:start', {
        matchId: match.id,
        mode: match.mode,
        company: match.company,
        topic: match.topic,
        problem: match.problem,
        durationSeconds: match.durationSeconds,
        players: match.players.map(({ socketId, ...rest }) => rest),
        state: battle.publicRoomState(room)
      });
    }

    // Auto end when timer expires
    setTimeout(() => {
      const current = battle.getRoom(match.id);
      if (!current || current.ended) return;
      const finished = battle.finishMatch(match.id, { reason: 'timeout' });
      if (finished) {
        io.to(`match:${match.id}`).emit('battle:ended', finished);
      }
    }, (match.durationSeconds || config.battleDurationSeconds) * 1000);
  }, 3000);
}

module.exports = { registerSockets };
