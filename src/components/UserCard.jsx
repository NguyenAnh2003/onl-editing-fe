/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';

const UserCard = ({ name, socketId }) => {
  return (
    <div>
      <p>
        Username {name} Id: {socketId}
      </p>
    </div>
  );
};

export default UserCard;
