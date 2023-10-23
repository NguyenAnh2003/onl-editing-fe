/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import UserCard from '../components/UserCard';
// import Editor from '../components/Editor';
import { initSocket } from '../socket';
import ACTIONS from '../actions';
import ReactQuillEditor from '../components/ReactQuillEditor';
import TextEditor from '../components/TextEditor';

const EditRoom = () => {
  const { roomId } = useParams();
  const socketRef = useRef(null);
  const location = useLocation();
  const [clients, setClients] = useState([]);
  const [color, setColor] = useState();
  const [socketId, setSocketId] = useState();
  const [name, setName] = useState();

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

      /** setName */
      setName(location.state?.name);

      /**
       * Listenning for joining people
       */
      socketRef.current.on(ACTIONS.JOINED, ({ clients, name, socketId, color }) => {
        // if (name === location.state?.name) {
        //   console.log(`Success joined: ${name}`);
        // }
        console.log(`username: ${name} - ${color} - ${socketId} clients: ${clients}`);
        console.log(clients);
        /**
         * set info for cursor
         * color
         * name - client
         * socketId || name
         * */
        setColor(color);
        setSocketId(socketId);
        /** clients */
        setClients(clients);
      });

      /**
       * disconnect
       */
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, name }) => {
        console.log(`${name} left room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };

    /** init */
    init();

    /** remove */
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
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
          <UserCard key={i.socketId} name={i.name} />
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
      {socketRef && roomId && name && color && socketId && (
        <ReactQuillEditor socketRef={socketRef} roomId={roomId} client={name} color={color} socketId={socketId} />
      )}
    </div>
  );
};

export default EditRoom;
