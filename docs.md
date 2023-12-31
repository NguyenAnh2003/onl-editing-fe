### Refs
https://docs.yjs.dev/getting-started/a-collaborative-editor
https://atharmohammad.medium.com/tutorial-make-a-real-time-code-editor-in-react-using-yjs-code-n-collab-d843fad6661
https://crdt.tech/
https://www.velotio.com/engineering-blog/build-collaborative-editor-using-quill-and-yjs
https://reactjsexample.com/a-custom-textarea-yjs-binding-using-react/
entire https://www.youtube.com/watch?v=jOv8jb6rCU0
https://culture.kissflow.com/render-react-component-inside-quill-without-losing-context-151eac4eda08

### Source
https://github.dev/kunaltyagi9/MERN-Stack-Projects/blob/master/google-docs-clone/client/src/component/Editor.jsx

https://self-adi.medium.com/real-time-collaborative-editing-in-your-web-application-a2af6baa72ca

## read file docx js
!!https://search.brave.com/search?q=read+data+form+docx+js&source=desktop
docx4js: https://www.npmjs.com/package/docx4js
word-extractor: https://www.npmjs.com/package/word-extractor

Quill cursor : https://www.npmjs.com/package/quill-cursors

## upload image and embed
https://stackoverflow.com/questions/59602182/quill-add-image-url-instead-of-uploading-it 

### Theory
p2p steps:
+ Agree to begin communication
+ Know how to locate one another
+ Bypass security and firewall protections
+ Transmit all multimedia communications in real time

#### Multiple useEffect
https://stackoverflow.com/questions/54002792/in-general-is-it-better-to-use-one-or-many-useeffect-hooks-in-a-single-component

### Bugs
## Avoid feedback loop
The issue you're encountering, where the delta (text change) events are continuously displayed and won't stop, is likely due to how you are handling text changes and emitting events in your code. It appears that you are emitting text change events both when you receive them and when you make local changes, leading to a feedback loop.

When you receive a TEXT_CHANGE event from the server, you emit it back to all connected clients in the same room, including the client that sent the original change. This results in a feedback loop because each client receives its own event and keeps emitting it.

When you make a local change in your quill editor, you also emit a TEXT_CHANGE event to the server, which is then broadcasted to all clients, including the client that initiated the change. This local change triggers additional events.


### Quill js image saved in based64 solution
https://www.youtube.com/watch?v=tR9a9rwfruM

### MUI
popup: https://mui.com/material-ui/react-popper/#material-ui-popup-state

<!-- component variants -->
### component variants
forwardRef: https://legacy.reactjs.org/docs/forwarding-refs.html
https://akhilaariyachandra.com/snippets/using-clsx-or-classnames-with-tailwind-merge
https://github.com/michellejt/button-component-variants/blob/main/src/components/Button.js

<!-- image sharing socketio -->
https://www.cometchat.com/tutorials/react-chat-image-sharing
https://morioh.com/a/b551f429ca28/implement-file-uploads-and-likes-in-a-react-chatroom

<!-- encryption -->
1. https://medium.com/@asttle1997/encryption-in-react-react-native-and-node-js-ceee589f429f
2. https://search.brave.com/search?q=architecture+of+encryption+reactjs+nodejs&source=desktop
3. https://www.section.io/engineering-education/data-encryption-and-decryption-in-node-js-using-crypto/
4. https://www.workfall.com/learning/blog/how-to-perform-encryption-and-decryption-of-messages-using-crypto-in-node-js/
5. https://medium.com/@vinaymahamuni/rsa-encryption-in-react-and-decryption-in-node-js-4e48dae2f072