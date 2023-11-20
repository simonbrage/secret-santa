const { Room, Participant } = require('../model');
const { createUniqueRoomCode, shuffleArray } = require('../utility');
const http = require('http');
const socketIo = require('socket.io');

exports.createRoom = async (req, res) => {
    try {
        const { userName } = req.body;
        
        // Check if userName is provided in the request
        if (!userName || userName.trim() === '') {
            return res.status(400).json({ message: 'Username is required' });
        }

        const roomCode = await createUniqueRoomCode();
        const newRoom = new Room({
          roomCode: roomCode, 
          participants: [],
          giftOrder: []
        });
        newRoom.participants.push({ name: userName });
        newRoom.ownerId = newRoom.participants[0]._id;
        await newRoom.save();

        const userId = newRoom.participants[newRoom.participants.length - 1]._id;
        res.status(200).json({ roomCode: roomCode, userId: userId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.joinRoom = async (req, res) => {
    try {
        const { roomCode, userName } = req.body;

        // Check if roomCode is provided in the request
        if (!roomCode || roomCode.trim() === '') {
            return res.status(400).json({ message: 'Room code is required' });
        }

        // Check if userName is provided in the request
        if (!userName || userName.trim() === '') {
            return res.status(400).json({ message: 'Username is required' });
        }

        const room = await Room.findOne({ roomCode: roomCode });
        if (!room) {
          return res.status(404).json({ message: "Room not found" });
        }
        room.participants.push({ name: userName });
        await room.save();

        const userId = room.participants[room.participants.length - 1]._id;
        res.status(200).json({ roomCode: roomCode, userId: userId });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
};

exports.startGame = async (req, res) => {
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
};

exports.placeGift = async (req, res) => {
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
        io.to(roomCode).emit('nextTurn', { currentTurn: room.currentTurn });
      }
  
      await room.save();
      res.status(200).json({ message: "Gift placed", room: room });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

exports.getRoomState = async (req, res) => {
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
};
