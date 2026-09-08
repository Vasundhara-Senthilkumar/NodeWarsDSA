import { io } from 'socket.io-client';
import { getToken } from './api';

let socket = null;

export const connectSocket = () => {
  const token = getToken();
  if (!token) return null;

  if (socket) {
    socket.auth = { token };
    if (!socket.connected) {
      socket.connect();
    }
  } else {
    socket = io({
      auth: { token },
      transports: ['websocket', 'polling'],
      autoConnect: true
    });

    socket.on('connect', () => {
      console.log('[Socket] Connected to Nodewars server');
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
    });
  }

  return socket;
};

export const getSocket = () => {
  const token = getToken();
  if (!token) return null;
  return connectSocket();
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const socketApi = {
  joinMatchmaking(payload) {
    const s = getSocket();
    if (!s) return;
    s.emit('matchmaking:join', payload);
  },

  leaveMatchmaking() {
    const s = getSocket();
    if (!s) return;
    s.emit('matchmaking:leave');
  },

  joinBattle(matchId) {
    const s = getSocket();
    if (!s) return;
    s.emit('battle:join', { matchId });
  },

  sendCodeUpdate(matchId, code, language = 'javascript') {
    const s = getSocket();
    if (!s) return;
    s.emit('battle:code', { matchId, code, language });
  },

  runBattleCode(matchId, ack) {
    const s = getSocket();
    if (!s) return;
    s.emit('battle:run', { matchId }, ack);
  },

  submitBattleCode(matchId, ack) {
    const s = getSocket();
    if (!s) return;
    s.emit('battle:submit', { matchId }, ack);
  },

  useBattleAbility(matchId, abilityId, targetUserId, ack) {
    const s = getSocket();
    if (!s) return;
    s.emit('battle:ability', { matchId, abilityId, targetUserId }, ack);
  },

  forfeitBattle(matchId) {
    const s = getSocket();
    if (!s) return;
    s.emit('battle:forfeit', { matchId });
  }
};
