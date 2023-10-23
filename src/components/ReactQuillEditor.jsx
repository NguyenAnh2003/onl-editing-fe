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

Quill.register('modules/cursors', QuillCursors);

const ReactQuillEditor = React.memo(({ socketRef, roomId, client, color, socketId }) => {
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
  }, [editorRef, socketId, client, color]);

  /** Init load doc */
  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current?.emit(ACTIONS.LOAD_DOC, { roomId });
  }, [roomId]);

  /** save data in space */
  

  useEffect(() => {
    if (!socketRef.current || !editorRef.current) {
      return;
    }
    console.log('ACTIVATE', new Date().toLocaleTimeString());
    /** Load doc */
    socketRef.current?.once(ACTIONS.LOAD_DOC, ({ doc }) => {
      if (doc) {
        console.log(`Space: `, doc);
        setValue(doc);
      }
    });

    /** fetching text */
    socketRef?.current?.on(ACTIONS.TEXT_CHANGE, ({ content, client: senderClient }) => {
      console.log(content ? content : 'NULL CONTENT');
      if (senderClient !== client) {
        editorRef.current.editor.updateContents(content, 'api');
      }
    });
  }, [socketRef.current]);

  /** onTextChange */
  const onChangeHandler = (content, delta, source) => {
    if (!content || !socketRef || source !== 'user') return;
    console.log('socket available', socketRef, 'content', content);
    /** set Flag for change */
    setFlag(true);
    /** Emit data */
    socketRef.current?.emit(ACTIONS.TEXT_CHANGE, { roomId, content: delta, client });
  };

  const onSelectionChangeHandler = (selection, source) => {
    if (selection) {
      cursorRef.current?.moveCursor(socketId, selection);
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
