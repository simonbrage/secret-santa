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
    const { userId, roomCode } = req.body; 

    try {
      const room = await Room.findOne({ roomCode: roomCode });
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
  
      if (room.ownerId.toString() !== userId) {
        return res.status(403).json({ message: "Only the room owner can start the game" });
      }
  
      if (room.participants.length > 0) {
        room.giftOrder = shuffleArray(room.participants.map(p => p._id.toString()));
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
    const { userId, roomCode } = req.body;
    const io = req.io;

    try {
      const room = await Room.findOne({ roomCode: roomCode });
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      // Check if game has started and that game is not over
      if (room.roomStatus !== 1) {
        return res.status(403).json({ message: "Game has not started or is over" });
      }
      
      // Check that the participant is in the room
      const participantIndex = room.participants.findIndex(p => p._id.toString() === userId);
      if (participantIndex === -1) {
        return res.status(404).json({ message: "Participant not found in the room" });
      }

      // Check that it is the participant's turn
      if (room.currentTurn.toString() !== userId) {
        return res.status(403).json({ message: "It is someone else's turn" });
      }

      // Check that the participant has not placed a gift yet
      if (room.participants.find(p => p._id.toString() === userId).hasPlacedGift) {
        return res.status(403).json({ message: "You have already placed a gift" });
      }

      room.participants[participantIndex].hasPlacedGift = true;

      // Check if all participants have placed a gift
      if (room.participants.every(p => p.hasPlacedGift)) {
        room.roomStatus = 2;
      } else {
        // Move to the next participant
        const currentIndex = room.giftOrder.findIndex(id => id.toString() === userId);
        const nextIndex = (currentIndex + 1) % room.giftOrder.length;
        room.currentTurn = room.giftOrder[nextIndex];
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
    const roomId = req.params.roomId;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteRoom = async (req, res) => {
  const { roomCode, userId } = req.body;

  try {
      const room = await Room.findOne({ roomCode: roomCode });
      if (!room) {
          return res.status(404).json({ message: "Room not found" });
      }

      if (room.ownerId.toString() !== userId) {
          return res.status(403).json({ message: "Only the room owner can delete the room" });
      }

      await Room.deleteOne({ roomCode: roomCode });
      res.status(200).json({ message: "Room deleted successfully" });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};