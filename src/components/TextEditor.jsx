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

const TextEditor = React.memo(({ socketRef, roomId, client }) => {
  const [quill, setQuill] = useState(null);
  /** setup Quill */
  useEffect(() => {
    const quillObject = new Quill('#main-container', {
      theme: 'snow',
      modules: { toolbar: toolbarOptions },
    });
    setQuill(quillObject);
  }, []);

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
      socketRef.current.on(ACTIONS.TEXT_CHANGE, ({ content, client: senderClient }) => {
        console.log(content ? { content, senderClient } : 'null content');
        /** Avoid feedback loop */
        if (content && senderClient !== client) {
          handleEmit(content);
        }
      });

    /**
     * auto save document
     * then fetch all data in document object
     * Each changes will send to server and update in DB
     */
    // const interval = setInterval(() => {
    //   socketRef.current.emit(
    //     ACTIONS.SAVE_TEXT,
    //     quill.getContents()
    //   );
    // }, 2000);

    return () => {
      quill && quill.off('text-change', handleChange);
      /** socket off */
      socketRef.current.off(ACTIONS.TEXT_CHANGE, handleEmit);
      /** clear interval? */
      // clearInterval(interval);
    };
  }, [quill, socketRef, client]);

  /**
   * load document byId
   * If not exist create directly in DB
   * */
  useEffect(() => {
    if (!quill || !socketRef.current) return;
    /** load doc with once */
    socketRef &&
      socketRef.current.on(ACTIONS.LOAD_DOC, ({ doc }) => {
        if (doc) {
          console.log(`Space available ${doc}`);
          quill.setText(doc);
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
