import { Backdrop, Box, Fade, Modal, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { initSocket } from '../socket';
import ACTIONS from '../actions';
import { Toaster } from 'react-hot-toast';
import { toast } from 'react-hot-toast';
import Message from './Message';
import { decryptHelper, encryptHelper } from '../libs/utils';
const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflow: 'hidden',
};

const ChatPanel = ({ open, handleClose }) => {
  /** socket */
  const socket = useRef(null);
  const message = useRef('');
  /** list of message */
  const [listMess, setListMess] = useState([]);

  useEffect(() => {
    const onConnection = async () => {
      socket.current = await initSocket();

      console.log('help', socket.current);

      /** disconnect */

      /** ai response */
      socket.current.on(ACTIONS.AI_RESPONSE, async ({ responseData }) => {
        const { response, sessionId } = decryptHelper(responseData);
        if (response && sessionId) {
          console.log('from ai', response, 'session id', sessionId);
          setListMess((prev) => [...prev, response]);
        } else {
          toast.error('Cannot get response');
        }
      });
    };

    onConnection();

    return () => {
      socket.current.disconnect();
      setListMess([]);
    };
  }, [open]);

  const keyPressHandler = (e) => {
    if (e.key === 'Enter') {
      /** set current message */
      const messageSending = {
        content: message.current.value,
        role: 'user',
        sessionId: socket.current.id,
      };
      const requestData = encryptHelper(messageSending);

      setListMess((prev) => [...prev, messageSending]);
      /** socket emit */
      socket.current.emit(ACTIONS.SEND_MESSAGE, {
        requestData,
      });
      /** remove */
      message.current.value = '';
    }
  };

  return (
    <div>
      <Toaster reverseOrder={false} position="top-right" />
      {/** socket init */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h3">
              Ask AI
            </Typography>
            <div>
              {/** message */}
              <div className="flex flex-col gap-4 ">
                {listMess.map((i, index) => (
                  <Message key={index} variant={i.role}>
                    {i.content}
                  </Message>
                ))}
              </div>
              {/** input */}
              <input
                ref={message}
                onKeyDown={keyPressHandler}
                className="absolute bottom-8 pt-2 pb-2 pl-1 w-[332px]"
                placeholder="Enter message"
              />
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default ChatPanel;
