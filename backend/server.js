const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const routes = require('./api/routes');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Setup Socket.IO

app.use(express.json()); // for parsing application/json

// Middleware to attach io to the req object
app.use((req, res, next) => {
  req.io = io;
  next();
});

const PORT = process.env.PORT || 3000;

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinRoom', (roomCode) => {
    socket.join(roomCode);
    console.log(`A user joined room: ${roomCode}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});