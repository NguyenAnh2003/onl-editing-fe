/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { formats, module } from '../config/QuillConfig';

const Editor = () => {
  const [value, setValue] = useState('');
  const editorRef = useRef(null);

  useEffect(() => {
    editorRef.current = ReactQuill.Quill;
  }, []);

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      modules={module}
      formats={formats}
    />
  );
};

export default Editor;
