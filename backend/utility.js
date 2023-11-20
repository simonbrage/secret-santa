const { Room, Participant } = require('./model');

// Method for generating unique room codes
function generateRoomCode(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

async function createUniqueRoomCode() {
    let isUnique = false;
    let newCode;

    while (!isUnique) {
        newCode = generateRoomCode();
        const existingRoom = await Room.findOne({ roomCode: newCode });
        if (!existingRoom) {
            isUnique = true;
        }
    }

    return newCode;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }