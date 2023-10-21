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

const TextEditor = React.memo(({ socketRef, roomId, client }) => {
  const [quill, setQuill] = useState(null);
  /** flag change */
  const [flag, setFlag] = useState(false);

  /** set up Quill cursor */
  const cursorRef = useRef(null);

  /** setup Quill */
  useEffect(() => {
    const quillObject = new Quill('#main-container', {
      theme: 'snow',
      modules: { toolbar: toolbarOptions, cursors: { transformOnTextChange: true } },
    });
    setQuill(quillObject);
  }, []);

  /** set up Quill cursor
   * Quill cursor setup
   * including createCursor('cursor', 'client', 'color')
   */
  useEffect(() => {
    if (!quill) return;
    cursorRef.current = quill.getModule('cursors');

    /** Validate cursor */
    if (cursorRef) {
      /** create cursor */
      const cursor = cursorRef.current.createCursor('cursor', client, 'red');
      // cursorRef.current.addCursor(cursor)
      console.log(`cursor available ${cursor}`);
    }
  }, [quill, cursorRef]);

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
    if (!socketRef.current || !quill) return;

    const handleChange = (content, oldData, src) => {
      if (src !== 'user') return;

      /** set Flag */
      setFlag(true);
      console.log('content component', content);

      /** emit on text change */
      socketRef &&
        socketRef.current.emit(ACTIONS.TEXT_CHANGE, {
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
      socketRef.current.on(ACTIONS.TEXT_CHANGE, ({ content, client: senderClient }) => {
        console.log(content ? { content, senderClient } : 'null content');
        /** Avoid feedback loop */
        if (content && senderClient !== client) {
          handleEmit(content);
        }
      });

    return () => {
      quill && quill.off('text-change', handleChange);
      /** socket off */
      socketRef.current.off(ACTIONS.TEXT_CHANGE, handleEmit);
    };
  }, [quill, socketRef, client, flag]);

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
        socketRef.current.emit(ACTIONS.SAVE_TEXT, { roomId, content: quill.getContents() });
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
});

export default TextEditor;
