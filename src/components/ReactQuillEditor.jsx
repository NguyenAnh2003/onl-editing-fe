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
  const currentTime = new Date().toLocaleTimeString();
  const cursorRef = useRef(null);

  /** Init cursor */
  useEffect(() => {
    if (!editorRef.current) return; 
    cursorRef.current = editorRef.current.editor.getModule('cursors');

    if (cursorRef) {
      cursorRef.current.createCursor(socketId, client, color);
      console.log(cursorRef.current);
    }
  }, [editorRef]);

  /** Load data from WS */

  /**
   * fetch data from text change
   */
  useEffect(() => {
    if (!socketRef.current || !editorRef.current) {
      console.log('NUll', currentTime);
      return;
    }
    console.log('ACTIVATE');
    /** Load doc */
    socketRef.current.on(ACTIONS.LOAD_DOC, ({ doc }) => {
      console.log(doc);
    });

    // /** fetching text */
    socketRef.current.on(ACTIONS.TEXT_CHANGE, ({ content, client: senderClient }) => {
      console.log(content);
    });
  }, [socketRef, editorRef]);

  /** onTextChange */
  const onChangeHandler = (content, delta, source) => {
    if (!content || !socketRef || source !== 'user') return;
    console.log('socket available', socketRef, 'content', content);
    // console.log(content);
    socketRef.current.emit(ACTIONS.TEXT_CHANGE, { roomId, content, client });
  };

  const onSelectionChangeHandler = (selection, source) => {
    if (selection) {
      // console.log(selection);
      cursorRef.current.moveCursor(socketId, selection) 
    }
  };

  return (
    <div>
      <ReactQuill
        theme="snow"
        modules={module}
        formats={formats}
        ref={editorRef}
        onChangeSelection={onSelectionChangeHandler}
        onChange={onChangeHandler}
      />
    </div>
  );
});

export default ReactQuillEditor;
