/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { Menubar } from 'primereact/menubar';
import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { initSocket } from '../socket';
import ACTIONS from '../actions';
import { UserContext } from '../store/UserProvider';
/** ReactQuill config */
import ReactQuill, { Quill } from 'react-quill';
import { formats, module } from '../config/quill.config';
import 'react-quill/dist/quill.snow.css';
/** Pdf export */
import { pdfExporter } from 'quill-to-pdf';
import { saveAs } from 'file-saver';
/** Cursor */
import QuillCursors from 'quill-cursors';
import { searchUser } from '../libs/user.api';
import { AvatarGroup } from 'primereact/avatargroup';
import { Tooltip } from 'primereact/tooltip';
import { Avatar } from 'primereact/avatar';
import UserCard from './UserCard';
/** Toaster */
import { Toaster } from 'react-hot-toast';
import { toast } from 'react-hot-toast';
import { exportPDF } from '../libs/file.api';
/** Register cursor */
Quill.register('modules/cursors', QuillCursors);

/**
 * init socket
 * get currentUser info to join
 * get data from server
 * get page with pageId
 */
const Editor = ({ pageId }) => {
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
  const [pageData, setPageData] = useState({});
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
    console.log('pageId', pageId);
    const onConnection = async () => {
      socketRef.current = await initSocket();

      console.log('from editor', socketRef.current.id);
      /** Join pageId request */
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId: pageId,
        name: currentUser.username,
        userId: currentUser.userId,
      });

      /** Joined pageId res */
      socketRef.current.on(ACTIONS.JOINED, ({ clients, userJoined }) => {
        setUserWs({ socketId: userJoined.socketId, name: userJoined.name, color: userJoined.color, userId: userJoined.usreId }); //
        setGroup(clients);
        // setData({ name: data.name, content: data.content });
      });

      /** load page */
      socketRef.current.on(ACTIONS.LOAD_DOC, ({ data }) => {
        console.log(data);
        setPageData({ name: data.name, content: data.content });

        if (data.content) {
          editorRef.current?.editor.setContents(data.content);
        }
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
    /** function call init */
    onConnection();
    console.log('init connection', pageData && pageData.content);

    /** remove state */
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      setUserSearched();
      searchUserRef.current.value = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId, socketRef]);

  useEffect(() => {
    /** init currentUser cursor */
    cursorRef.current = editorRef.current?.editor?.getModule('cursors');
    if (userWs && cursorRef.current && currentUser) {
      console.log(userWs);
      cursorRef.current?.createCursor(userWs.socketId, userWs.name, '#0000');
    }
  }, [cursorRef, userWs]);

  /** init clients cursors */
  useEffect(() => {
    console.log(group);
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
    try {
      const { data } = await searchUser(searchUserRef.current.value);
      console.log(data);
      setUserSearched(data);
    } catch (error) {
      console.error(error);
    }
  };

  /** export PDF */
  const exportPDFHandler = async () => {
    /** send delta to server */
    const delta = editorRef.current.editor.getContents();
    const { data, status } = await exportPDF(delta, pageData.name);
    console.log(status);
    console.log(data);
    if (status === 200) {
      saveAs(data, `${pageData.name}.pdf`);
    }
  };

  return (
    <div>
      {/** Toaster */}
      <Toaster reverseOrder={false} position="top-right" />
      <p className="text-center text-2xl pt-3 mb-9">
        <b className="underline">{pageData.name}</b>
      </p>
      <div className="flex flex-row justify-between pl-3 pr-3 pb-4">
        <div>
          <Menubar
            model={[]}
            start={
              <AvatarGroup>
                {group
                  .filter((x) => x.userId !== currentUser.userId)
                  .map((i) => (
                    <Fragment key={i.socketId}>
                      <Tooltip target={`#avatar_${i.socketId}`} content={i.name} position="top"></Tooltip>
                      <Avatar
                        id={`avatar_${i.socketId}`}
                        label={i.name.charAt(0)}
                        shape="circle"
                        style={{ backgroundColor: i.color }}
                        className="transition-all	transition-duration-200 border-2 border-transparent text-white"
                      />
                    </Fragment>
                  ))}
              </AvatarGroup>
            }
          />
        </div>
        <div className="flex flex-row gap-2">
          <div>
            <button
              onClick={exportPDFHandler}
              className="p-2.5 pl-5 pr-5 ml-2 text-sm font-medium text-white bg-black rounded-lg border border-black focus:outline-none "
            >
              PDF
            </button>
          </div>
          {/* textfield search for users to add to pageId */}
          <div className="flex flex-col">
            <div>
              <form className="flex items-center">
                <div className="w-full">
                  <input
                    type="text"
                    ref={searchUserRef}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:outline-none block w-full pl-5 p-2.5"
                    placeholder="Search by name..."
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
            {userSearched ? (
              <UserCard setValue={setUserSearched} pageId={pageId} userId={userSearched.userId} username={userSearched.username} />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      {/* React Quill Editor */}
      <ReactQuill
        theme="snow"
        ref={editorRef}
        modules={module}
        formats={formats}
        // value={data.content}
        onChange={textChangeHandler}
        onChangeSelection={selectionChangeHandler}
      />
    </div>
  );
};

export default Editor;
