/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import React, { useEffect, useReducer, useRef, useState } from 'react';
import Quill from 'quill';
import 'react-quill/dist/quill.snow.css';
import { toolbarOptions } from '../config/quill.config';
import ACTIONS from '../actions';
import QuillCursors from 'quill-cursors';
/** cursor setup */
Quill.register('modules/cursors', QuillCursors);
const CURSOR_LATENCY = 1000;
const TEXT_LATENCY = 500;

const TextEditor = ({ socketRef, roomId, client, color, socketId }) => {
  const [quill, setQuill] = useState(null);
  /** flag change */
  const [flag, setFlag] = useState(false);

  /** set up Quill cursor */
  const cursorRef = useRef(null);

  /** setup Quill */
  useEffect(() => {
    const quillObject = new Quill('#main-container', {
      theme: 'snow',
      modules: {
        toolbar: toolbarOptions,
        cursors: true,
      },
    });
    setQuill(quillObject);
  }, []);

  /** set up Quill cursor
   * Quill cursor setup
   * including createCursor(socketId, 'client', 'color')
   */

  useEffect(() => {
    if (!quill || !client || !socketId || !color) return;
    cursorRef.current = quill.getModule('cursors');
    console.log(`Editor: ${socketId} ${client} ${color}`);
    /** Validate cursor */
    if (cursorRef) {
      /** create cursor */
      cursorRef.current.createCursor(socketId, client, color);
      const currentTime = new Date().toLocaleDateString();
      console.log(`cursor available ${cursorRef.current} ${currentTime}`);
    }
  }, [quill, cursorRef, socketRef, client, socketId, color]);


  /** cursor */
  useEffect(() => {
    if (!cursorRef || !quill || !socketRef) return;
    const selectionChangeHandler = (range, oldRange, source) => {
      if (source !== 'api') return;
      
      /** Sending cursor */
      if (range) {
        console.log(`Make a selection ${range}`);
        socketRef && socketRef?.current.emit(ACTIONS.CURSOR_CHANGE, { socketId, client, roomId, range, source });
        // cursorRef.current?.moveCursor(socketId, range);
      } else {
        console.log('Selection cleared');
      }
    };
    quill && quill.on('selection-change', selectionChangeHandler);

    /**Receive cursor */
    socketRef &&
      socketRef?.current.on(ACTIONS.CURSOR_CHANGE, ({ socketId, client: senderClient, range, source }) => {
        if (senderClient !== client) {
          console.log(cursor, senderClient, range, source);
          if (range) {
            cursorRef.current?.moveCursor(socketId, range);
          }
        }
      });

    return () => {
      quill && quill.off('selection-change', selectionChangeHandler);
    };
  }, [cursorRef, quill, socketRef]);

  /**
   *
   * Set up handle change with quill.on('text-change')
   * to listen on changes in Quill
   * Also fetch data through on(TEXT_CHANGE)
   * when data change will fetch data with client !== senderClient
   *
   */
  useEffect(() => {
    /** set up data onChange */
    if (!socketRef.current || !quill || !client) return;

    const handleChange = (content, oldData, src) => {
      if (src !== 'user') return;

      /** set Flag */
      setFlag(true);
      console.log('content component', content);

      /** emit on text change */
      socketRef &&
        socketRef?.current.emit(ACTIONS.TEXT_CHANGE, {
          roomId,
          content,
          client,
        });
    };

    quill && quill.on('text-change', handleChange);

    /** setup update content */

    const handleEmit = (content) => {
      quill && quill.updateContents(content);
    };

    /** fetching data when text change */
    socketRef &&
      socketRef?.current.on(ACTIONS.TEXT_CHANGE, ({ content, client: senderClient }) => {
        console.log(content ? { content, senderClient } : 'null content');
        /** Avoid feedback loop */
        if (content && senderClient !== client) {
          handleEmit(content);
        }
      });

    return () => {
      quill && quill.off('text-change', handleChange);
      /** socket off */
      socketRef?.current.off(ACTIONS.TEXT_CHANGE, handleEmit);
    };
  }, [quill, socketRef, client]);

  /** rerender when text change - save text */
  useEffect(() => {
    if (!quill) return;
    /**
     * auto save document
     * then fetch all data in document object
     * Each changes will send to server and update in DB
     */

    /**
     * Save on flag true with delay 500
     */
    if (flag === true) {
      setTimeout(() => {
        socketRef?.current.emit(ACTIONS.SAVE_TEXT, { roomId, content: quill.getContents() });
        setFlag(!flag);
      }, 500);
    }
    /** re-render with flag change */
  }, [quill, flag]);

  /**
   * load document byId
   * If not exist create directly in DB
   * */
  useEffect(() => {
    if (!quill || !socketRef.current) return;
    /** load doc with once */
    socketRef &&
      socketRef.current.once(ACTIONS.LOAD_DOC, ({ doc }) => {
        if (doc) {
          console.log(`Space available ${doc}`);
          quill.setContents(doc);
        }
      });
  }, [quill, socketRef, roomId]);

  return (
    <div>
      <div className="main-container" id="main-container"></div>
    </div>
  );
};

export default TextEditor;
