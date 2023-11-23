import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const JoinRoom = () => {
  const [roomCode, setRoomCode] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleJoin = async () => {
        if (!roomCode) {
            toast("Please enter a room code");
            return;
        }

        if (!name) {
            toast("Please enter your name");
            return;
        }
    
        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/join-room`, { userName: name, roomCode: roomCode });
            const roomId = response.data.roomId;
            navigate(`/room-lobby/${roomId}`, { state: { userId: response.data.userId, userName: name } });
            toast.success("Room created!");
        } catch (error) {
            console.error('There was an error joining the room', error);
            toast.error("There was an error joining the room");
        }
    };

  return (
    <div className="h-screen flex flex-col mx-auto text-center p-12 justify-center items-center">
      <div className="flex flex-col justify-center items-center h-44">
        <div className='flex flex-col'>
            <input type="text" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} placeholder="Room code..." className="border-2 border-gray-300 rounded-xl mb-2 p-4 text-center font-bold text-lg" />
            <input type="text" maxLength="12" value={name} onChange={(e) => setName(e.target.value)} placeholder="What's your name?" className="border-2 border-gray-300 rounded-xl mb-3 p-4 text-center font-bold text-lg" />
        </div>
        <button onClick={handleJoin} className="bg-xmasBrightGreen hover:bg-xmasGreen text-white font-bold py-2 mb-6 w-full rounded-xl drop-shadow-md border-none">
            Join Room
        </button>
        <Link to="/" className="inline-flex bg-gray-500 hover:bg-gray-700 text-white text-center items-center justify-center font-bold drop-shadow-md border-none rounded-full">
            <CloseIcon className='m-3' />
        </Link>
      </div>  
      <ToastContainer position="top-center" transition={Slide} pauseOnFocusLoss={false} pauseOnHover={false} hideProgressBar={true} autoClose={4000} />
    </div>
  );
};

export default JoinRoom;
