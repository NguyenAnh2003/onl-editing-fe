/* eslint-disable no-empty */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ACTIONS from '../actions';
import { formats, module } from '../config/quill.config';
import QuillCursors from 'quill-cursors';

/** Register cursor */
Quill.register('modules/cursors', QuillCursors);

/**
 * @prop pageId
 */
const ReactQuillEditor = React.memo(({ pageId, socketRef, roomId, client, color, socketId, clients }) => {
  const editorRef = useRef(null);
  const cursorRef = useRef(null);
  const [value, setValue] = useState();
  const [flag, setFlag] = useState(false);

  /** Init cursor */
  useEffect(() => {
    if (!editorRef.current) return;
    cursorRef.current = editorRef.current?.editor?.getModule('cursors');

    if (cursorRef) {
      cursorRef.current?.createCursor(socketId, client, color);
      console.log(cursorRef.current);
    }
  }, [editorRef, cursorRef]);

  /** Init load doc */
  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current?.emit(ACTIONS.LOAD_DOC, { roomId });
  }, [roomId]);

  /** save data in space */
  // useEffect(() => {
  //   if (!socketRef.current) return;
  //   if (flag === true) {
  //     setTimeout(() => {
  //       socketRef.current.emit(ACTIONS.SAVE_TEXT, { roomId, content: editorRef.current.editor.getContents() });
  //       setFlag(!flag);
  //     }, 500);
  //   }
  // }, [socketRef, flag]);

  /** clients cursor setup */
  useEffect(() => {
    if (!clients) return;
    console.log('Client group', clients);
    clients.forEach(({ socketId, name, color: colorSender }) => {
      console.log(socketId, name, colorSender);
      cursorRef.current?.createCursor(socketId, name, colorSender);
    });
    console.dir(cursorRef.current);
  }, [clients]);

  /** cursor change */
  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.on(ACTIONS.CURSOR_CHANGE, ({ socketId: senderSocketId, selection }) => {
      if (selection) {
        cursorRef.current.moveCursor(senderSocketId, selection);
      }
    });
  }, [socketRef]);

  useEffect(() => {
    if (!socketRef.current) return;
    /** Load doc */
    socketRef.current?.once(ACTIONS.LOAD_DOC, ({ doc }) => {
      if (doc) {
        console.log(`Space: `, doc);
        setValue(doc);
      }
    });
  }, [socketRef, value]);

  useEffect(() => {
    if (!socketRef.current || !editorRef.current) return;
    console.log('ACTIVATE', new Date().toLocaleTimeString());
    /** fetching text */
    socketRef?.current?.on(ACTIONS.TEXT_CHANGE, ({ content, client: senderClient }) => {
      console.log(content ? content : 'NULL CONTENT');
      if (senderClient !== client) {
        editorRef.current.editor.updateContents(content, 'api');
      }
    });

    /** disconnect */

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.DISCONNECTED, () => cursorRef.current.removeCursor(socketId));
    };
  }, [socketRef]);

  /** onTextChange */
  const onChangeHandler = (content, delta, source) => {
    if (!content || !socketRef || source !== 'user') return;
    console.log('socket available', socketRef, 'content', content);
    /** set Flag for change */
    // setFlag(true);
    /** Emit data */
    socketRef.current?.emit(ACTIONS.TEXT_CHANGE, { roomId, content: delta, client });
  };

  /** onSelectionChange */
  const onSelectionChangeHandler = (selection, source) => {
    if (!socketRef.current) return;
    if (selection) {
      console.log(source);
      cursorRef.current?.moveCursor(socketId, selection);
      /**
       * Send user's cursor data
       * @param socketId
       * @param selection
       * @param source (user, api)
       */
      console.log(socketId, selection, client);
      socketRef.current.emit(ACTIONS.CURSOR_CHANGE, { roomId, socketId, selection,  });
    }
  };

  return (
    <ReactQuill
      theme="snow"
      value={value}
      modules={module}
      formats={formats}
      ref={editorRef}
      onChangeSelection={onSelectionChangeHandler}
      onChange={onChangeHandler}
    />
  );
});

export default ReactQuillEditor;
