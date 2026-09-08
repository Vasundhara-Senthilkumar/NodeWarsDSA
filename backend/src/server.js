require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');
const config = require('./config');
const { createApp } = require('./app');
const { seed } = require('./db/seed');
const { registerSockets } = require('./sockets');

// Ensure schema + seed on boot
seed();

const app = createApp();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: config.clientOrigin,
    credentials: true
  }
});

registerSockets(io);

server.listen(config.port, () => {
  console.log(`NodeWars API listening on http://localhost:${config.port}`);
  console.log(`Socket.IO ready | CORS origin: ${config.clientOrigin}`);
  console.log(`Demo login: Neon_Ronin / nodewars123`);
});
