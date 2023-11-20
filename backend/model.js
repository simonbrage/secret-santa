const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({
  name: String,
  hasPlacedGift: { type: Boolean, default: false },
  // You can add more fields if needed
});

const RoomSchema = new mongoose.Schema({
  roomId: mongoose.Schema.Types.ObjectId,
  ownerId: mongoose.Schema.Types.ObjectId,
  roomCode: { type: String, unique: true },
  roomStatus: { type: Number, default: 0 }, // 0: Not started, 1: Started, 2: All gifts placed
  currentTurn: mongoose.Schema.Types.ObjectId,
  participants: [ParticipantSchema],
  giftOrder: [String],
  // Other fields as needed
});

const Room = mongoose.model('Room', RoomSchema);
const Participant = mongoose.model('Participant', ParticipantSchema);

module.exports = { Room , Participant };

