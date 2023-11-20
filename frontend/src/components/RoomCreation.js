import React, { useState } from 'react';

function RoomCreation() {
    const [roomCode, setRoomCode] = useState('');
    const [creatingRoom, setCreatingRoom] = useState(false);

    const handleCreateRoom = () => {
        const generatedCode = "RandomCode123"; // Replace this with actual code generation logic
        setRoomCode(generatedCode);
        setCreatingRoom(true);
        // Additional logic to communicate with backend will be added here
    };
    
    const handleJoinRoom = () => {
        // Logic to join a room using the entered room code
        // Communicate with backend to join the room
    };

    return (
        <div>
            {!creatingRoom ? (
                <div>
                    <button onClick={handleCreateRoom}>Create Room</button>
                    <input
                        type="text"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                        placeholder="Enter Room Code"
                    />
                    <button onClick={handleJoinRoom}>Join Room</button>
                </div>
            ) : (
                <div>
                    <p>Room created! Your room code is: {roomCode}</p>
                    <p>Share this code with your friends and family to join.</p>
                </div>
            )}
        </div>
    );
}

export default RoomCreation;
