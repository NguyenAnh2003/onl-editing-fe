import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Popper from '@mui/material/Popper';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';

const CreatePageModal = ({pageName, createPageHandler}) => {
  return (
    <>
      <div className="relative top-1 mb-3 ml-5">
        <PopupState variant="popper" popupId="demo-popup-popper">
          {(popupState) => (
            <div className="left-5">
              <Button variant="contained" {...bindToggle(popupState)}>
                Create new Page
              </Button>
              <Popper {...bindPopper(popupState)} transition>
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={350}>
                    <Paper>
                      <Typography sx={{ p: 2 }}>Name of your Page</Typography>
                      <input ref={pageName} />
                      <button onClick={createPageHandler}>Create</button>
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
