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
  ({ socketRef, roomId, client, setDelta }) => {
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

      const handleChange = (delta, oldData, src) => {
        if (src !== 'user') return;

        /** */
        // setDelta(quill.getContents());
        console.log('delta component', delta);

        /** */
        socketRef &&
          socketRef.current.emit(ACTIONS.TEXT_CHANGE, {
            roomId,
            delta,
            client,
          });
      };

      quill && quill.on('text-change', handleChange);

      /** setup update delta */

      const handleEmit = (delta) => {
        quill && quill.updateContents(delta);
      };

      /** fetching data when text change */
      socketRef &&
        socketRef.current.on(
          ACTIONS.TEXT_CHANGE,
          ({ delta, client: senderClient }) => {
            console.log({
              delta,
              senderClient,
            });
            /** Avoid feedback loop */
            if (senderClient !== client) {
              handleEmit(delta);
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
    }, [quill, socketRef, client, setDelta]);

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
