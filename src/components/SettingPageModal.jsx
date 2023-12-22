import React, { useEffect, useState } from 'react';
import { Backdrop, Box, Fade, Modal, Typography } from '@mui/material';
import { Toaster, toast } from 'react-hot-toast';
import { getColabsByPageId, getDataByPageId } from '../libs/page.api';
import ColabUserCard from './ColabUserCard';

const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  height: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  'overflow-y': 'scroll',
};

const SettingPageModal = ({ open, handleClose, pageId }) => {
  const [pageData, setPageData] = useState({});
  const [colabUsers, setColabUsers] = useState([]);
  /** fetching colab records */
  useEffect(() => {
    const fetchData = async () => {
      const { data, status } = await getDataByPageId(pageId);
      if (status === 200) setPageData(data);

      const colabRs = await getColabsByPageId(pageId);
      if (colabRs.status === 200) {
        console.log('colab users', colabRs.data);
        setColabUsers(colabRs.data);
      }
    };
    fetchData();
  }, []);

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
              {pageData.name}
            </Typography>
            <div className="h-full w-full flex flex-col gap-3">
              {/** colab users */}
                {colabUsers.map((i, index) => (
                  <ColabUserCard
                    key={index}
                    userId={i.userId}
                    username={i.username}
                    mode={i.mode}
                    pageId={pageId}
                  />
                ))}
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default SettingPageModal;
