/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useContext, useEffect, useRef } from 'react';
import { initSocket } from '../socket';
import ACTIONS from '../actions';
import { UserContext } from '../store/UserProvider';

/**
 * init socket
 * get currentUser info to join
 * get data from server
 * get page with pageId
 */
const Editor = React.memo(({ pageId }) => {
  const socketRef = useRef(null);
  /** currentUser */
  const { currentUser } = useContext(UserContext);

  /** init socket */
  useEffect(() => {
    const initConnection = async () => {
      socketRef.current = await initSocket();

      /** Join pageId request */
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId: pageId,
        name: currentUser.username,
      });

      /** Joined pageId res */
      socketRef.current.on(ACTIONS.JOINED, ({ clients, color }) => {
        if (clients && color) console.log(clients, color);
      });
    };
    initConnection();
  }, [pageId]);

  useEffect(() => {
    console.log(pageId);
  }, [pageId]);


  return (
    <div>
      <></>
    </div>
  );
});

export default Editor;
