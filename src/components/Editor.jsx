/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { Menubar } from 'primereact/menubar';
import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
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
import { AvatarGroup } from 'primereact/avatargroup';
import { Tooltip } from 'primereact/tooltip';
import { Avatar } from 'primereact/avatar';
import { Tag } from 'primereact/tag';
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
    /**
     * Init connection first with user join
     * after that listening every event from client
     * including disconnect
     */
    const onConnection = async () => {
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
    onConnection();
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
      cursorRef.current?.createCursor(userWs.socketId, userWs.name, '#0000');
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
      <p className="text-center text-2xl pt-3">
        <b className="underline">{data.name}</b>
      </p>
      <div className="flex flex-row justify-between pl-3 pr-3 pb-4">
        <div>
          <Menubar
            model={[]}
            start={
              <AvatarGroup>
                {group.map((i) => (
                  <Fragment key={i.socketId}>
                    <Tooltip target={`#avatar_${i.socketId}`} content={i.name} position="top"></Tooltip>
                    <Avatar
                      id={`avatar_${i.socketId}`}
                      label={i.name.charAt(0)}
                      shape="circle"
                      style={{ backgroundColor: i.color }}
                      className="transition-all	transition-duration-200 border-2 border-transparent"
                    />
                  </Fragment>
                ))}
              </AvatarGroup>
            }
          />
        </div>
        {/* textfield search for users to add to pageId */}
        <div className="flex flex-col">
          <div>
            <form className="flex items-center">
              <div className="w-full">
                <input
                  type="text"
                  ref={searchUserRef}
                  id="simple-search"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search branch name..."
                  required
                />
              </div>
              <button
                type="button"
                onClick={searchHandler}
                className="p-2.5 ml-2 text-sm font-medium text-white bg-black rounded-lg border border-black focus:outline-none "
              >
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
                <span className="sr-only">Search</span>
              </button>
            </form>
          </div>
          {userSearched ? <UserSearchedCard pageId={pageId} userId={userSearched.userId} username={userSearched.username} /> : <></>}
        </div>
      </div>
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
