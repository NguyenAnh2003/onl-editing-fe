/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import uuid from 'react-uuid';

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [name, setName] = useState('');

  const createNewRoom = () => {
    const id = uuid();
    console.log('create room id', id);
    setRoomId(id);
  };

  const joinRoomHandler = () => {
    navigate(`editor/${roomId}`, {
      state: { name },
    });
  };

  return (
    <div>
      <div className="flex items-center justify-center p-12">
        <div className="mx-auto w-full max-w-[550px]">
          <form onSubmit={joinRoomHandler}>
            <div className="mb-5">
              <label htmlFor="text" className="mb-3 block text-base font-medium text-[#07074D]">
                RoomID
              </label>
              <input
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                type="text"
                placeholder="Room ID"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="email" className="mb-3 block text-base font-medium text-[#07074D]">
                Your name
              </label>
              <input
                type="text"
                name="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Your name"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>

            <div>
              <button type="submit" className="hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-base font-semibold text-white outline-none">
                Join
              </button>
            </div>
          </form>
          <div>
            <button type="button" onClick={createNewRoom} className="underline text-xl">
              New Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
