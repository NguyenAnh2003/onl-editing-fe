/* eslint-disable no-unused-vars */
import { Editor } from '@monaco-editor/react';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { MonacoBinding } from 'y-monaco';
import React, { useRef } from 'react';

const TestPage = () => {
  const editorRef = useRef(null);

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;

    const doc = new Y.Doc();
    const provider = new WebrtcProvider('test-room', doc);
    const type = doc.getText('monaco');

    const binding = new MonacoBinding(
      type,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness
    );
    console.log(provider.awareness);
  };

  return (
    <Editor
      height="100vh"
      width="100vw"
      theme="vs-dark"
      onMount={handleEditorMount}
    />
  );
};

export default TestPage;
