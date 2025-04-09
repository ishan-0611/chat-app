// server/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors());

io.on('connection', (socket) => {
  console.log('A user connected.');

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);

    const formatted = `[${msg.username}] ${msg.text}\n`;
    fs.appendFile(
      path.join(__dirname, 'data/messages.txt'),
      formatted,
      () => {}
    );
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected.');
  });
});

const PORT = 5001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
