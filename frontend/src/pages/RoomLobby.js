import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { socket } from '../service/socket';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const RoomLobby = () => {
  const [roomData, setRoomData] = useState(null);
  const [iconSize, setIconSize] = useState('default');
  const [dotCount, setDotCount] = useState(1);
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

  useEffect(() => {
    function handleResize() {
      // Adjust these values based on your Tailwind breakpoints
      const width = window.innerWidth;
      if (width > 1280) {
        setIconSize('medium');
      } else if (width < 480) {
        setIconSize('extrasmall');
      } else {
        setIconSize('small');
      }
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount(prevDotCount => (prevDotCount % 3) + 1);
    }, 500); // Update every 500ms

    return () => clearInterval(interval);
  }, []);

  const dots = '.'.repeat(dotCount);

  if (!roomData) {
    return <div>Loading...</div>; // or some loading indicator
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomData.roomCode);
    alert('Room code copied to clipboard!');
  };

  return (
    <div className='flex flex-col h-screen justify-center items-center text-center w-full sm:py-12 py-12 xl:px-80 lg:px-72 md:px-40 xs:px-12 px-2'>
      <div className='flex flex-col h-2/6 justify-end items-center w-full mb-4'>
        <div className='flex flex-col mb-4'>
          <h1 className='font-bold text-7xl text-gray-900'>{userName}</h1>
          <p className='text-xs'>Player ID: {userId}</p>
        </div>
        <div className='flex flex-col rounded-2xl bg-opacity-20 bg-xmasDarkestGreen w-full justify-center items-center sm:py-12 py-4'>
          <p>You are in room</p>
          <div className="flex flex-row mt-2">
            <h1 className='flex justify-center items-center font-black xxl:text-5xl sm:text-3xl text-2xl mr-2 text-gray-900'>{roomData.roomCode}</h1>
            <div onClick={copyToClipboard} className="inline-flex bg-xmasBrightGreen hover:bg-xmasGreen text-white font-bold xxl:p-4 p-3 rounded-full items-center justify-center">
              <ContentCopyIcon fontSize={iconSize} />
            </div>
          </div>
        </div>
      </div>
      <div className='overflow-y-auto xs:overflow-hidden w-full flex flex-col h-1/2 justify-start items-center rounded-2xl bg-opacity-20 bg-xmasDarkestGreen sm:px-12 px-4 sm:py-12 py-4 mb-2 max-h-full'>
        <h1 className='font-black sm:text-3xl text-3xl mb-4 text-gray-900 h-1/6'>Participants</h1>
        <div className='flex flex-col gap-2 overflow-y-auto h-5/6 w-full py-3 px-4 rounded-2xl bg-xmasDarkestGreen bg-opacity-10'>
          {roomData.participants.map((participant, index) => (
            <div key={index} className='flex p-2 rounded-2xl bg-opacity-20 bg-xmasDarkestGreen text-gray-900 text-lg font-bold w-full justify-center items-center drop-shadow-md'>
              {participant.name}
            </div>
          ))}
        </div>
      </div>
      <div className='flex flex-col h-1/6 justify-center items-center'>
        {roomData.roomStatus === 0 && userId === roomData.ownerId && (
          <>
            <button className="bg-xmasBrightGreen hover:bg-xmasGreen text-white text-xl font-bold py-3 px-6 rounded-xl">Start</button>
          </>
        )}
        {roomData.roomStatus === 0 && userId !== roomData.ownerId && (
          <>
            <p className='font-bold text-xl text-gray-900'>Waiting for host to start{dots}</p>
          </>
        )}
        {roomData.roomStatus === 1 && userId === roomData.currentTurn && (
          <>
            <p className='font-bold text-xl text-gray-900'>Your turn! Leave your room and click the button below when you have returned.</p>
            <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">Place Gift</button>
          </>
        )}
        {roomData.roomStatus === 1 && userId !== roomData.currentTurn && (
          <p className='font-bold text-xl text-gray-900'>Waiting for your turn{dots}</p>
        )}
        {roomData.roomStatus === 2 && (
          <>
            <p className='font-bold text-xl text-gray-900'>You did it!</p>
            <button onClick={() => navigate('/')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Back to Home</button>
          </>
        )}
      </div>
    </div>
  );
};

export default RoomLobby;
