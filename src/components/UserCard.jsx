/* eslint-disable no-unused-vars */
/* eslint-disable react/display-name */
import React from 'react';
import { addUserToPage } from '../libs/page.api';
import { AiOutlinePlusCircle } from 'react-icons/ai';

// eslint-disable-next-line react/prop-types
const UserCard = React.memo(({ pageId, userId, username }) => {
  const addHandler = async () => {
    try {
      console.log('seached', userId, 'and', pageId);
      const res = await addUserToPage(userId, pageId);
      console.log('add page', res.data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      {/* user info */}
      {username ? (
        <div className="flex flex-row bg-white pl-3 pr-3 p-2 mt-3 justify-between">
          <p className="text-xl">{username}</p>
          <AiOutlinePlusCircle onClick={addHandler} size={24} />
        </div>
      ) : (
        <></>
      )}
    </>
  );
});

export default UserCard;
