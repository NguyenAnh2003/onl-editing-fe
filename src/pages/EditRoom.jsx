/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import UserCard from '../components/UserCard';
import { initSocket } from '../socket';
import ACTIONS from '../actions';
import ReactQuillEditor from '../components/ReactQuillEditor';

const EditRoom = () => {
  const { roomId } = useParams();
  const socketRef = useRef(null);
  const location = useLocation();
  const [clients, setClients] = useState([]);
  const [color, setColor] = useState();

  /**
   * Edit room
   * contains user info (name, color(random init first when get info in DB))
   * Then init socketRef to get socketId
   */
  useEffect(() => {
    const init = async () => {
      /* INIT */
      socketRef.current = await initSocket();
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        name: location.state?.name,
      });

      /* Listenning for joining people */
      socketRef.current.on(ACTIONS.JOINED, ({ clients, color }) => {
        setColor(color);
        /* Set clients */
        setClients(clients);
        clients.forEach((name, socketId, color) => console.log(`username: ${name} id:${socketId} color:${color}`));
      });

      /* disconnect */
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
          <UserCard key={i.socketId} name={i.name} socketId={i.socketId} />
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
      {socketRef && roomId && color && clients && (
        <ReactQuillEditor
          socketRef={socketRef}
          socketId={socketRef?.current.id}
          roomId={roomId}
          client={location.state?.name}
          color={color}
          clients={clients}
        />
      )}
    </div>
  );
};

export default EditRoom;
