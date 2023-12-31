/* eslint-disable no-unused-vars */
/* eslint-disable react/display-name */
import React from 'react';
import { addUserToPage } from '../../libs/page.api';
import { FaSkullCrossbones } from 'react-icons/fa6';
/** Toaster */
import { Toaster } from 'react-hot-toast';
import { toast } from 'react-hot-toast';

// eslint-disable-next-line react/prop-types
const UserCard = React.memo(({ pageId, userId, username, setValue }) => {
  const addHandler = async () => {
    try {
      console.log('seached', userId, 'and', pageId);
      const { data, status } = await addUserToPage(userId, pageId, username);
      if (status === 200) {
        console.log('add page', data);
        toast.success('Success in adding');
      } else {
        toast.error(data);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.data);
    }
  };

  const remove = () => {
    setValue();
  };

  return (
    <>
      {/** Toaster */}
      <Toaster reverseOrder={false} position="top-right" />
      {/* user info */}
      {username ? (
        <div className="flex flex-row bg-white pl-3 pr-3 p-2 mt-3 justify-between">
          <div onClick={addHandler} className="w-full">
            <p className="text-xl">{username}</p>
          </div>
          <FaSkullCrossbones onClick={remove} size={24} />
        </div>
      ) : (
        <></>
      )}
    </>
  );
});

export default UserCard;
