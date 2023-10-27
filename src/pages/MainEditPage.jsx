/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { createSpace, getPagesByUserId } from '../libs/page.api';
import Page from '../components/Page';
import { UserContext } from '../store/UserProvider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Popper from '@mui/material/Popper';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import Editor from '../components/Editor';

/**
 * page list
 * editor component
 */

const MainEditPage = () => {
  /** setPageId used for component props onClick */
  const [pageId, setPageId] = useState('');
  const [listPage, setListPage] = useState([]);
  const { currentUser } = useContext(UserContext);
  const pageName = useRef(null);

  useEffect(() => {
    if (!currentUser) return;
    console.log('currentUser', currentUser);
  }, []);


  /** fetching pages from userId */
  useEffect(() => {
    const fetchData = async () => {
      try {
        /** fetch pages by userId*/
        const res = await getPagesByUserId(currentUser.userId);
        console.log(res);
        /** data */
        setListPage(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  /** create page handler  */
  const createPageHandler = async () => {
    /**
     * @param userId
     * @param pageName
     */
    console.log('page name', pageName.current.value);
    try {
      const data = await createSpace(currentUser.userId, pageName.current.value);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="">
        <div className="">
          {/* Modal */}
          <PopupState variant="popper" popupId="demo-popup-popper">
            {(popupState) => (
              <div>
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
          {listPage ? (
            <div className="max-w-xs divide-y">
              {listPage.map((i, index) => (
                <Page key={index} setPageId={setPageId} name={i.name} _id={i._id} />
              ))}
            </div>
          ) : (
            <p>None</p>
          )}
        </div>

        <div className="">{pageId ? <Editor pageId={pageId}/> : <>Leave</>}</div>
      </div>
    </div>
  );
};

export default MainEditPage;
