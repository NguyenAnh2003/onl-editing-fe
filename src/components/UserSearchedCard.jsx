/* eslint-disable no-unused-vars */
/* eslint-disable react/display-name */
import React from 'react';
import { addUserToPage } from '../libs/page.api';

// eslint-disable-next-line react/prop-types
const UserSearchedCard = React.memo(({ pageId, userId, username }) => {
  const addHandler = async () => {
    const res = await addUserToPage(userId, pageId);
    console.log('add page', res.status);
  };
  return (
    <>
      {/* user info */}
      {username ? (
        <div>
          Username: {username}
          <button onClick={addHandler}>Add to this page</button>
        </div>
      ) : (
        <></>
      )}
    </>
  );
});

export default UserSearchedCard;