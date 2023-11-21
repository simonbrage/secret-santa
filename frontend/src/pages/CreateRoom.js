import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
// Import Axios or another HTTP client if you need to make API requests

const CreateRoom = () => {
    const [name, setName] = useState('');
    const navigate = useNavigate();
  
    const handleCreate = async () => {
      // Call API to create room
      // On success, navigate to the room lobby
      // navigate('/room-lobby', { state: { roomData: response.data } });
    };

  return (
    <div className="h-screen flex flex-col mx-auto text-center p-12 justify-center items-center">
      <div className="flex flex-col justify-center items-center h-44">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="What's your name?" className="border-2 border-gray-300 rounded-xl w-full p-4 mb-2 text-center font-bold text-lg" />
        <button onClick={handleCreate} className="bg-xmasBrightGreen hover:bg-xmasGreen text-white font-bold py-2 mb-6 w-full rounded-xl drop-shadow-md border-none">
            Create Room
        </button>
        <Link to="/" className="inline-flex bg-gray-500 hover:bg-gray-700 text-white text-center items-center justify-center font-bold w-10 h-10 drop-shadow-md border-none rounded-full">
            <CloseIcon className="m-3" />
        </Link>
      </div>  
    </div>
  );
};

export default CreateRoom;