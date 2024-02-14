import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex flex-col h-screen w-full mx-auto text-center justify-center items-center p-4">
      <div className="flex flex-1 flex-col items-center justify-end mb-8 xl:w-2/5 md:w-1/2 sm:w-3/4 w-full">
        <h1 className="sm:text-7xl text-5xl font-bold text mb-4 text-xmasDarkRed font-xmas drop-shadow-md">
          Secret Santa
        </h1>
        <p className="text-xmasDarkRed">
          Take turns carrying out your Secret Santa duty! Create a room to get
          started - or join your friends with their room code. <span className="font-semibold">Tip: </span>
          In smaller spaces, playing loud music can help mask the sound of
          footsteps.
        </p>
      </div>

      <div className="sm:w-60 w-48 flex flex-row text-xl justify-center items-center">
        <Link
          to="/create-room"
          className="inline-flex justify-center items-center bg-xmasBrightGreen hover:bg-xmasGreen text-white font-bold xs:h-28 xs:w-28 h-24 w-24 py-10 px-10 rounded-full drop-shadow-md mr-2"
        >
          Create
        </Link>
        <Link
          to="/join-room"
          className="inline-flex justify-center items-center bg-xmasBrightRed hover:bg-xmasDarkRed text-white font-bold xs:h-28 xs:w-28 h-24 w-24 py-10 px-10 rounded-full drop-shadow-md ml-2"
        >
          Join
        </Link>
      </div>
      <div className="flex flex-col flex-1 items-center justify-end w-full text-xs">
        <p className="text-xmasDarkRed">
          Read more on how to use this tool and report any issues on the public{" "}
          <a
            className="text-xmasBrightGreen"
            href="https://github.com/simonbrage/secret-santa"
          >
            Github repository
          </a>
          . Created by{" "}
          <a className="text-xmasBrightGreen" href="https://simonbrage.dk">
            Simon Brage
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default HomePage;
