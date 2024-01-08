import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Popper from '@mui/material/Popper';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import Input from '../Input';

const CreatePageModal = ({ pageName, createPageHandler }) => {
  const inputProps = {
    props: {
      name: 'text',
      type: 'text',
      placeholder: 'Your page name',
    },
    ref: pageName,
  };

  return (
    <>
      <div className="relative top-1 mb-3 ml-5 left-5">
        <PopupState variant="popper" popupId="demo-popup-popper">
          {(popupState) => (
            <div className="left-5">
              <Button variant="contained" {...bindToggle(popupState)}>
                Create new Page
              </Button>
              <Popper {...bindPopper(popupState)} transition>
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={350}>
                    <Paper className="relative top-5 left-10 w-[300px] p-5 border-solid border-2 border-black">
                      <Input {...inputProps.props} ref={inputProps.ref} />
                      <div className='bg-black text-center h-10 flex flex-col align-middle'>
                        <button className='text-white font-bold text-xl' onClick={createPageHandler}>Create</button>
                      </div>
                    </Paper>
                  </Fade>
                )}
              </Popper>
            </div>
          )}
        </PopupState>
      </div>
    </>
  );
};

export default CreatePageModal;
