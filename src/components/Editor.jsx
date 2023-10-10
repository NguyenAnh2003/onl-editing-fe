/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { formats, module } from '../config/QuillConfig';
import ACTIONS from '../actions';

const Editor = ({ socketRef, roomId, client }) => {
  const [val, setVal] = useState("");
  const editorRef = useRef(null);
  /** fetch text with event change */
  useEffect(() => {
    if (socketRef?.current) {
      socketRef?.current.on(
        ACTIONS.TEXT_CHANGE,
        ({ roomId, text, client }) => {
          if (
            roomId !== null &&
            text !== null &&
            client !== null
          ) {
            console.log({ roomId, text, client });
            editorRef.current = text;
          }
        }
      );
    }
    /** */
  }, [socketRef?.current]);

  const onChangeQuill = (text, delta) => {
    // console.log({ text, delta });
    socketRef.current.emit(ACTIONS.TEXT_CHANGE, {
      roomId,
      text,
      client,
    });
  };

  return (
    <ReactQuill
      theme="snow"
      ref={editorRef}
      value={val}
      onChange={onChangeQuill}
      modules={module}
      formats={formats}
    />
  );
};

export default Editor;
