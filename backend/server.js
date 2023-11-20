const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const { Room, Participant } = require('./model');
const { createUniqueRoomCode, shuffleArray } = require('./utility');

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Setup Socket.IO

app.use(express.json()); // for parsing application/json

const PORT = process.env.PORT || 3000;

const MONGODB_URI = 'mongodb+srv://simonbrage:talvan6252m@cluster.yfwr4ck.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// ======================== API ========================

// Create room and add user to it
app.post('/create-room', async (req, res) => {
  try {
    const { userName } = req.body;
    const roomCode = await createUniqueRoomCode();
    const newRoom = new Room({
      roomCode: roomCode, 
      participants: [],
      giftOrder: []
    });
    newRoom.participants.push({ name: userName });
    await newRoom.save();
    res.status(201).json({ roomCode: newRoom.roomCode });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Join room for a user
app.post('/join-room', async (req, res) => {
  try {
    const { roomCode, userName } = req.body;
    const room = await Room.findOne({ roomCode: roomCode });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    room.participants.push({ name: userName });
    await room.save();
    res.status(200).json({ message: "Joined room successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start the game
app.post('/start-game', async (req, res) => {
  const { userId, roomCode } = req.body; // Assume userId is passed in the request

  try {
    const room = await Room.findOne({ roomCode: roomCode });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.owner.toString() !== userId) {
      return res.status(403).json({ message: "Only the room owner can start the game" });
    }

    if (room.participants.length > 0) {
      room.giftOrder = shuffleArray(room.participants.map(p => p.userId.toString()));
      room.roomStatus = 1;
      room.currentTurn = room.giftOrder[0]; // Start with the first participant
      await room.save();
      res.status(200).json({ message: "Game started", room: room });
    } else {
      res.status(400).json({ message: "Not enough participants to start the game" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark gift as placed
app.post('/place-gift', async (req, res) => {
  const { userId, roomCode } = req.body; // Assume userId is passed in the request

  try {
    const room = await Room.findOne({ roomCode: roomCode });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const participantIndex = room.participants.findIndex(p => p.userId.toString() === userId);
    if (participantIndex === -1) {
      return res.status(404).json({ message: "Participant not found in the room" });
    }

    room.participants[participantIndex].hasPlacedGift = true;

    // Check if all participants have placed their gifts
    const allGiftsPlaced = room.participants.every(p => p.hasPlacedGift);
    if (allGiftsPlaced) {
      room.roomStatus = 2; // Game completed
    } else {
      // Update the current turn to the next participant in the gift order
      const currentTurnIndex = room.giftOrder.indexOf(userId);
      room.currentTurn = room.giftOrder[(currentTurnIndex + 1) % room.giftOrder.length];
    }

    await room.save();
    res.status(200).json({ message: "Gift placed", room: room });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get room state
app.get('/room-state/:roomCode', async (req, res) => {
  try {
    const roomCode = req.params.roomCode;
    const room = await Room.findOne({ roomCode: roomCode });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});