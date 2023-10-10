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
  const editorRef = useRef(null);
  const [text, setText] = useState(null);
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
            /** set text on quill */
            setText(text);
          }
        }
      );
    }
    /** */
  }, [socketRef?.current, text]);

  const onChangeHandler = (text, delta) => {
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
      value={text}
      onChange={onChangeHandler}
      modules={module}
      formats={formats}
    />
  );
};

export default Editor;
