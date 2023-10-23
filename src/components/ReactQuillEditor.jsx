/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ACTIONS from '../actions';
import { formats, module } from '../config/quill.config';
import QuillCursors from 'quill-cursors';

Quill.register('modules/cursors', QuillCursors);

const ReactQuillEditor = React.memo(({ socketRef, roomId, client, color, socketId }) => {
  const editorRef = useRef(null);
  const cursorRef = useRef(null);

  /** Init cursor */
  useEffect(() => {
    if (!editorRef.current) return;
    cursorRef.current = editorRef.current?.editor?.getModule('cursors');

    if (cursorRef) {
      cursorRef.current?.createCursor(socketId, client, color);
      console.log(cursorRef.current);
    }
  }, [editorRef, socketId, client, color]);

  useEffect(() => {
    if (!socketRef.current || !editorRef.current) {
      return;
    }
    console.log('ACTIVATE', new Date().toLocaleTimeString());
    /** Load doc */
    socketRef.current?.on(ACTIONS.LOAD_DOC, ({ doc }) => {
      if (doc) {
        console.log(doc);
        
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
      modules={module}
      formats={formats}
      ref={editorRef}
      onChangeSelection={onSelectionChangeHandler}
      onChange={onChangeHandler}
    />
  );
});

export default ReactQuillEditor;
