/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import UserCard from '../components/UserCard';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import ACTIONS from '../actions';

const EditRoom = () => {
  const { roomId } = useParams();
  const socketRef = useRef(null);
  const location = useLocation();
  const [clients, setClients] = useState([]);
  console.log(roomId);

  useEffect(() => {
    const init = async () => {
      /**
       *
       */
      
      socketRef.current = await initSocket();
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        name: location.state?.name,
      });
    };

    /**
     * Listenning for joining people
     */
    socketRef.current.on(
      ACTIONS.JOINED,
      ({clients, name, socketId}) => {
        
      }
    )
    init();
  }, []);

  const copyRoomIDHandler = (roomId) => {
    navigator.clipboard.writeText(roomId);
  };

  return (
    <div>
      EditRoom
      <p className="text-xl">Room ID: {roomId}</p>
      <>
        {clients.map((i) => (
          <UserCard key={i.name} name={i.name} />
        ))}
      </>
      <div>
        <button
          type="button"
          onClick={copyRoomIDHandler(roomId)}
          className="hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-base font-semibold text-white outline-none"
        >
          Coppy room ID
        </button>
      </div>
      <div>
        <button
          type="button"
          className="mt-10 mb-10 hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-base font-semibold text-white outline-none"
        >
          Leave
        </button>
      </div>
      <Editor />
    </div>
  );
};

export default EditRoom;
