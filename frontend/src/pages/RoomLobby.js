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
    <div className='flex flex-col h-screen justify-center items-center text-center p-12'>
        <div className='flex flex-col h-1/2 justify-center items-center'>
            <div className='mb-4'>
                <p>Hello</p>
                <h1>{userName}</h1>
            </div>
            <div>
                <p>You are in room</p>
                <h1>{roomData.roomCode}</h1>
            </div>
        </div>
        <div className='flex flex-col h-1/2 justify-center items-center'>
            <button>Start Game</button>
        </div>
    </div>
  );
};

export default RoomLobby;
