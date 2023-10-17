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
