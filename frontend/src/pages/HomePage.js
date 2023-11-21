import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="flex flex-col h-screen w-full mx-auto text-center justify-center items-center p-4">
      <h1 className="sm:text-7xl text-5xl font-bold mb-8 text text-xmasDarkRed font-xmas drop-shadow-md">Secret Santa</h1>
      <div className="sm:w-60 w-48 grid grid-cols-1 gap-2 text-xl justify-center items-center">
        <Link to="/create-room" className="bg-xmasBrightGreen hover:bg-xmasGreen text-white font-bold py-2 px-4 rounded-xl drop-shadow-md border-none">
        Create Room
        </Link>
        <Link to="/join-room" className="bg-xmasBrightRed hover:bg-xmasRed text-white font-bold py-2 px-4 rounded-xl drop-shadow-md border-none">
        Join Room
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
