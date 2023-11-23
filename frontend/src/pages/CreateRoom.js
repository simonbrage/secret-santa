import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateRoom = () => {
    const [name, setName] = useState('');
    const navigate = useNavigate();
  
    const handleCreate = async () => {
        if (!name) {
          toast("Please enter your name");
          return;
        }
      
        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/create-room`, { userName: name });
            const roomId = response.data.roomId;
            navigate(`/room-lobby/${roomId}`, { state: { userId: response.data.userId, userName: name } });
            toast.success("Room created!");
        } catch (error) {
          console.error('There was an error creating the room', error);
          toast.error("There was an error creating the room");
        }
    };

  return (
    <div className="h-screen flex flex-col mx-auto text-center p-12 justify-center items-center">
      <div className="flex flex-col justify-center items-center h-44">
        <input type="text" maxLength="12" value={name} onChange={(e) => setName(e.target.value)} placeholder="What's your name?" className="border-2 border-gray-300 rounded-xl w-full p-4 mb-2 text-center font-bold text-lg" />
        <button onClick={handleCreate} className="bg-xmasBrightGreen hover:bg-xmasGreen text-white font-bold py-2 mb-6 w-full rounded-xl drop-shadow-md border-none">
            Create Room
        </button>
        <Link to="/" className="inline-flex bg-gray-500 hover:bg-gray-700 text-white text-center items-center justify-center font-bold w-10 h-10 drop-shadow-md border-none rounded-full">
            <CloseIcon className="m-3" />
        </Link>
      </div> 
      <ToastContainer position="top-center" transition={Slide} pauseOnFocusLoss={false} pauseOnHover={false} hideProgressBar={true} autoClose={4000} /> 
    </div>
  );
};

export default CreateRoom;