import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { socket } from '../service/socket';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/room/${roomId}`);
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

  useEffect(() => {
    socket.connect();
  
    socket.on('connect', () => {
      console.log("Socket connected:", socket.connected);
      socket.emit('joinRoom', roomId, userId, userName);
    });
  
    return () => {
      socket.emit('leaveRoom', roomId, userId, userName);
      socket.disconnect();
      console.log('Disconnected from server')
    };
  }, [roomId, userId, userName]);

  useEffect(() => {
    socket.on('updateRoom', (updatedRoom) => {
      setRoomData(updatedRoom);
    });
  }, []);

  useEffect(() => {
    if (roomData && roomData.roomStatus === 2) {
      // Disconnect the socket when the game is over
      socket.disconnect();
    }
  }, [roomData]);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomData.roomCode);
    toast('Room code copied to clipboard!');
  };

  const startGame = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/start-game`, { userId: userId, roomCode: roomData.roomCode });
      setRoomData(response.data.room);
      socket.emit('gameStarted', roomId, response.data.room); // Assuming response contains updated room data
    } catch (error) {
      console.error('Error starting the game', error);
    }
  };

  const placeGift = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/place-gift`, { userId, roomCode: roomData.roomCode });
      setRoomData(response.data.room);
      socket.emit('giftPlaced', roomId, response.data.room);
    } catch (error) {
      console.error('Error placing gift', error);
    }
  };

  const dots = '.'.repeat(dotCount);

  if (!userId || !userName) {
    return <div className='w-full h-screen flex justify-center items-center font-black text-5xl p-6 text-center text-gray-900'>Oops, I think you took a wrong turn!</div>;
  }

  if (!roomData) {
    return <div>Loading{dots}</div>;
  }

  return (
    <div className='overflow-y-scroll flex flex-col h-screen justify-center items-center text-center w-full sm:py-12 py-4 xl:px-80 lg:px-72 md:px-40 xs:px-12 px-2'>
      <div className='flex flex-col h-2/6 justify-end items-center w-full mb-4'>
        <div className='flex flex-col mb-4'>
          <h1 className='font-black md:text-4xl lg:text-5xl text-3xl text-gray-900 mb-2'>{userName}</h1>
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
            <button onClick={startGame} className="bg-xmasBrightGreen hover:bg-xmasGreen text-white text-xl font-bold py-3 px-6 rounded-2xl">Start</button>
          </>
        )}
        {roomData.roomStatus === 0 && userId !== roomData.ownerId && (
          <>
            <p className='font-bold text-xl text-gray-900'>Waiting for host to start{dots}</p>
          </>
        )}
        {roomData.roomStatus === 1 && userId === roomData.currentTurn && (
          <>
            <p className='font-bold text-xl text-gray-900 mb-4'>Your turn!</p>
            <button onClick={placeGift} className="inline-flex text-center bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-2xl">Done</button>
          </>
        )}
        {roomData.roomStatus === 1 && userId !== roomData.currentTurn && (
          <p className='font-bold text-xl text-gray-900'>Waiting for your turn{dots}</p>
        )}
        {roomData.roomStatus === 2 && (
          <>
            <p className='font-bold text-xl text-gray-900 mb-4'>You did it!</p>
            <button onClick={() => navigate('/')} className="bg-xmasRed hover:bg-xmasDarkRed text-white font-bold py-3 px-6 rounded-2xl">Finish</button>
          </>
        )}
      </div>
      <ToastContainer position="top-center" transition={Slide} pauseOnFocusLoss={false} pauseOnHover={false} hideProgressBar={true} autoClose={4000} />
    </div>
  );
};

export default RoomLobby;
