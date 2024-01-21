import React, { useEffect, useRef, useState } from 'react';
import { Backdrop, Box, Fade, Modal, Typography } from '@mui/material';
import { Toaster, toast } from 'react-hot-toast';
import { CiEdit } from 'react-icons/ci';
import { getColabsByPageId, getDataByPageId, updatePageName } from '../../libs/page.api';
import ColabUserCard from '../cards/ColabUserCard';

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
  const [edit, setEdit] = useState(false);
  const nameRef = useRef(null);

  const editMode = {};
  const viewMode = {};

  if (edit) {
    viewMode.display = 'none';
  } else {
    editMode.display = 'none';
  }

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

  /** update handler */
  const updateHandler = async () => {
    try {
      const { data, status } = await updatePageName(pageId, nameRef.current.value);
      if (status === 200) toast.success(data);
    } catch (error) {
      console.error(error);
      toast.error('Cannot update name');
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
            <Typography
              id="transition-modal-title"
              variant="h6"
              component="h3"
              style={viewMode}
              className="flex flex-row items-center gap-4"
            >
              {pageData.name}
              <CiEdit className="cursor-pointer" onClick={() => setEdit(!edit)} />
            </Typography>
            {/** input */}
            <div style={editMode} className="flex flex-row items-center gap-2">
              <input
                className="block border border-grey-light p-1 rounded mb-4 outline-none"
                style={editMode}
                ref={nameRef}
              />
              <CiEdit className="cursor-pointer" onClick={updateHandler} />
            </div>
            <div className="h-full w-full flex flex-col gap-3">
              {/** colab users */}
              {colabUsers.map((i, index) => (
                <ColabUserCard
                  key={index}
                  colabId={i._id} // colabId -> _id
                  userId={i.userId}
                  username={i.username}
                  setColabUsers={setColabUsers}
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
