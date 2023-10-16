/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Quill from 'quill';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { toolbarOptions } from '../config/QuillConfig';
import ACTIONS from '../actions';

const TextEditor = React.memo(
  ({ socketRef, roomId, client}) => {
    const [quill, setQuill] = useState(null);
    /** setup Quill */
    useEffect(() => {
      const quillObject = new Quill('#main-container', {
        theme: 'snow',
        modules: { toolbar: toolbarOptions },
      });
      setQuill(quillObject);
    }, []);

    useEffect(() => {
      /** set up data onChange */
      if (!socketRef.current || !quill) return;

      const handleChange = (content, oldData, src) => {
        if (src !== 'user' || src == 'api') return;

        /** */
        console.log('content component', content);

        /** */
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
        socketRef.current.on(
          ACTIONS.TEXT_CHANGE,
          ({ content, client: senderClient }) => {
            console.log(
              content
                ? { content, senderClient }
                : 'null content'
            );
            /** Avoid feedback loop */
            if (content && senderClient !== client) {
              handleEmit(content);
            }
          }
        );

      return () => {
        quill && quill.off('text-change', handleChange);
        socketRef.current.off(
          ACTIONS.TEXT_CHANGE,
          handleEmit
        );
      };
    }, [quill, socketRef, client]);

    return (
      <div>
        <div
          className="main-container"
          id="main-container"
        ></div>
      </div>
    );
  }
);

export default TextEditor;
