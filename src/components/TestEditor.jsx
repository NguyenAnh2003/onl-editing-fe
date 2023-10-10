/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Quill from 'quill';
import { toolbarOptions } from '../config/QuillConfig';
import ACTIONS from '../actions';

const TestEditor = React.memo(
  ({ socketRef, roomId, client }) => {
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
      //
      if (!socketRef.current || !quill) return;

      const handleChange = (delta, oldData, src) => {
        console.log('Emit data', delta);
        if (src !== 'user') return;
        socketRef &&
          socketRef.current.emit(ACTIONS.TEXT_CHANGE, {
            roomId,
            delta,
            client,
          });
      };

      quill && quill.on('text-change', handleChange);

      return () => {
        quill && quill.off('text-change', handleChange);
      };
    }, [quill, socketRef, client]);

    useEffect(() => {
      if (!socketRef.current || !quill) return;
      const handleChange = (delta) => {
        quill && quill.updateContents(delta);
      };

      socketRef &&
        socketRef.current.on(
          ACTIONS.TEXT_CHANGE,
          ({ roomId, delta, client: senderClient }) => {
            console.log({
              roomId,
              delta,
              senderClient,
            });
            if(senderClient !== client) {
            handleChange(delta);
            }
          }
        );

      return () => {
        socketRef &&
          socketRef.current.off(
            ACTIONS.TEXT_CHANGE,
            handleChange
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

export default TestEditor;
