/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { initSocket } from '../socket';
import ACTIONS from '../actions';
import { UserContext } from '../store/UserProvider';
import UserCard from './UserCard';
/** ReactQuill config */
import ReactQuill, { Quill } from 'react-quill';
import { formats, module } from '../config/quill.config';
import 'react-quill/dist/quill.snow.css';

/** Cursor */
import QuillCursors from 'quill-cursors';
import { getDataByPageId } from '../libs/page.api';
import { searchUser } from '../libs/user.api';
import UserSearchedCard from './UserSearchedCard';
/** Register cursor */
Quill.register('modules/cursors', QuillCursors);

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
  /** setClients group for pageId perform on UI*/
  const [group, setGroup] = useState([]);
  /** editor ref */
  const editorRef = useRef(null);
  /** search user Ref */
  const searchUserRef = useRef(null);
  /** set Page data */
  const [data, setData] = useState({});
  /** set user after searched */
  const [userSearched, setUserSearched] = useState({});
  /** Cursor */
  const cursorRef = useRef(null);
  /** user WS */
  const [userWs, setUserWs] = useState({});

  /** init socket - change correspond to pageId*/
  useEffect(() => {
    const initConnection = async () => {
      socketRef.current = await initSocket();

      /** Join pageId request */
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId: pageId,
        name: currentUser.username,
        userId: currentUser.userId,
      });

      /** Joined pageId res */
      socketRef.current.on(ACTIONS.JOINED, ({ clients, userJoined }) => {
        setUserWs({ socketId: userJoined.socketId, name: userJoined.name, color: userJoined.color }); //
        setGroup(clients);
      });

      /** onTextChange */
      socketRef.current.on(ACTIONS.TEXT_CHANGE, ({ content, client: senderClient }) => {
        if (currentUser.username !== senderClient) {
          editorRef.current?.editor?.updateContents(content, 'api');
          console.log('not equal');
        }
      });

      /** cursor change */
      socketRef.current.on(ACTIONS.CURSOR_CHANGE, ({ socketId, selection }) => {
        if (selection) {
          cursorRef.current.moveCursor(socketId, selection);
        }
      });

      /** disconnect pageId */
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, name }) => {
        setGroup((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
        /** remove cursor */
        cursorRef.current.removeCursor(socketId);
      });
    };

    /** REST fetch page Data */
    const fetchData = async () => {
      const res = await getDataByPageId(pageId);
      console.log('page data', res.data);
      if (res.status === 200) {
        setData(res.data);
      }
    };

    /** function call init */
    initConnection();
    /** function call REST */
    fetchData();

    /** remove state */
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId]);

  useEffect(() => {
    /** init currentUser cursor */
    cursorRef.current = editorRef.current?.editor?.getModule('cursors');
    if (userWs && cursorRef.current && currentUser) {
      console.log(userWs);
      cursorRef.current?.createCursor(userWs.socketId, userWs.name, "#0000");
    }
  }, [cursorRef, userWs, currentUser]);

  /** init clients cursors */
  useEffect(() => {
    group.forEach(({ socketId, name, color }) => {
      cursorRef.current.createCursor(socketId, name, color);
    });
  }, [group]);

  /** OnTextChange */
  const textChangeHandler = (content, delta, source) => {
    console.log(content, delta, source);
    if (!socketRef) {
      console.log('none socket');
      return;
    }
    if (source === 'user') {
      socketRef && socketRef.current.emit(ACTIONS.TEXT_CHANGE, { roomId: pageId, content: delta, client: currentUser.username });
    }
  };
  /** OnSelectionChange */
  const selectionChangeHandler = (selection, source) => {
    console.log(selection, source);
    if (selection) {
      /** Move cursor code */
      cursorRef.current.moveCursor(userWs.socketId, selection);
      /**
       *  socket Emit data
       * @param pageId
       * @param socketId
       * @param selection
       * */
      socketRef.current.emit(ACTIONS.CURSOR_CHANGE, { roomId: pageId, socketId: userWs.socketId, selection });
    }
  };

  /** Search person Handler */
  const searchHandler = async () => {
    /** searching with REST API */
    const res = await searchUser(searchUserRef.current.value);
    console.log(res);
    setUserSearched(res.data);
  };

  return (
    <div>
      <p>
        <b>Page name: </b>
        {data.name}
      </p>
      <div> Users joined: {group && group.map((i) => <UserCard key={i.socketId} name={i.name} socketId={i.socketId} />)}</div>
      {/* textfield search for users to add to pageId */}
      <input ref={searchUserRef} placeholder="Search to add" />
      <button onClick={searchHandler}>Search</button>
      {userSearched ? <UserSearchedCard userId={userSearched.userId} username={userSearched.username} /> : <></>}
      {/* React Quill Editor */}
      <ReactQuill
        theme="snow"
        ref={editorRef}
        modules={module}
        formats={formats}
        onChange={textChangeHandler}
        onChangeSelection={selectionChangeHandler}
      />
    </div>
  );
});

export default Editor;
