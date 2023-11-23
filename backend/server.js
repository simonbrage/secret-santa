const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const routes = require('./api/routes');
const cron = require('node-cron');
const { Room, Participant } = require('./model');
const { fetchRoomData } = require('./utility');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // No restrictions on origin
    methods: ["GET", "POST"]
  }
});

app.use(express.json()); // For parsing application/json

app.use(cors({
  origin: '*' // No restrictions on origin
})); 

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
  console.log('New client connected', socket.id);

  socket.on('joinRoom', async (roomId, userId, userName) => {
    socket.join(roomId);
    console.log(`${userName} (ID: ${userId}) joined room: ${roomId}`);

    // Fetch and send updated room data
    const updatedRoomData = await fetchRoomData(roomId);
    io.to(roomId).emit('updateRoom', updatedRoomData);
  });

  socket.on('gameStarted', (roomId, updatedRoomData) => {
    io.to(roomId).emit('updateRoom', updatedRoomData);
  });

  socket.on('giftPlaced', (roomId, updatedRoomData) => {
    io.to(roomId).emit('updateRoom', updatedRoomData);
  });

  socket.on('leaveRoom', (roomId, userId, userName) => {
    socket.leave(roomId);
    console.log(`${userName} (ID: ${userId}) left room: ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.use('/api', routes);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Scheduled task to run every other hour
cron.schedule('0 */2 * * *', async () => {
  const cutoff = new Date();
  cutoff.setHours(cutoff.getHours() - 24); // 24 hours ago

  console.log(' ');
  console.log(`Scheduled run at ${new Date().toLocaleString()}. Cutoff time: ${cutoff.toLocaleString()}`);

  try {
    console.log(`Attempting to delete rooms created before: ${cutoff.toLocaleString()}`);
    const queryCondition = { createdAt: { $lt: cutoff } };
    console.log(`Deletion condition: `, queryCondition);

    const result = await Room.deleteMany(queryCondition);
    const currentTime = new Date();

    console.log(`${result.deletedCount} room(s) deleted at ${currentTime.toLocaleString()}`);
  } catch (err) {
      console.error('Error deleting rooms at', new Date().toLocaleString(), ':', err);
  }
});