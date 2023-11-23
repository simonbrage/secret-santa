import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="flex flex-col h-screen w-full mx-auto text-center justify-center items-center p-4">
      <h1 className="sm:text-7xl text-5xl font-bold mb-8 text text-xmasDarkRed font-xmas drop-shadow-md">Secret Santa</h1>
      <div className="sm:w-60 w-48 flex flex-row text-xl justify-center items-center">
        <Link to="/create-room" className="inline-flex justify-center items-center bg-xmasBrightGreen hover:bg-xmasGreen text-white font-bold xs:h-28 xs:w-28 h-24 w-24 py-10 px-10 rounded-full drop-shadow-md mr-2">
        Create
        </Link>
        <Link to="/join-room" className="inline-flex justify-center items-center bg-xmasBrightRed hover:bg-xmasRed text-white font-bold xs:h-28 xs:w-28 h-24 w-24 py-10 px-10 rounded-full drop-shadow-md ml-2">
        Join
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
