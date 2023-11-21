const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const routes = require('./api/routes');
const cron = require('node-cron');
const { Room, Participant } = require('./model');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Setup Socket.IO

app.use(express.json()); // For parsing application/json

app.use(cors({
  origin: 'http://localhost:3001' // Allow only your React app to access
})); // Enable CORS for all routes

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

// Scheduled task to run every hour
cron.schedule('0 */2 * * *', async () => {
  const cutoff = new Date();
  cutoff.setHours(cutoff.getHours() - 24); // 24 hours ago

  try {
    const result = await Room.deleteMany({ createdAt: { $lt: cutoff } });
    const currentTime = new Date();

    console.log(`${result.deletedCount} room(s) deleted at ${currentTime.toLocaleString()}`);
  } catch (err) {
      console.error('Error deleting rooms at', new Date().toLocaleString(), ':', err);
  }
});