import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const RoomLobby = () => {
  const [roomData, setRoomData] = useState(null);
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId; // Get userId from state
  const userName = location.state?.userName; // Get userName from state

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/room/${roomId}`);
        setRoomData(response.data);
      } catch (error) {
        console.error('Error fetching room data', error);
        navigate('/');
      }
    };

    fetchRoomData();
  }, [roomId, navigate]);

  if (!roomData) {
    return <div>Loading...</div>; // or some loading indicator
  }

  return (
    <div>
      {/* Display room information */}
      <h1>Room Lobby: {roomData.roomCode}</h1>
      <h1>User: {userId}</h1>
        <h1>Name: {userName}</h1>
      {/* Rest of your component */}
    </div>
  );
};

export default RoomLobby;
